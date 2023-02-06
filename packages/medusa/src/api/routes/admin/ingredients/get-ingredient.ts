import { PricingService, IngredientService } from "../../../../services"

export default async (req, res) => {
  const { id } = req.params

  const ingredientService: IngredientService = req.scope.resolve("ingredientService")

  const ingredient = await ingredientService.retrieve(id, req.retrieveConfig)

  res.json({ ingredient })
}
