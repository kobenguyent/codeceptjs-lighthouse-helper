import { Helper } from "codeceptjs";
const { playAudit } = require('playwright-lighthouse');
import { resolve } from "path";
import { readFileSync } from "fs";

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
  name: '',
  directory: 'output',
}

const defaultAuditOpts = {
  outputDir: reports.directory,
  htmlReport: reports.formats.html,
  port: 9222,
  thresholds: defaultThresholds
}

interface ILighthouseHelperOpts {
  thresholds?: {
    performance: number,
    accessibility: number,
    'best-practices': number,
    seo: number,
    pwa: number,
  }
  outputDir?: string
  reportFileName?: string
  port?: number
}

interface Allure {
  // eslint-disable-next-line no-unused-vars
  addAttachment(name: string, buffer: Buffer | string, type: string): void;
}

let outputDir: string;
let fileName: string;
let allure: Allure;

interface ILighthouseConfig {
  outputDir: string,
  reportFileName: string
}

class LighthouseHelper extends Helper {
  constructor(config: ILighthouseConfig) {
    super(config);
    outputDir = config.outputDir || codeceptjs.config.get().output;
    fileName = config.reportFileName || `audit-test-${Date.now()}.html`;
  }

  /**
   * Run performance check using lighthouse playwright
   * @param  {ILighthouseHelperOpts} opts The options data
   * @param  {object}  ILighthouseHelperOpts.thresholds    thresholds for lighthouse audit
   * @param  {String}  ILighthouseHelperOpts.outputDir=output   output folder
   * @param  {String}  ILighthouseHelperOpts.reportFileName   report name
   * @param  {Number}  ILighthouseHelperOpts.port=9222   port to run lighthouse
   */
  async runPerformanceCheck(opts?: ILighthouseHelperOpts | undefined) {
    const playwright = this['helpers']['Playwright'];
    if (!playwright)
      throw Error(
        'Lighthouse Helper only supports Playwright at the moment.'
      );
    const { page } = playwright;

    const _opts = { ...defaultAuditOpts, ...opts };
    const _reports = {...reports}

    if (_opts.reportFileName) fileName = reportNameValidation(_opts.reportFileName);

    _reports.formats.html = true;
    _reports.name = fileName;
    _reports.directory = _opts.outputDir || 'output';

    await playAudit({
      page,
      thresholds: _opts.thresholds,
      port: _opts.port,
      reports: _reports
    });

  }

  protected async _before(): Promise<void> {
    allure = codeceptjs.container.plugins("allure");
  }

  async _failed(test: Mocha.Test) {
    await this.helpers.Playwright.browserContext.close();
    (test.artifacts as any).lighthouseReport = resolve(outputDir, fileName);
    if (allure) {
      await this._attachArtifacts(test);
    }
  }

  async _passed(test: Mocha.Test) {
    await this.helpers.Playwright.browserContext.close();
    (test.artifacts as any).lighthouseReport = resolve(outputDir, fileName);
    if (allure) {
      await this._attachArtifacts(test);
    }
  }

  private async _attachArtifacts(test: Mocha.Test): Promise<void> {
    const timeString: string = Date.now().toString();

    for (const [key, value] of Object.entries(test.artifacts)) {
      if (key !== "screenshot") {
        if (value) {
          if (key.toLowerCase().includes("lighthousereport"))
            allure.addAttachment(`${test.title} (${timeString}) - ${key}`, readFileSync(value), "text/html");
        }
      }
    }
  }
}

export = LighthouseHelper;

function reportNameValidation (fileName: string) {
  if (!fileName.toLowerCase().includes('.html')) return `${fileName}.html`;
  return fileName;
}