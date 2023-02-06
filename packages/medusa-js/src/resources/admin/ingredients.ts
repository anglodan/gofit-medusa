import {
  AdminGetIngredientsParams,
  AdminPostIngredientsIngredientReq,
  AdminPostIngredientsReq,
  AdminIngredientsDeleteRes,
  AdminIngredientsListRes,
  AdminIngredientsRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminIngredientsResource extends BaseResource {
  create(
    payload: AdminPostIngredientsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminIngredientsRes> {
    const path = `/admin/ingredients/`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminIngredientsRes> {
    const path = `/admin/ingredients/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  update(
    id: string,
    payload: AdminPostIngredientsIngredientReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminIngredientsRes> {
    const path = `/admin/ingredients/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminIngredientsDeleteRes> {
    const path = `/admin/ingredients/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  list(
    query?: AdminGetIngredientsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminIngredientsListRes> {
    let path = `/admin/ingredients`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/ingredients?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminIngredientsResource
