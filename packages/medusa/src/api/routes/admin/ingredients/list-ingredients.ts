import { IsNumber, IsOptional, IsString } from "class-validator"
import { Type } from "class-transformer"

import IngredientService from "../../../../services/ingredient"
import { Ingredient } from "../../../../models"
import { FilterableIngredientProps } from "../../../../types/ingredient"

export default async (req, res) => {
  const ingredientService: IngredientService =
    req.scope.resolve("ingredientService")

  const { skip, take } = req.listConfig

  const [rawIngredients, count] = await ingredientService.listAndCount(
    req.filterableFields,
    req.listConfig
  )

  const ingredients: Ingredient[] = rawIngredients

  res.json({
    ingredients,
    count,
    offset: skip,
    limit: take,
  })
}

export class AdminGetIngredientsParams extends FilterableIngredientProps {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50

  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string
}
