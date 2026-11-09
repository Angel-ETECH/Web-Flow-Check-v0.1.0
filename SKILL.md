---
name: web-flow-check
description: Verify a specific user journey on a local website in a real browser and leave a repeatable Playwright test. Use for requests to comprobar, probar or test expected web behavior on localhost, such as a form, navigation or cart.
---

# Web Flow Check

Turn the requested local flow into a named test with a measurable outcome. The installed skill folder includes the runner and a runnable demo. Read [the README](README.md) for setup and [the example test](examples/local-page.spec.mjs) for the test format.

1. Identify the local URL, the steps, and the expected result. Reuse the app's documented startup command and existing local test data. If the expected result is ambiguous, resolve it from requirements or ask the user. Keep it fixed when diagnosing a failure.
2. If the project already has Playwright tests, use its existing setup. Otherwise, use `node "<skill-directory>/scripts/setup.mjs" workspace "<project>/.web-flow-check"` with absolute paths. Reuse a workspace that already exists. The runner prepares Playwright and Chromium on first use, so run the check directly.
3. Inspect the actual page before writing selectors. Use roles, labels, or stable test IDs. Assert the visible outcome that proves the request, including its exact value or destination when known. Use separate tests for independent scenarios.
4. Save the test under the runner's `checks/` directory and run `npm run check -- <local-url> [test-filter]`. Keep the browser isolated from real accounts. For actions that write data or trigger payments, emails, or integrations, use a test account and a safe local environment. Stop the affected check if those prerequisites are missing.
5. Report each requested check as passed, failed, or unverified. For a failure, include the step, expected and observed behavior, and the evidence location. Distinguish an app failure from setup, missing data, or a selector that needs correction. Give the test path and exact rerun command. Preserve the test when the app fails and fix the app only when asked.

The HTML report and failure artifacts are local. Share or commit them only when requested and reviewed for sensitive data.
