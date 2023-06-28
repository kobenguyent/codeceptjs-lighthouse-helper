/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file');
type LighthouseHelper = import('../src/index');

declare namespace CodeceptJS {
  interface SupportObject { I: I, current: any }
  interface Methods extends Playwright, LighthouseHelper {}
  interface I extends ReturnType<steps_file>, WithTranslation<LighthouseHelper> {}
  namespace Translation {
    interface Actions {}
  }
}
