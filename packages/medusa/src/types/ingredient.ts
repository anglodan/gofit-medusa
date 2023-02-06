import { Type } from "class-transformer"
import { IsOptional, IsString, ValidateNested } from "class-validator"

import { Ingredient } from "../models"
import { IsType } from "../utils/validators/is-type"
import { DateComparisonOperator, FindConfig, Selector } from "./common"

/**
 * API Level DTOs + Validation rules
 */
export class FilterableIngredientProps {
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  @IsString()
  @IsOptional()
  q?: string

  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  @ValidateNested()
  @IsOptional()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator
}

export type IngredientSelector =
  | FilterableIngredientProps
  | (Selector<Ingredient> & {
      q?: string
      // extra
    })

/**
 * Service Level DTOs
 */

export type CreateIngredientInput = {
  title: string
  description?: string
  metadata?: Record<string, unknown>
}

export type UpdateIngredientInput = Partial<CreateIngredientInput>

export type FindIngredientConfig = FindConfig<Ingredient>
