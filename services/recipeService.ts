import { Connection } from 'mysql';
import e from 'express';

export module RecipeService {

  export function buildRecipe(newRecipeObject: any): Recipe {
    let recipe: Recipe = {
      id: newRecipeObject.id,
      title: newRecipeObject.title,
      prepTime: newRecipeObject.prep_time,
      cookTime: newRecipeObject.cook_time,
      servings: newRecipeObject.servings,
      description: newRecipeObject.description,
      dateModified: newRecipeObject.dateModified
    }
    return recipe;
  }

  export function upsertRecipe(recipe: Recipe, conn: Connection) {
    let query: string = '';
    if (recipe.id === null) {
      // insert new recipe
      query = `
        INSERT INTO cookbook.recipes
        (title, prep_time, cook_time, servings, description)
        VALUE (${recipe.title},${recipe.prepTime},${recipe.cookTime},${recipe.servings},${recipe.description})`
    } else {
      // update recipe
    }
    conn.query(query, function (err, result) {
      if (err) {
        console.log(err);
        return 'There was an error inserting or updating recipe';
      } else {
        console.log(result);
        return 'success';
      }
    });
  }
}

interface Recipe {
  id: number;
  title: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  description: string;
  dateModified: Date;
}