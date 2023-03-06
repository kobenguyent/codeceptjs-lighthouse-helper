const { playAudit } = require('playwright-lighthouse');

const defaultThresholds = {
  performance: 10,
  accessibility: 30,
  'best-practices': 30,
  seo: 30,
  pwa: 30,
}

const reports = {
  formats: {
    html: true
  },
  name: 'audit-test.html',
  directory: 'output',
}

const defaultAuditOpts = {
  reportFileName: reports.name,
  outputDir: reports.directory,
  htmlReport: reports.formats.html,
  port: 9222,
  thresholds: defaultThresholds
}


class LighthouseHelper extends Helper {
  async runPerformanceCheck(opts) {
    const playwright = this['helpers']['Playwright'];
    if (!playwright)
      throw Error(
        'Lighthouse Helper only supports Playwright at the moment.'
      );
    const { page } = playwright;

    const _opts = { ...defaultAuditOpts, ...opts };
    const _reports = {...reports}
    _reports.formats.html = _opts.htmlReport || true;
    _reports.name = _opts.reportFileName || `audit-test-${Date.now()}.html`;
    _reports.directory = _opts.outputDir || 'output';

    await playAudit({
      page,
      thresholds: _opts.thresholds,
      port: _opts.port,
      reports: _reports
    });
  }
}

module.exports = LighthouseHelper;
