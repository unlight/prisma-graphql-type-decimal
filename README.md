# prisma-graphql-type-decimal

GraphQL scalar type for Prisma's Decimal type, wrapper around [decimal.js](https://github.com/MikeMcl/decimal.js/)  
Created because `@prisma/client` has bundled `decimal.js`

## Install

```sh
npm install prisma-graphql-type-decimal

```

## Usage

Example usage with NestJS GraphQL code first approach:

```
import { GraphQLDecimal } from 'prisma-graphql-type-decimal';
import { Prisma } from '@prisma/client';

@ObjectType()
export class User {
    @Field(() => GraphQLDecimal)
    money: Prisma.Decimal;
}

```

## Todo
