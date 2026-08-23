param(
    # Which reachability path to deploy through (same physical server):
    #   acerblue-local -> LAN  (192.168.10.3)
    #   acerblue       -> via Cloudflare (acerblue.lmntea.fun / cloudflared access ssh)
    #   both           -> acerblue-local FIRST, then acerblue (default)
    [ValidateSet("acerblue-local", "acerblue", "both")]
    [string]$Target = "both",
    [switch]$SkipHealthCheck
)

$ErrorActionPreference = "Stop"

# Real project location on the server (confirmed: ~/deploy/ruangpulih is the live directory)
$REMOTE_DIR = "~/deploy/ruangpulih"
$ARCHIVE = "groundease_deploy.tar.gz"

function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor Cyan
}

function Write-Run {
    param([string]$Command)
    Write-Host "+ $Command" -ForegroundColor DarkGray
}

function Assert-NativeSuccess {
    param([string]$Step)
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code ${LASTEXITCODE}: $Step"
    }
}

# ---------------------------------------------------------------- archive
Write-Step "Creating deployment archive"
Write-Run "tar (exclude node_modules/.git/dist/test_harness) -> $ARCHIVE"
tar --exclude="node_modules" --exclude=".git" --exclude="dist" --exclude="apps/web/test_harness" --exclude="apps/web/vite-dev*.log" -cvzf $ARCHIVE apps docker-compose.yml package.json package-lock.json
Assert-NativeSuccess "tar archive"

$archiveInfo = Get-Item -LiteralPath $ARCHIVE
Write-Host "Archive: $($archiveInfo.FullName)"
Write-Host "Archive size: $([math]::Round($archiveInfo.Length / 1MB, 2)) MB"

# ---------------------------------------------------------- per-host deploy
function Deploy-ToHost {
    param([string]$HostName)

    Write-Step "Deploying to $HostName"
    Write-Run "ssh $HostName mkdir -p $REMOTE_DIR"
    ssh -o BatchMode=yes -o ConnectTimeout=15 $HostName "mkdir -p $REMOTE_DIR"
    Assert-NativeSuccess "mkdir -p on $HostName"

    Write-Run "scp $ARCHIVE ${HostName}:${REMOTE_DIR}/"
    scp -o BatchMode=yes -o ConnectTimeout=15 $ARCHIVE "${HostName}:${REMOTE_DIR}/"
    Assert-NativeSuccess "scp archive to $HostName"

    Write-Step "Extracting and (re)deploying stack on $HostName"
    $deployScript = (@'
set -eux
cd {DIR}
tar -xzvf {ARCHIVE}
rm -f {ARCHIVE}
# Old stack (frontend/backend service names) is stopped & removed here;
# mongo-data volume is preserved (no -v flag).
docker compose down --remove-orphans || echo "down skipped (nothing to stop)"
docker compose build --no-cache
docker compose up -d
docker compose ps
'@ -replace '\{DIR\}', $REMOTE_DIR -replace '\{ARCHIVE\}', $ARCHIVE) -replace "`r`n", "`n" -replace "`r", ""

    Write-Run "ssh $HostName (extract + compose down + up --build -d)"
    ssh -o BatchMode=yes -o ConnectTimeout=20 $HostName $deployScript
    Assert-NativeSuccess "remote deploy on $HostName"

    if (-not $SkipHealthCheck) {
        Write-Step "Health check on $HostName (web :3000 + api /api/health :5000)"
        $healthScript = (@'
cd {DIR}
ok=0
for i in $(seq 1 12); do
  web=$(curl -s -o /dev/null -w "%{http_code}" -m 5 http://localhost:3000/)
  api=$(curl -s -o /dev/null -w "%{http_code}" -m 5 http://localhost:5000/api/health)
  echo "health attempt $i: web=$web api=$api"
  if [ "$web" = "200" ] && [ "$api" = "200" ]; then ok=1; break; fi
  sleep 3
done
[ "$ok" = "1" ]
'@ -replace '\{DIR\}', $REMOTE_DIR) -replace "`r`n", "`n" -replace "`r", ""
        Write-Run "ssh $HostName (health check)"
        ssh -o BatchMode=yes -o ConnectTimeout=60 $HostName $healthScript
        Assert-NativeSuccess "health check on $HostName"
        Write-Host "Health check PASSED on $HostName (web=200, api=200)" -ForegroundColor Green
    } else {
        Write-Host "Health check skipped (-SkipHealthCheck)" -ForegroundColor DarkGray
    }
}

# Order: acerblue-local FIRST, then acerblue through Cloudflare.
switch ($Target) {
    "acerblue-local" { Deploy-ToHost "acerblue-local" }
    "acerblue"       { Deploy-ToHost "acerblue" }
    "both"           {
        Deploy-ToHost "acerblue-local"
        Deploy-ToHost "acerblue"
    }
}

# ---------------------------------------------------------------- cleanup
Write-Step "Cleaning local archive"
Remove-Item -LiteralPath $ARCHIVE -Force

Write-Host ""
Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Deployment complete ($Target)" -ForegroundColor Green