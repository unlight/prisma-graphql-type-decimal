import { Decimal } from '@prisma/client-runtime-utils';
import { GraphQLScalarType, GraphQLScalarTypeConfig, Kind } from 'graphql';

const config: GraphQLScalarTypeConfig<
  null | string | number | Decimal,
  string
> = {
  description: 'An arbitrary-precision Decimal type',
  name: 'Decimal',
  parseLiteral(ast) {
    if (
      ast.kind === Kind.INT ||
      ast.kind === Kind.FLOAT ||
      ast.kind === Kind.STRING
    ) {
      return new Decimal(ast.value);
    }

    return null;
  },
  /**
   * Value from the client
   */
  parseValue(value) {
    return new Decimal(value as Decimal.Value);
  },
  /**
   * Value sent to the client
   */
  serialize(value) {
    // console.log('serialize value', value.constructor.name);
    return String(value);
  },
};

export const GraphQLDecimal = new GraphQLScalarType(config);

export function createDecimalFromObject(object: any) {
  // eslint-disable-next-line total-functions/no-unsafe-type-assertion
  return Object.create(Decimal.prototype, {
    d: { value: object.d },
    e: { value: object.e },
    s: { value: object.s },
  }) as Decimal;
}

interface TransformFunctionParameters {
  value: any;
}

export function transformToDecimal({ value }: TransformFunctionParameters) {
  if (value == null) return value;
  return Array.isArray(value)
    ? value.map(createDecimalFromObject)
    : createDecimalFromObject(value);
}
