import { Decimal } from 'decimal.js';
import { GraphQLScalarType, GraphQLScalarTypeConfig, Kind } from 'graphql';

const config: GraphQLScalarTypeConfig<null | Decimal, null | string> = {
    name: 'Decimal',
    description: 'An arbitrary-precision Decimal type',
    /**
     * Value sent to the client
     */
    serialize(value: Decimal) {
        // console.log('serialize', value, value.constructor.name);
        return value.toString();
    },
    /**
     * Value from the client
     */
    parseValue(value: string) {
        console.log('parseValue', value, value.constructor.name);
        return value;
    },
    parseLiteral(ast) {
        if (
            ast.kind === Kind.INT ||
            ast.kind === Kind.FLOAT ||
            ast.kind === Kind.STRING
        ) {
            return new Decimal(ast.value);
        }
        // eslint-disable-next-line unicorn/no-null
        return null;
    },
};

export const GraphQLDecimal = new GraphQLScalarType(config);
