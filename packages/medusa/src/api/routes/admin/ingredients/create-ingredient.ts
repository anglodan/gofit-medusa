import {
  IsObject,
  IsOptional,
  IsString,
} from "class-validator"
import { IngredientService } from "../../../../services"
import {
  defaultAdminIngredientFields,
  defaultAdminIngredientRelations,
} from "."

import { EntityManager } from "typeorm"
import { validator } from "../../../../utils/validator"

export default async (req, res) => {
  const validated = await validator(AdminPostIngredientsReq, req.body)

  const ingredientService: IngredientService =
    req.scope.resolve("ingredientService")

  const entityManager: EntityManager = req.scope.resolve("manager")

  const newIngredient = await entityManager.transaction(async (manager) => {
    const newIngredient = await ingredientService
      .withTransaction(manager)
      .create({ ...validated })

    return newIngredient
  })

  const ingredient = await ingredientService.retrieve(newIngredient.id, {
    select: defaultAdminIngredientFields,
    relations: defaultAdminIngredientRelations,
  })

  res.json({ ingredient })
}

export class AdminPostIngredientsReq {
  @IsString()
  title: string

  @IsString()
  @IsOptional()
  description?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
