import { ErrorModel } from '../errors/errorModel'
import type { Data_state_params } from './data_state_params/data_state_params'
import { ValidationModel } from '~/base/core/networkStructure/Resources/validations/validation_model'
import PaginationModel from '~/base/core/Models/pagination_model'
import type DataSuccessParams from '~/base/core/networkStructure/Resources/dataState/data_state_params/date_success_params'
import type DataFailedParams from '~/base/core/networkStructure/Resources/dataState/data_state_params/data_failed_params'

abstract class DataState<T> {
  public data: T | null = null
  public searchData: T | null = null
  public error: ErrorModel | null = null
  public message: string | null = null
  public pagination: PaginationModel | null = null
  public validation: ValidationModel | null = null

  protected constructor({
    data = null,
    searchData = null,
    error = null,
    message = null,
    pagination = null,
    validation = null
  }: Data_state_params<T> = {}) {
    this.data = data ?? null
    this.searchData = searchData ?? null
    this.error = error ?? null
    this.message = message ?? null
    this.pagination = pagination ?? null
    this.validation = validation ?? null
  }
}

class DataSuccess<T> extends DataState<T> {
  constructor({
    data = null,
    searchData = null,
    pagination = null,
    message = null
  }: DataSuccessParams<T>) {
    super({
      data: data,
      pagination: pagination,
      searchData: searchData,
      message: message
    })
  }
}

class DataFailed<T> extends DataState<T> {
  constructor({ error }: DataFailedParams<T>) {
    super({ error })
  }
}

class DataLoading<T> extends DataState<T> {
  constructor() {
    super()
  }
}

class DataInitial<T> extends DataState<T> {
  constructor(initialState: T | null = null) {
    super({ data: initialState })
  }
}

class DataDump<T> extends DataState<T> {
  constructor(data: T | null = null, searchData: T | null = null, message: string | null = null) {
    super({ data, searchData, message })
  }
}

class DataEmpty<T> extends DataState<T> {
  constructor(error: ErrorModel) {
    super({ error })
  }
}

class DataValid<T> extends DataState<T> {
  constructor(validation: ValidationModel) {
    super({ validation })
  }
}

export {
  DataState,
  DataSuccess,
  DataFailed,
  DataLoading,
  DataInitial,
  DataDump,
  DataEmpty,
  DataValid
}
