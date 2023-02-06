import {
  AdminIngredientsListRes,
  AdminIngredientsRes,
  AdminGetIngredientsParams,
} from "@medusajs/medusa"

import { Response } from "@medusajs/medusa-js"
import { useQuery } from "react-query"
import { UseQueryOptionsWrapper } from "medusa-react/src/types"
import { queryKeysFactory } from "medusa-react/src/hooks/utils"
import { useMedusa } from "../../../contexts"

const ADMIN_PRODUCTS_QUERY_KEY = `admin_ingredients` as const

export const adminIngredientKeys = queryKeysFactory(ADMIN_PRODUCTS_QUERY_KEY)

type IngredientQueryKeys = typeof adminIngredientKeys

export const useAdminIngredients = (
  query?: AdminGetIngredientsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminIngredientsListRes>,
    Error,
    ReturnType<IngredientQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminIngredientKeys.list(query),
    () => client.admin.ingredients.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminIngredient = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminIngredientsRes>,
    Error,
    ReturnType<IngredientQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminIngredientKeys.detail(id),
    () => client.admin.ingredients.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}
