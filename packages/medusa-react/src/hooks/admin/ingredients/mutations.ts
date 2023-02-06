import { adminIngredientKeys } from "./queries"
import {
  AdminPostIngredientsIngredientReq,
  AdminPostIngredientsReq,
  AdminIngredientsDeleteRes,
  AdminIngredientsRes,
} from "@medusajs/medusa"

import { Response } from "@medusajs/medusa-js"
import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { buildOptions } from "medusa-react/src/hooks/utils/buildOptions"
import { useMedusa } from "../../../contexts"

export const useAdminCreateIngredient = (
  options?: UseMutationOptions<
    Response<AdminIngredientsRes>,
    Error,
    AdminPostIngredientsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostIngredientsReq) =>
      client.admin.ingredients.create(payload),
    buildOptions(queryClient, adminIngredientKeys.lists(), options)
  )
}

export const useAdminUpdateIngredient = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminIngredientsRes>,
    Error,
    AdminPostIngredientsIngredientReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostIngredientsIngredientReq) =>
      client.admin.ingredients.update(id, payload),
    buildOptions(
      queryClient,
      [adminIngredientKeys.lists(), adminIngredientKeys.detail(id)],
      options
    )
  )
}

export const useAdminDeleteIngredient = (
  id: string,
  options?: UseMutationOptions<Response<AdminIngredientsDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.ingredients.delete(id),
    buildOptions(
      queryClient,
      [adminIngredientKeys.lists(), adminIngredientKeys.detail(id)],
      options
    )
  )
}
