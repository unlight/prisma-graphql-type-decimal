import 'reflect-metadata';

import { Decimal } from '@prisma/client/runtime';
import { plainToClass, Transform, Type } from 'class-transformer';
import expect from 'expect';
import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';

import { createDecimalFromObject, GraphQLDecimal, transformToDecimal } from '.';

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

describe('decimal create from object', () => {
  it('instanceof', () => {
    const decimal = new Decimal(0.123);
    // eslint-disable-next-line total-functions/no-unsafe-type-assertion
    const o = createDecimalFromObject({
      d: decimal.d,
      e: decimal.e,
      s: decimal.s,
    });

    expect(o).toBeInstanceOf(Decimal);
    expect(o instanceof Decimal).toBeTruthy();
  });

  for (const { decimal, string } of [
    { decimal: new Decimal(0.123), string: '0.123' },
    { decimal: new Decimal(1.234_567_89), string: '1.23456789' },
    { decimal: new Decimal(4.6875e-2), string: '0.046875' },
    { decimal: new Decimal('1.79e+308'), string: '1.79e+308' },
    { decimal: new Decimal('9007199254741991'), string: '9007199254741991' },
  ]) {
    it(`${decimal.toString()}`, () => {
      // eslint-disable-next-line total-functions/no-unsafe-type-assertion
      const o = Object.create(Decimal.prototype, {
        d: { value: decimal.d },
        e: { value: decimal.e },
        s: { value: decimal.s },
      }) as Decimal;

      expect(o.toString()).toEqual(string);
    });
  }
});

describe('class transformer', () => {
  it('check type', () => {
    class Transfer {
      @Type(() => Object)
      @Transform(transformToDecimal)
      money!: Decimal;
    }
  });

  it('transformToDecimal main case', () => {
    class Transfer {
      @Type(() => Object)
      @Transform(transformToDecimal)
      money!: Decimal;
    }

    const transfer = plainToClass(Transfer, { money: new Decimal(1) });
    expect(transfer.money).toBeInstanceOf(Decimal);
    expect(transfer.money.isInteger()).toBe(true);
  });

  it('transformToDecimal duck type', () => {
    class Transfer {
      @Type(() => Object)
      @Transform(transformToDecimal)
      money!: any;
    }

    const transfer = plainToClass(Transfer, { money: { toString: () => '1' } });
    expect(transfer.money).toBeInstanceOf(Decimal);
  });

  it('transformToDecimal array', () => {
    class Transfer {
      @Type(() => Object)
      @Transform(transformToDecimal)
      moneys!: Array<Decimal>;
    }

    const transfer = plainToClass(Transfer, { moneys: [new Decimal(1)] });
    expect(transfer.moneys[0]).toBeInstanceOf(Decimal);
  });

  it('array in nested object', () => {
    class Transfers {
      @Type(() => Object)
      @Transform(transformToDecimal)
      moneys!: Array<Decimal>;
    }
    class Container {
      @Type(() => Transfers)
      set!: Transfers;
    }

    const container = plainToClass(Container, { set: { moneys: [new Decimal(1)] } });
    expect(container.set.moneys[0]).toBeInstanceOf(Decimal);
  });
});
