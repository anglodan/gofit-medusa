import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import { Ingredient } from "../models"
import {
  FindWithoutRelationsOptions,
  IngredientRepository,
} from "../repositories/ingredient"
import { Selector } from "../types/common"
import {
  CreateIngredientInput,
  UpdateIngredientInput,
} from "../types/ingredient"
import {
  FilterableIngredientProps,
  FindIngredientConfig,
  IngredientSelector,
} from "../types/ingredient"
import { buildQuery } from "../utils"

type InjectedDependencies = {
  manager: EntityManager
  ingredientRepository: typeof IngredientRepository
}

class IngredientService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly ingredientRepository_: typeof IngredientRepository

  constructor({ manager, ingredientRepository }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.ingredientRepository_ = ingredientRepository
  }

  /**
   * Lists ingredients based on the provided parameters.
   * @param selector - an object that defines rules to filter ingredients
   *   by
   * @param config - object that defines the scope for what should be
   *   returned
   * @return the result of the find operation
   */
  async list(
    selector: IngredientSelector,
    config: FindIngredientConfig = {
      relations: [],
      skip: 0,
      take: 20,
    }
  ): Promise<Ingredient[]> {
    const manager = this.manager_
    const ingredientRepo: IngredientRepository = manager.getCustomRepository(
      this.ingredientRepository_
    )
    return await ingredientRepo.find()
  }

  /**
   * Lists ingredients based on the provided parameters and includes the count of
   * ingredients that match the query.
   * @param selector - an object that defines rules to filter ingredients
   *   by
   * @param config - object that defines the scope for what should be
   *   returned
   * @return an array containing the ingredients as
   *   the first element and the total count of ingredients that matches the query
   *   as the second element.
   */
  async listAndCount(
    selector: IngredientSelector,
    config: FindIngredientConfig = {
      relations: [],
      skip: 0,
      take: 20,
    }
  ): Promise<[Ingredient[], number]> {
    const manager = this.manager_
    const ingredientRepo = manager.getCustomRepository(
      this.ingredientRepository_
    )

    const { q, query, relations } = this.prepareListQuery_(selector, config)

    if (q) {
      throw new Error("query not implemented")

      /* return await ingredientRepo.getFreeTextSearchResultsAndCount(
        q,
        query,
        relations
      ) */
    }

    return await ingredientRepo.findWithRelationsAndCount(relations, query)
  }

  /**
   * Creates a query object to be used for list queries.
   * @param selector - the selector to create the query from
   * @param config - the config to use for the query
   * @return an object containing the query, relations and free-text
   *   search param.
   */
  protected prepareListQuery_(
    selector: FilterableIngredientProps | Selector<Ingredient>,
    config: FindIngredientConfig
  ): {
    q: string
    relations: (keyof Ingredient)[]
    query: FindWithoutRelationsOptions
  } {
    let q
    if ("q" in selector) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config)

    if (config.relations && config.relations.length > 0) {
      query.relations = config.relations
    }

    if (config.select && config.select.length > 0) {
      query.select = config.select
    }

    const rels = query.relations
    delete query.relations

    return {
      query: query as FindWithoutRelationsOptions,
      relations: rels as (keyof Ingredient)[],
      q,
    }
  }

  /**
   * Gets a ingredient by id.
   * Throws in case of DB Error and if ingredient was not found.
   * @param ingredientId - id of the ingredient to get.
   * @param config - object that defines what should be included in the
   *   query response
   * @return the result of the find one operation.
   */
  async retrieve(
    ingredientId: string,
    config: FindIngredientConfig = {}
  ): Promise<Ingredient> {
    return await this.retrieve_({ id: ingredientId }, config)
  }

  /**
   * Gets a ingredient by selector.
   * Throws in case of DB Error and if ingredient was not found.
   * @param selector - selector object
   * @param config - object that defines what should be included in the
   *   query response
   * @return the result of the find one operation.
   */
  async retrieve_(
    selector: Selector<Ingredient>,
    config: FindIngredientConfig = {}
  ): Promise<Ingredient> {
    const manager = this.manager_
    const ingredientRepo = manager.getCustomRepository(
      this.ingredientRepository_
    )

    const { relations, ...query } = buildQuery(selector, config)

    const ingredient = await ingredientRepo.findOneWithRelations(
      relations,
      query as FindWithoutRelationsOptions
    )

    if (!ingredient) {
      const selectorConstraints = Object.entries(selector)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ")

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Ingredient with ${selectorConstraints} was not found`
      )
    }

    return ingredient
  }

  /**
   * Creates a ingredient.
   * @param ingredientObject - the ingredient to create
   * @return resolves to the creation result.
   */
  async create(ingredientObject: CreateIngredientInput): Promise<Ingredient> {
    return await this.atomicPhase_(async (manager) => {
      const ingredientRepo = manager.getCustomRepository(
        this.ingredientRepository_
      )

      const { ...rest } = ingredientObject

      const ingredient = ingredientRepo.create(rest)

      const result = await this.retrieve(ingredient.id, {
        relations: [],
      })

      return result
    })
  }

  /**
   * Updates a ingredient. Ingredient variant updates should use dedicated methods,
   * e.g. `addVariant`, etc. The function will throw errors if metadata or
   * ingredient variant updates are attempted.
   * @param {string} ingredientId - the id of the ingredient. Must be a string that
   *   can be casted to an ObjectId
   * @param {object} update - an object with the update values.
   * @return {Promise} resolves to the update result.
   */
  async update(
    ingredientId: string,
    update: UpdateIngredientInput
  ): Promise<Ingredient> {
    return await this.atomicPhase_(async (manager) => {
      const ingredientRepo = manager.getCustomRepository(
        this.ingredientRepository_
      )
      const relations = []

      const ingredient = await this.retrieve(ingredientId, {
        relations,
      })

      const { ...rest } = update

      for (const [key, value] of Object.entries(rest)) {
        if (typeof value !== `undefined`) {
          ingredient[key] = value
        }
      }

      const result = await ingredientRepo.save(ingredient)

      return result
    })
  }

  /**
   * Deletes a ingredient from a given ingredient id. The ingredient's associated
   * variants will also be deleted.
   * @param ingredientId - the id of the ingredient to delete. Must be
   *   castable as an ObjectId
   * @return empty promise
   */
  async delete(ingredientId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const ingredientRepo = manager.getCustomRepository(
        this.ingredientRepository_
      )

      // Should not fail, if ingredient does not exist, since delete is idempotent
      const ingredient = await ingredientRepo.findOne({ id: ingredientId })

      if (!ingredient) {
        return
      }

      await ingredientRepo.softRemove(ingredient)

      return Promise.resolve()
    })
  }
}

export default IngredientService
