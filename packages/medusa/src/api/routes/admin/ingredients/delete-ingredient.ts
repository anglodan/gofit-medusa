import { EntityManager } from "typeorm"
import { IngredientService } from "../../../../services"

export default async (req, res) => {
  const { id } = req.params

  const ingredientService: IngredientService =
    req.scope.resolve("ingredientService")
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await ingredientService
      .withTransaction(transactionManager)
      .delete(id)
  })

  res.json({
    id,
    object: "product",
    deleted: true,
  })
}
