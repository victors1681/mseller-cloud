// ** React Imports
import { ReactElement } from 'react'

// ** Layout Import
import BlankLayoutWithAppBar from 'src/@core/layouts/BlankLayoutWithAppBar'

// ** View Import
import InventoryConteoAnalytics from 'src/views/apps/inventory-management/conteos/InventoryConteoAnalytics'

const InventoryConteoAnalyticsPage = () => {
  return <InventoryConteoAnalytics />
}

InventoryConteoAnalyticsPage.getLayout = (page: ReactElement) => (
  <BlankLayoutWithAppBar>{page}</BlankLayoutWithAppBar>
)

export default InventoryConteoAnalyticsPage
