// ** React Imports
import { ReactElement } from 'react'

// ** Layout Import
import BlankLayoutWithAppBar from 'src/@core/layouts/BlankLayoutWithAppBar'

// ** View Import
import InventoryConteoDetail from 'src/views/apps/inventory-management/conteos/InventoryConteoDetail'

const InventoryConteoDetailPage = () => {
  return <InventoryConteoDetail />
}

InventoryConteoDetailPage.getLayout = (page: ReactElement) => (
  <BlankLayoutWithAppBar>{page}</BlankLayoutWithAppBar>
)

export default InventoryConteoDetailPage
