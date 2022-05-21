import 'reflect-metadata';

import { Decimal } from '@prisma/client/runtime';
import { plainToClass, Type } from 'class-transformer';
import expect from 'expect';
import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';

import { decimalValueObjectFactory, GraphQLDecimal } from '.';

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
    await graphql({
      schema,
      source: /* GraphQL */ `
        query {
          decimal
        }
      `,
    }),
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
    await graphql({
      schema,
      source: /* GraphQL */ `
        query {
          float: echo(num: 0.1)
          int: echo(num: 2)
          string: echo(num: "3")
        }
      `,
    }),
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
    await graphql({
      schema,
      source: /* GraphQL */ `
        query {
          inc(num: 0.2)
        }
      `,
    }),
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
    await graphql({
      schema,
      source: /* GraphQL */ `
        query ($a: Decimal, $b: Decimal) {
          sum(a: $a, b: $b)
        }
      `,
      variableValues: {
        a: new Decimal(0.1),
        b: '0.2',
      },
    }),
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
    await graphql({
      schema,
      source: /* GraphQL */ `
        query {
          decimal
        }
      `,
    }),
  ).toEqual({
    data: {
      decimal: null,
    },
  });
});

it('unknown value to parse', async () => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        field: {
          type: GraphQLDecimal,
          args: {
            arg1: { type: GraphQLDecimal },
          },
          resolve: (_root, args) => {
            return args.arg1 === null ? 'failed to parse' : args.arg1;
          },
        },
      },
    }),
  });

  expect(
    await graphql({
      schema,
      source: /* GraphQL */ `
        query {
          field(arg1: false)
        }
      `,
    }),
  ).toEqual({
    data: {
      field: 'failed to parse',
    },
  });
});

describe('class transformer', () => {
  it('check type', () => {
    class Transfer {
      @Type(decimalValueObjectFactory)
      money!: Decimal;
    }
  });

  it('decimalValueObjectFactory main case', () => {
    class Transfer {
      @Type(decimalValueObjectFactory)
      money!: Decimal;
    }

    const transfer = plainToClass(Transfer, { money: new Decimal(1) });
    expect(transfer.money).toBeInstanceOf(Decimal);
  });

  it('decimalValueObjectFactory duck type', () => {
    class Transfer {
      @Type(decimalValueObjectFactory)
      money!: any;
    }

    const transfer = plainToClass(Transfer, { money: { toString: () => '1' } });
    expect(transfer.money).toBeInstanceOf(Decimal);
  });

  it('decimalValueObjectFactory array', () => {
    class Transfer {
      @Type(decimalValueObjectFactory)
      moneys!: Array<Decimal>;
    }

    const transfer = plainToClass(Transfer, { moneys: [new Decimal(1)] });
    expect(transfer.moneys[0]).toBeInstanceOf(Decimal);
  });
});
