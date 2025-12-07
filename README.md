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
import { Prisma } from '@prisma/client';
import { transformToDecimal } from 'prisma-graphql-type-decimal';
import { Type, Transform } from 'class-transformer';

@ObjectType()
export class User {
  /**
   * Trick to avoid error when using `@Field(() => GraphQLDecimal)`
   */
  @Field(() => GraphQLDecimal)
  @Type(() => Object)
  @Transform(transformToDecimal)
  money: Prisma.Decimal;

  @Type(() => Object)
  @Transform(transformToDecimal)
  moneys!: Array<Prisma.Decimal>;
}

// In nested object
class Transfers {
  @Type(() => Object)
  @Transform(transformToDecimal)
  moneys!: Array<Prisma.Decimal>;
}
class Container {
  @Type(() => Transfers)
  set!: Transfers;
}
```

## License

[MIT License](https://opensource.org/licenses/MIT) (c) 2023
