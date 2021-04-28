import { isDefined } from '../utils';
import { Parameter, ParameterFactory } from './types';

export function Parameter<Value>(
  definition?: Parameter<Value>
): ParameterFactory<Value> {
  const def: Parameter<Value> = {
    ...definition,
  };

  const factory: ParameterFactory<Value, any> = {
    defaultValue(defaultValue) {
      def.takesValue = true;
      def.defaultValue = defaultValue;
      return this;
    },
    long(long) {
      if (isDefined(def.position)) {
        throw new Error();
      }

      def.long = long;
      return this;
    },
    longAliases(longAliases) {
      if (isDefined(def.position)) {
        throw new Error();
      }

      def.longAliases = longAliases;
      return this;
    },
    short(short) {
      if (isDefined(def.position)) {
        throw new Error();
      }

      def.short = short;
      return this;
    },
    shortAliases(shortAliases) {
      if (isDefined(def.position)) {
        throw new Error();
      }

      def.shortAliases = shortAliases;
      return this;
    },
    position(position) {
      if (isDefined(def.long) || isDefined(def.short)) {
        throw new Error();
      }

      if (isDefined(def.multiple)) {
        throw new Error();
      }

      if (position < 1) {
        throw new Error();
      }

      def.position = position;
      return this;
    },
    info(info) {
      def.info = info;
      return this;
    },
    usage(usage) {
      def.usage = usage;
      return this;
    },
    global() {
      if (def.position) {
        throw new Error();
      }

      def.global = true;
      return this;
    },
    multiple() {
      if (def.position) {
        throw new Error();
      }

      def.multiple = true;
      return this;
    },
    multipleValue() {
      def.takesValue = true;
      def.multipleValue = true;
      return this;
    },
    takesValue() {
      def.takesValue = true;
      return this;
    },
    required() {
      def.required = true;
      return this;
    },
    parse(parse) {
      def.parse = parse;
      return (this as unknown) as ParameterFactory<ReturnType<typeof parse>>;
    },
    valid(valid) {
      def.valid = valid;
      return this;
    },
    conflicts(conflicts) {
      def.conflicts = conflicts;
      return this;
    },
    requires(requires) {
      def.requires = requires;
      return this;
    },
    create(definition) {
      const parameter = Object.freeze(Object.assign(def, definition));
      return parameter;
    },
  };

  return factory;
}
