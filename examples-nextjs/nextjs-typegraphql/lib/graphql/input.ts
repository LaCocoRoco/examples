import { MaxLength, Length, ArrayMaxSize } from "class-validator";
import { InputType, Field } from "type-graphql";

@InputType()
export class RecipeInputs {
  @Field(() => String)
  @MaxLength(30)
  title!: string;

  @Field(() => String, { nullable: true })
  @Length(0, 255)
  description?: string;

  @Field(() => [String])
  @ArrayMaxSize(30)
  ingredients!: string[];
}