export interface PaginatedResponse<T> {
  data: T[]
  total: number
  pageNumber: number
  pageSize: number
  totalPages: number
  totalResults: number
}
