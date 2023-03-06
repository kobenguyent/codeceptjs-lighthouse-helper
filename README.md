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
Feature('lighthouse Check');

Scenario.only('lighthouse check',  async ({ I }) => {
    I.amOnPage('https://js.devexpress.com/Demos/WidgetsGallery/Demo/Slider/Overview/jQuery/Light/')
    await I.runPerformanceCheck({ outputDir: 'hello'})
});
```

Output

```
Helpers: Playwright, LighthouseHelper
Plugins: screenshotOnFail, tryTo, retryTo, eachElement

Lighthouse Audit tests --
    [1]  Starting recording promises
    Timeouts: 
 › [Session] Starting singleton browser session
  Lighthouse Audit tests for homepage
    --- STARTED "before each" hook: Before for "Lighthouse Audit tests for homepage" ---
    [1] Stopping recording promises
    [2]  Starting recording promises
    --- ENDED "before each" hook: Before for "Lighthouse Audit tests for homepage" ---
    I am on page "https://js.devexpress.com/Demos/WidgetsGallery/Demo/Slider/Overview/jQuery/Light/"
    I run performance check {"outputDir":"hello","port":"9222"}


-------- playwright lighthouse audit reports --------


performance record is 42 and desired threshold was 10
accessibility record is 78 and desired threshold was 30
best-practices record is 100 and desired threshold was 30
seo record is 92 and desired threshold was 30
pwa record is 30 and desired threshold was 30
  ✔ OK in 15914ms


  OK  | 1 passed   // 16s
```
