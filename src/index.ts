import { Prisma } from '@prisma/client';
import { GraphQLScalarType, GraphQLScalarTypeConfig, Kind } from 'graphql';

const config: GraphQLScalarTypeConfig<string | number | Prisma.Decimal, string> = {
    name: 'Decimal',
    description: 'An arbitrary-precision Decimal type',
    /**
     * Value sent to the client
     */
    serialize(value: Prisma.Decimal) {
        // console.log('serialize value', value.constructor.name);
        return value.toString();
    },
    /**
     * Value from the client
     */
    parseValue(value: Prisma.Decimal.Value) {
        // console.log('parseValue value', value.constructor.name);
        return new Prisma.Decimal(value);
    },
    parseLiteral(ast) {
        if (
            ast.kind === Kind.INT ||
            ast.kind === Kind.FLOAT ||
            ast.kind === Kind.STRING
        ) {
            return new Prisma.Decimal(ast.value);
        }
        // eslint-disable-next-line unicorn/no-null
        return null;
    },
};

export const GraphQLDecimal = new GraphQLScalarType(config);
