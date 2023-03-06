export = LighthouseHelper;

declare class LighthouseHelper {
  /**
   * Run performance check using lighthouse playwirght
   * @param  {Object} opts The options data
   * @param  {object}  opts.thresholds    thresholds for lighthouse audit
   * @param  {String}  opts.outputDir=output   output folder
   * @param  {String}  opts.reportFileName   report name
   * @param  {Number}  opts.port=9222   port to run lighthouse
   */
  runPerformanceCheck(opts?): any;
}
