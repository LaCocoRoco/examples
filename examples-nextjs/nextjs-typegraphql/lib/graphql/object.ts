import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Recipe {
  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Date)
  creationDate!: Date;

  @Field(() => [String])
  ingredients!: string[];
}

@ObjectType()
export class User {
  @Field(() => String)
  name!: string
}