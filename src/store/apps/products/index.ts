// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import { PaginatedResponse } from 'src/types/apps/response'
import { ProductDetailType, ProductType } from 'src/types/apps/productTypes'
import restClient from 'src/configs/restClient'
import { toast } from 'react-hot-toast'
import { AppDispatch, RootState } from '@/store'

interface DataParams {
  query?: string
  codigoProducto?: string
  status?: string
  pageNumber: number
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export interface AxiosResponse<T> {
  data: T
}

export const addProducts = createAsyncThunk(
  'appProduct/addProducts',
  async (products: ProductType[], { dispatch, getState }: Redux) => {
    const response = await restClient.post('/api/portal/Producto', products)
    const state = getState()
    const params = state.appSeller.params

    await dispatch(fetchData(params))

    return response.data
  },
)

interface UpdateProductResponse {
  success: boolean
  data: ProductType
  message: string
}

export const updateProduct = createAsyncThunk<
  UpdateProductResponse,
  ProductType,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appProduct/updateProduct',
  async (product: ProductType, { dispatch, getState, rejectWithValue }) => {
    try {
      if (!product.codigo || !product.nombre) {
        return rejectWithValue({
          message: 'Código y nombre son requeridos',
        })
      }

      const response = await restClient.put<UpdateProductResponse>(
        '/api/portal/Producto',
        product,
      )

      if (response.status === 200) {
        toast.success('Producto actualizado exitosamente')

        return {
          success: true,
          data: response.data.data,
          message: 'Producto actualizado exitosamente',
        }
      }

      return rejectWithValue({
        message: response?.data?.message || 'Error actualizando producto',
      })
    } catch (error) {
      console.error('Update product error:', error)
      return rejectWithValue({
        message: 'Error inesperado actualizando producto',
      })
    }
  },
)

export const fetchProductDetail = createAsyncThunk(
  'appProduct/productDetail',
  async (id: string, { dispatch, getState }: Redux) => {
    const state = getState()
    try {
      const response = await restClient.get<
        { codigoProducto: string },
        AxiosResponse<ProductDetailType>
      >('/api/portal/Producto/detalle', {
        params: {
          codigoProducto: id,
        },
      })

      //await dispatch(fetchData(params))
      return {
        productDetail: response.data.producto,
        areas: response.data.areas,
        departments: response.data.departamentos,
        taxes: response.data.impuestos,
        packings: response.data.empaques,
        isLoading: false,
      }
    } catch (error) {
      throw new Error('Error al obtener el detalle del producto')
    }
  },
)

// ** Fetch Products
export const fetchData = createAsyncThunk(
  'appProduct/fetchProducts',
  async (params: DataParams) => {
    if (params.status === '') {
      delete params.status
    }
    if (params.query === '') {
      delete params.query
    }
    if (params.codigoProducto === '') {
      delete params.codigoProducto
    }

    const response = await restClient.get<
      any,
      AxiosResponse<PaginatedResponse<ProductType>>
    >('/api/portal/Producto', {
      params,
    })

    return {
      data: response.data.data,
      params,
      allData: [],
      pageNumber: response.data.pageNumber,
      pageSize: response.data.pageSize,
      totalPages: response.data.totalPages,
      totalResults: response.data.totalResults,
      total: response.data.data.length,
      isLoading: false,
    }
  },
)

export const deleteProduct = createAsyncThunk(
  'appProduct/deleteData',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.delete('/apps/product/delete', {
      data: id,
    })
    await dispatch(fetchData(getState().Product.params))

    return response.data
  },
)

export const appProductSlice = createSlice({
  name: 'appProduct',
  initialState: {
    data: [] as ProductType[],
    productDetail: {} as ProductType,
    areas: [] as string[],
    departments: [] as string[],
    taxes: [] as string[],
    packings: [] as string[],
    params: {},
    pageNumber: 0,
    pageSize: 0,
    totalPages: 0,
    totalResults: 0,
    total: 0,
    isLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchData.rejected, (state, action) => {
      state.isLoading = false
      state.data = []
      state.total = 0
      state.pageNumber = 0
      state.pageSize = 0
      state.totalPages = 0
    })
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.params = action.payload.params
      state.total = action.payload.total
      state.pageNumber = action.payload.pageNumber
      state.pageSize = action.payload.pageSize
      state.totalPages = action.payload.totalPages
      ;(state.totalResults = action.payload.totalResults),
        (state.isLoading = false)
    })

    builder.addCase(fetchProductDetail.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchProductDetail.rejected, (state, action) => {
      state.isLoading = false
    })

    builder.addCase(fetchProductDetail.fulfilled, (state, action) => {
      state.productDetail = action.payload.productDetail
      state.areas = action.payload.areas
      state.departments = action.payload.departments
      state.taxes = action.payload.taxes
      state.packings = action.payload.packings
      state.isLoading = false
    })

    builder.addCase(addProducts.fulfilled, (state, action) => {
      state.data = [...state.data, ...action.payload]
    })
  },
})

export default appProductSlice.reducer
