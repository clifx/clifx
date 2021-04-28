import { AlphaNum } from '../utils/alphanum';

export interface Parameter<Value = unknown> {
  /**
   * implies `takesValue`
   */
  defaultValue?: Value;
  long?: string;
  longAliases?: string[];
  short?: AlphaNum;
  shortAliases?: AlphaNum[];
  position?: number;

  info?: string;
  usage?: string[];

  global?: boolean;
  multiple?: boolean;
  multipleValue?: boolean;
  takesValue?: boolean;
  required?: boolean;

  parse?: (value: string) => Value;
  valid?: (value: string) => boolean;

  conflicts?: string | string[];
  requires?: string | string[];
}

type ParameterConfig = keyof Parameter;

export type ParameterValue<P> = P extends Parameter<infer V> ? V : never;

type IfKnown<Type> = unknown extends Type ? unknown : Type;

export type ParameterFactory<Value, Config extends ParameterConfig = never> = {
  /**
   * sets `takesValue`
   */
  defaultValue: <T extends IfKnown<Value>>(
    value: T
  ) => ParameterFactory<T, Config | 'defaultValue' | 'takesValue'>;
  /**
   * can not be used with `position`
   */
  long: (long: string) => ParameterFactory<Value, Config | 'long'>;
  longAliases: (
    longAliases: string[]
  ) => ParameterFactory<Value, Config | 'longAliases'>;
  /**
   * can not be used with `position`
   */
  short: (short: AlphaNum) => ParameterFactory<Value, Config | 'short'>;
  shortAliases: (
    shortAliases: AlphaNum[]
  ) => ParameterFactory<Value, Config | 'shortAliases'>;
  /**
   * can not be used with `long` or `short`
   */
  position: (position: number) => ParameterFactory<Value, Config | 'position'>;
  info: (info: string) => ParameterFactory<Value, Config | 'info'>;
  usage: (usage: string[]) => ParameterFactory<Value, Config | 'usage'>;

  global: () => ParameterFactory<Value, Config | 'global'>;
  multiple: () => ParameterFactory<Value, Config | 'multiple'>;
  /**
   * sets `takesValue`
   */
  multipleValue: () => ParameterFactory<
    Value,
    Config | 'multipleValue' | 'takesValue'
  >;
  takesValue: () => ParameterFactory<Value, Config | 'takesValue'>;
  required: () => ParameterFactory<Value, Config | 'required'>;

  parse: <T extends IfKnown<Value>>(
    parse: (value: string) => T
  ) => ParameterFactory<T, Config | 'parse'>;
  valid: (
    valid: (value: string) => boolean
  ) => ParameterFactory<Value, Config | 'valid'>;
  conflicts: (
    conflicts: string | string[]
  ) => ParameterFactory<Value, Config | 'conflicts'>;
  requires: (
    requires: string | string[]
  ) => ParameterFactory<Value, Config | 'requires'>;

  create: <T extends IfKnown<Value>>(definition?: Parameter<T>) => Parameter<T>;
};
