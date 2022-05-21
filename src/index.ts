import { Decimal } from '@prisma/client/runtime';
import { GraphQLScalarType, GraphQLScalarTypeConfig, Kind } from 'graphql';

const config: GraphQLScalarTypeConfig<null | string | number | Decimal, string> = {
  name: 'Decimal',
  description: 'An arbitrary-precision Decimal type',
  /**
   * Value sent to the client
   */
  serialize(value) {
    // console.log('serialize value', value.constructor.name);
    return String(value);
  },
  /**
   * Value from the client
   */
  parseValue(value) {
    return new Decimal(value as Decimal.Value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT || ast.kind === Kind.FLOAT || ast.kind === Kind.STRING) {
      return new Decimal(ast.value);
    }
    // eslint-disable-next-line unicorn/no-null
    return null;
  },
};

export const GraphQLDecimal = new GraphQLScalarType(config);

interface TypeHelpOptions {
  newObject: any;
  object: Record<string, any>;
  property: string;
}

/**
 * Trick to avoid error when using `@Field(() => GraphQLDecimal)`
 */
export function decimalValueObjectFactory(options: TypeHelpOptions | undefined) {
  const { object, property } = options as TypeHelpOptions;
  const decimalValueObject = object[property];

  const result = function () {
    if (decimalValueObject instanceof Decimal) {
      return decimalValueObject;
    }
    return new Decimal(String(decimalValueObject));
  };

  Object.defineProperty(result, 'name', {
    value: `decimalValueObjectFactory_${property}`,
  });

  return result;
}
