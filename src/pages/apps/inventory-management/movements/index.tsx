// ** Next Imports
import { useRouter } from 'next/router'
import { useEffect } from 'react'

// ** Redux Imports
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { setFilters } from 'src/store/apps/inventoryMovements'

// ** Views
import MovementsView from 'src/views/apps/inventory-management/movements/MovementsView'

const MovementsPage = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  // Handle URL parameters
  useEffect(() => {
    if (router.isReady) {
      const { productCode } = router.query

      if (productCode && typeof productCode === 'string') {
        dispatch(setFilters({ codigoProducto: productCode }))
      }
    }
  }, [router.isReady, router.query, dispatch])

  return <MovementsView />
}

export default MovementsPage
