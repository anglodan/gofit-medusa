import { IsObject, IsOptional, IsString } from "class-validator"
import { PricingService, IngredientService } from "../../../../services"
import {
  defaultAdminIngredientFields,
  defaultAdminIngredientRelations,
} from "."

import { EntityManager } from "typeorm"
import { validator } from "../../../../utils/validator"

export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(AdminPostIngredientsIngredientReq, req.body)

  const ingredientService: IngredientService =
    req.scope.resolve("ingredientService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    await ingredientService
      .withTransaction(transactionManager)
      .update(id, validated)
  })

  const ingredient = await ingredientService.retrieve(id, {
    select: defaultAdminIngredientFields,
    relations: defaultAdminIngredientRelations,
  })

  res.json({ ingredient })
}

export class AdminPostIngredientsIngredientReq {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
