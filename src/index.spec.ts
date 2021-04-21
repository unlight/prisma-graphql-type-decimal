import { Prisma } from '@prisma/client';
import expect from 'expect';
import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';

import { GraphQLDecimal } from '.';

const Decimal = Prisma.Decimal;

it('smoke', async () => {
    const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'Query',
            fields: {
                decimal: {
                    type: GraphQLDecimal,
                    resolve: () => 1,
                },
            },
        }),
    });

    expect(
        await graphql(
            schema,
            /* GraphQL */ `
                query {
                    decimal
                }
            `,
        ),
    ).toBeTruthy();
});

it('echo', async () => {
    const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'Query',
            fields: {
                echo: {
                    type: GraphQLDecimal,
                    args: {
                        num: { type: GraphQLDecimal },
                    },
                    resolve: (_root, args) => args.num,
                },
            },
        }),
    });
    expect(
        await graphql(
            schema,
            /* GraphQL */ `
                query {
                    float: echo(num: 0.1)
                    int: echo(num: 2)
                    string: echo(num: "3")
                }
            `,
        ),
    ).toEqual({
        data: {
            float: '0.1',
            int: '2',
            string: '3',
        },
    });
});

it('inc', async () => {
    const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'Query',
            fields: {
                inc: {
                    type: GraphQLDecimal,
                    args: {
                        num: { type: GraphQLDecimal },
                    },
                    resolve: (_root, args) => new Decimal(0.1).add(args.num),
                },
            },
        }),
    });
    expect(
        await graphql(
            schema,
            /* GraphQL */ `
                query {
                    inc(num: 0.2)
                }
            `,
        ),
    ).toEqual({
        data: {
            inc: '0.3',
        },
    });
});

it('parse value', async () => {
    const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'Query',
            fields: {
                sum: {
                    type: GraphQLDecimal,
                    args: {
                        a: {
                            type: GraphQLDecimal,
                        },
                        b: {
                            type: GraphQLDecimal,
                        },
                    },
                    resolve: (_root, args) => {
                        return Decimal.add(args.a, args.b);
                    },
                },
            },
        }),
    });
    expect(
        await graphql(
            schema,
            /* GraphQL */ `
                query($a: Decimal, $b: Decimal) {
                    sum(a: $a, b: $b)
                }
            `,
            undefined,
            undefined,
            { a: new Decimal(0.1), b: '0.2' },
        ),
    ).toEqual({
        data: {
            sum: '0.3',
        },
    });
});

it('null', async () => {
    const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'Query',
            fields: {
                decimal: {
                    type: GraphQLDecimal,
                    resolve: () => null,
                },
            },
        }),
    });

    expect(
        await graphql(
            schema,
            /* GraphQL */ `
                query {
                    decimal
                }
            `,
        ),
    ).toEqual({
        data: {
            decimal: null,
        },
    });
});
