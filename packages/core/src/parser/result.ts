import { Parameter, ParameterValue } from '../parameter/types';

export type Result<ParameterMap extends { [id: string]: Parameter }> = {
  count: <ID extends keyof ParameterMap>(id: ID) => number;
  get: <ID extends keyof ParameterMap>(
    id: ID
  ) => { count: number; value?: ParameterValue<ParameterMap[ID]> };
  value: <ID extends keyof ParameterMap>(
    id: ID
  ) => ParameterValue<ParameterMap[ID]>;

  subcommand: null | string;
  unparsedArgv: string[];

  dump: () => any;
};

interface ResultFactory<ParameterMap extends { [id: string]: Parameter }> {
  getCount(id: keyof ParameterMap): number;
  incrementCount(id: keyof ParameterMap): void;
  getValue(id: keyof ParameterMap): unknown;
  setValue(id: keyof ParameterMap, value: unknown): void;
  setSubcommand(id: string): void;
  setUnparsedArgv(argv: string[]): void;
  create(): Result<ParameterMap>;
}

export function ResultFactory<
  ParameterMap extends { [id: string]: Parameter }
>(): ResultFactory<ParameterMap> {
  let subcommand: string | null = null;
  const unparsedArgv: string[] = [];

  const countMap = new Map<keyof ParameterMap, number>();
  const valueMap = new Map<keyof ParameterMap, unknown>();

  const getCount = (id: keyof ParameterMap) => {
    const count = countMap.get(id) ?? 0;
    return count;
  };

  const incrementCount = (id: keyof ParameterMap) => {
    const count = getCount(id);
    countMap.set(id, count + 1);
  };

  const getValue = <ID extends keyof ParameterMap>(id: ID) => {
    return valueMap.get(id) as ParameterValue<ParameterMap[ID]>;
  };

  const setValue = <ID extends keyof ParameterMap>(
    id: ID,
    value: ParameterValue<ParameterMap[ID]>
  ) => {
    valueMap.set(id, value);
  };

  const setSubcommand = (id: string) => {
    subcommand = id;
  };

  const setUnparsedArgv = (argv: string[]) => {
    unparsedArgv.push(...argv);
  };

  return {
    getCount,
    incrementCount,
    getValue,
    setValue,
    setSubcommand,
    setUnparsedArgv,
    create(): Result<ParameterMap> {
      const get = <ID extends keyof ParameterMap>(id: ID) => ({
        count: getCount(id),
        value: getValue(id),
      });

      const dump = () => {
        return Array.from(valueMap.entries());
      };

      return {
        count: getCount,
        get,
        value: getValue,
        subcommand,
        unparsedArgv,
        dump,
      };
    },
  };
}
