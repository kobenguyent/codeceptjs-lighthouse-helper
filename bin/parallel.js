#!/usr/bin/env node
const { Workers, event } = require('codeceptjs');

const workerConfig = {
  testConfig: './codecept.conf.ts',
  by: 'test'
};

// don't initialize workers in constructor
const workers = new Workers(null, workerConfig);
// split tests by suites in 3 groups
const testGroups = workers.createGroupsOfTests(3);

for (let i = 0; i < testGroups.length; i++) {
  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  process.env.PORT = random(3000, 4000);
  let config = {
    helpers: {
      Playwright: { chromium: { args: ["--no-sandbox", `--remote-debugging-port=${process.env.PORT}`] } }
    }
  };

  const worker = workers.spawn();
  worker.addTests(testGroups[i]);
  let conf = require('codeceptjs').config.get()
  conf.helpers.Playwright = config.helpers.Playwright
  worker.addConfig(conf);

}

// Listen events for failed test
workers.on(event.test.failed, (failedTest) => {
  console.log('Failed : ', failedTest.title);
});

// Listen events for passed test
workers.on(event.test.passed, (successTest) => {
  console.log('Passed : ', successTest.title);
});

// test run status will also be available in event
workers.on(event.all.result, () => {
  // Use printResults() to display result with standard style
  workers.printResults();
});

(async () =>{
  // run workers as async function
  await runWorkers();
})();

async function runWorkers() {
  try {
    // run bootstrapAll
    await workers.bootstrapAll();
    // run tests
    await workers.run();
    console.log(process.env.PORT)
  } finally {
    // run teardown All
    await workers.teardownAll();
  }
}
