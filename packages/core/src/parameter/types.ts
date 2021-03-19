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

  multiple?: boolean;
  multipleValue?: boolean;
  takesValue?: boolean;
  required?: boolean;

  parse?: (value: string) => Value;
  valid?: (value: string) => boolean;

  conflicts?: string | string[];
  requires?: string | string[];
}

export type ParameterValue<P> = P extends Parameter<infer V> ? V : never;

type IfKnown<Type> = unknown extends Type ? unknown : Type;

export type ParameterFactory<Value> = {
  /**
   * sets `takesValue`
   */
  defaultValue: <T extends IfKnown<Value>>(value: T) => ParameterFactory<T>;
  /**
   * can not be used with `position`
   */
  long: (long: string) => ParameterFactory<Value>;
  longAliases: (longAliases: string[]) => ParameterFactory<Value>;
  /**
   * can not be used with `position`
   */
  short: (short: AlphaNum) => ParameterFactory<Value>;
  shortAliases: (shortAliases: AlphaNum[]) => ParameterFactory<Value>;
  /**
   * can not be used with `long` or `short`
   */
  position: (position: number) => ParameterFactory<Value>;
  info: (info: string) => ParameterFactory<Value>;
  usage: (usage: string[]) => ParameterFactory<Value>;
  multiple: () => ParameterFactory<Value>;
  /**
   * sets `takesValue`
   */
  multipleValue: () => ParameterFactory<Value>;
  takesValue: () => ParameterFactory<Value>;
  required: () => ParameterFactory<Value>;
  parse: <T extends IfKnown<Value>>(
    parse: (value: string) => T
  ) => ParameterFactory<T>;
  valid: (valid: (value: string) => boolean) => ParameterFactory<Value>;
  conflicts: (conflicts: string | string[]) => ParameterFactory<Value>;
  requires: (requires: string | string[]) => ParameterFactory<Value>;

  create: <T extends IfKnown<Value>>(definition?: Parameter<T>) => Parameter<T>;
};
