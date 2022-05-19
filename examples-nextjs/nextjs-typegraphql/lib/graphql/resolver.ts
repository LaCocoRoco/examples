import { Resolver, Query, Arg, Args, Mutation, Authorized, Ctx } from "type-graphql";
import { RecipesArgs } from "./args";
import { Recipe, User } from "./object";
import { RecipeInputs } from "./input";
import { recipeSamples } from "./sample";
import { generateAuthorizationToken } from "../jwt";

@Resolver(Recipe)
export class RecipeResolver {
  private recipesCollection = recipeSamples;

  @Query(() => Recipe)
  getRecipeById(
    @Arg("index", () => Number) id: number,
  ): Recipe {
    return this.recipesCollection[id];
  }

  @Query(() => [Recipe])
  getRecipeByRange(
    @Args(() => RecipesArgs) recipesArgs: RecipesArgs
  ): Recipe[] {
    return this.recipesCollection.slice(recipesArgs.first, recipesArgs.last);
  }

  @Query(() => [Recipe])
  getRecipeCollection(): Recipe[] {
    return this.recipesCollection;
  }

  @Query(() => String)
  getAuthorizationToken(
    @Arg("name", () => String) name: string
  ): string {
    return generateAuthorizationToken(name);
  }

  @Authorized()
  @Query(() => User)
  getUser(
    @Ctx("user") user: User
  ): User {
    return user;
  }

  @Authorized()
  @Mutation(() => Boolean)
  addRecipe(
    @Arg("recipeInputs", () => RecipeInputs) recipeInputs: RecipeInputs
  ): boolean {
    this.recipesCollection.push({
      description: recipeInputs.description,
      title: recipeInputs.title,
      creationDate: new Date(),
      ingredients: recipeInputs.ingredients
    })

    return true;
  }

  @Authorized()
  @Mutation(() => Boolean)
  removeRecipe(
    @Arg("index", () => Number) index: number
  ): boolean {
    this.recipesCollection.splice(index, 1);
    return true;
  }
}