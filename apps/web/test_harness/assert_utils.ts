export interface TestStats {
  passed: number;
  failed: number;
  failures: string[];
}

export class TestRunnerContext {
  passed = 0;
  failed = 0;
  failures: string[] = [];

  assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      this.passed++;
      console.log(`    ✓ PASSED: ${testName}`);
    } else {
      this.failed++;
      const msg = `    ✗ FAILED: ${testName}${detail ? ` - ${detail}` : ''}`;
      console.error(msg);
      this.failures.push(msg);
    }
  }

  assertEqual<T>(actual: T, expected: T, testName: string) {
    const isMatch = JSON.stringify(actual) === JSON.stringify(expected);
    this.assert(isMatch, testName, `Expected: ${JSON.stringify(expected)}, Actual: ${JSON.stringify(actual)}`);
  }

  assertGreaterOrEqual(actual: number, expected: number, testName: string) {
    this.assert(actual >= expected, testName, `Expected >= ${expected}, Actual: ${actual}`);
  }

  assertInRange(actual: number, min: number, max: number, testName: string) {
    this.assert(actual >= min && actual <= max, testName, `Expected in range [${min}, ${max}], Actual: ${actual}`);
  }
}
