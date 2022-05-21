# prisma-graphql-type-decimal

GraphQL type for Prisma's Decimal scalar, wrapper around [decimal.js](https://github.com/MikeMcl/decimal.js/)  
Created because `@prisma/client` has bundled `decimal.js`

## Install

```sh
npm install prisma-graphql-type-decimal

```

## Usage

Example usage with NestJS GraphQL code first approach:

```ts
import { GraphQLDecimal, decimalValueObjectFactory } from 'prisma-graphql-type-decimal';
import { Decimal } from '@prisma/client/runtime';

@ObjectType()
export class User {
  @Field(() => GraphQLDecimal)
  @Type(decimalValueObjectFactory)
  money: Decimal;
}
```
