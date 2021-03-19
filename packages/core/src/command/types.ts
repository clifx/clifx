/* eslint-disable @typescript-eslint/ban-types */

import { Parameter } from '../parameter/types';
import { Result as ParserResult } from '../parser/result';
import { AlphaNum } from '../utils/alphanum';

export interface Command<
  ParameterMap extends { [id: string]: Parameter } = { [id: string]: Parameter }
> {
  id: string;

  long?: string;
  short?: string;

  info?: string;
  usage?: string[];

  parameters: ParameterMap;
  subcommands: string[];

  run: (result: ParserResult<ParameterMap>) => void | Promise<void>;
}

export type CommandFactory<
  ParameterMap extends { [id: string]: Parameter } = {
    [id in never]: never;
  }
> = {
  /**
   * ignored for root command
   */
  long: (long: string) => CommandFactory<ParameterMap>;
  /**
   * ignored for root command
   */
  short: (short: AlphaNum) => CommandFactory<ParameterMap>;
  info: (info: string) => CommandFactory<ParameterMap>;
  usage: (usage: string[]) => CommandFactory<ParameterMap>;
  parameter: <ID extends string, P extends Parameter>(
    id: ID,
    parameter: P
  ) => CommandFactory<ParameterMap & { [id in ID]: P }>;
  subcommands: (
    names: string[] | (() => string[])
  ) => CommandFactory<ParameterMap>;
  run: (
    run: (
      result: ParserResult<{ [ID in keyof ParameterMap]: ParameterMap[ID] }>
    ) => void | Promise<void>
  ) => CommandFactory<ParameterMap>;

  create: () => Command<{ [ID in keyof ParameterMap]: ParameterMap[ID] }>;
};
