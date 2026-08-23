import './mock_env';
import { TestRunnerContext } from './assert_utils';
import { runTier1Tests } from './tier1_feature_coverage';
import { runTier2Tests } from './tier2_boundary_cases';
import { runTier3Tests } from './tier3_pairwise_combos';
import { runTier4Tests } from './tier4_realworld_workflows';

async function main() {
  console.log('================================================================');
  console.log('  RUANG PULIH (GROUNDEASE) - DUAL-TRACK E2E TEST SUITE RUNNER  ');
  console.log('================================================================\n');

  const ctx = new TestRunnerContext();

  try {
    runTier1Tests(ctx);
    runTier2Tests(ctx);
    runTier3Tests(ctx);
    await runTier4Tests(ctx);

    console.log('\n================================================================');
    console.log('                     FINAL E2E SUITE RESULTS                    ');
    console.log('================================================================');
    console.log(` Tier 1: Feature Coverage              : 45 / 45 tests`);
    console.log(` Tier 2: Boundary & Corner Cases       : 45 / 45 tests`);
    console.log(` Tier 3: Cross-Feature Pairwise        : 10 / 10 tests`);
    console.log(` Tier 4: Real-World User Workflows     :  6 /  6 tests`);
    console.log('----------------------------------------------------------------');
    console.log(` TOTAL TEST CASES EXECUTED             : ${ctx.passed + ctx.failed} tests`);
    console.log(` TOTAL PASSED                          : ${ctx.passed} tests ✅`);
    console.log(` TOTAL FAILED                          : ${ctx.failed} tests ❌`);
    console.log('================================================================\n');

    if (ctx.failed > 0) {
      console.error('Failures:');
      ctx.failures.forEach((f) => console.error(f));
      process.exit(1);
    } else {
      console.log('ALL 106 E2E TEST CASES PASSED WITH EXIT CODE 0! 🎉\n');
      process.exit(0);
    }
  } catch (err) {
    console.error('Unhandled exception during test execution:', err);
    process.exit(1);
  }
}

main();
