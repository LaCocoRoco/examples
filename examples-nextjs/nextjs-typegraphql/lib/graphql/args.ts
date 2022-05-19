import { Min, Max } from "class-validator";
import { ArgsType, Field, Int } from "type-graphql";

@ArgsType()
export class RecipesArgs {
  @Field(() => Int)
  @Min(0)
  first: number = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  last: number = 25;
}