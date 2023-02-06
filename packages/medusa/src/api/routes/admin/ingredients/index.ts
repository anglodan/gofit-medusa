import { Router } from "express"
import "reflect-metadata"
import middlewares, { transformQuery } from "../../../middlewares"
import { AdminGetIngredientsParams } from "./list-ingredients"
import { Ingredient } from "../../../../models"
import { FindParams, PaginatedResponse } from "../../../../types/common"

const route = Router()

export default (app) => {
  app.use("/ingredients", route)

  route.post("/", middlewares.wrap(require("./create-ingredient").default))

  route.post("/:id", middlewares.wrap(require("./update-ingredient").default))

  route.get(
    "/:id",
    transformQuery(FindParams, {
      defaultRelations: defaultAdminIngredientRelations,
      defaultFields: defaultAdminIngredientFields,
      allowedFields: allowedAdminIngredientFields,
      isList: false,
    }),
    middlewares.wrap(require("./get-ingredient").default)
  )

  route.get(
    "/",
    transformQuery(AdminGetIngredientsParams, {
      defaultRelations: defaultAdminIngredientRelations,
      defaultFields: defaultAdminIngredientFields,
      allowedFields: allowedAdminIngredientFields,
      isList: true,
    }),
    middlewares.wrap(require("./list-ingredients").default)
  )

  return app
}

export const defaultAdminIngredientRelations = []

export const defaultAdminIngredientFields: (keyof Ingredient)[] = [
  "id",
  "title",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const allowedAdminIngredientFields = [
  "id",
  "title",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const allowedAdminIngredientRelations = []

export type AdminIngredientsDeleteRes = {
  id: string
  object: "product"
  deleted: boolean
}

export type AdminIngredientsListRes = PaginatedResponse & {
  products: Ingredient[]
}

export type AdminIngredientsRes = {
  ingredient: Ingredient
}

export * from "./get-ingredient"
export * from "./create-ingredient"
export * from "./delete-ingredient"
export * from "./update-ingredient"
export * from "./list-ingredients"
