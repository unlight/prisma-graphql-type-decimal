import { Prisma } from '@prisma/client';
import { GraphQLScalarType, GraphQLScalarTypeConfig, Kind } from 'graphql';

const config: GraphQLScalarTypeConfig<null | string | number | Prisma.Decimal, string> =
    {
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
            return new Prisma.Decimal(value as Prisma.Decimal.Value);
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
