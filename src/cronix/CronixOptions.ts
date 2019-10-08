import CronixMode from "./CronixMode";

/**
 * Options passed to cronix parser.
 *
 */
export default interface CronixOptions {
  /**
   * The mode the parser operates in. The supported syntax depends on the selected mode.
   */
  mode: CronixMode;
}
