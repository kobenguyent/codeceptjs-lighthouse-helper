[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/peternguyew)

# codeceptjs-lighthouse-helper

CodeceptJS Lighthouse helper wraps [lighthouse audit using playwright](https://www.npmjs.com/package/playwright-lighthouse) to perform audit check against your web application.

NPM package: <https://www.npmjs.com/package/codeceptjs-lighthouse-helper>

## Installation

`npm i codeceptjs-lighthouse-helper --save-dev`

## Configuration

This helper should be added in your codeceptjs config file: `codecept.conf.*`

Example:

```
{
...
   helpers: {
     LighthouseHelper: {
      require: 'codeceptjs-lighthouse-helper',
    }
   }
...
}
```

## Usage

- To use this helper, you must enable Playwright helper.
- After install the helper, you can use it by calling `I.runPerformanceCheck()`
- If there is auto-complete for `I` actor, try running `npx codeceptjs def`

### Options

By default, this setting is enabled:

- thresholds: `{
  performance: 10,
  accessibility: 30,
  'best-practices': 30,
  seo: 30,
  pwa: 30,
  }`
- htmlReport: true
- outputDir: 'output',
- reportFileName: 'accessibility-audit.html',
- port: 9222

More info could be found [here](https://www.npmjs.com/package/playwright-lighthouse)

```
Feature("Performance Check with Lighthouse")
	.config({
		chromium: {
			args: [`--remote-debugging-port=9222`],
		},
	})
Scenario("Performance check", async () => {
	I.amOnPage("https://js.devexpress.com/Demos/WidgetsGallery/Demo/Slider/Overview/jQuery/Light/");
	await I.runPerformanceCheck({ reportFileName: 'customname' });
});
```

Output

```
CodeceptJS v3.4.1 #StandWithUkraine
Using test root "/Users/thanh.nguyen/Desktop/codeceptjs-lighthouse-helper/test"
Helpers: Playwright, LighthouseHelper
Plugins: screenshotOnFail, allure

Performance Check with Lighthouse --
    [1]  Starting recording promises
 › [Suite Config] Playwright {"chromium":{"args":["--remote-debugging-port=9222"]}}
    Timeouts: 
 › [Session] Starting singleton browser session
  Performance check
    I am on page "https://js.devexpress.com/Demos/WidgetsGallery/Demo/Slider/Overview/jQuery/Light/"
    I run performance check {"reportFileName":"customname"}


-------- playwright lighthouse audit reports --------


performance record is 74 and desired threshold was 10
accessibility record is 78 and desired threshold was 30
best-practices record is 100 and desired threshold was 30
seo record is 92 and desired threshold was 30
pwa record is 30 and desired threshold was 30
  ✔ OK in 14844ms

 › [Suite Config] Reverted for Playwright

  OK  | 1 passed   // 16s

```

### Parallel Executions
It's a little tricky to run lighthouse tests in parallel due to we need to set a specific port for each test, but it's not impossible.
To do this we need to create a [custom parallel execution](https://codecept.io/parallel/#custom-parallel-execution), an example could
be found at `bin/parallel.js`

Then your test file:
```
const {I} = inject()
let conf = require('codeceptjs').config.get()
let port
const urls = { homepage: 'https://js.devexpress.com/Demos/WidgetsGallery/Demo/Slider/Overview/jQuery/Light/'}

Feature('Performance tests')

Before(() => {
    conf.helpers.Playwright.chromium.args.forEach(arg => {
        if (arg.includes('remote-debugging-port') === true) {
            port = arg.split('=')[1]
        }
    })
})

Object.entries(urls).forEach(item => {
    const [pageName, pageUrl] = item
    Scenario.only(`Lighthouse audit test for ${pageName}`, async () => {
        I.amOnPage(pageUrl)
        await I.runPerformanceCheck({outputDir: 'hello', port})
    })
})

```
