import CronixMode from "./CronixMode";
import { IMultiModeLexerDefinition, TokenType } from "chevrotain";

/**
 * Options passed to cronix parser.
 *
 */
export default interface CronixOptions {
  /**
   * The mode the parser operates in. The supported syntax depends on the selected mode.
   */
  mode: CronixMode;

  tokens: TokenType[] | IMultiModeLexerDefinition;
}
