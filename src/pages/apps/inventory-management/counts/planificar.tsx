// ** React Imports
import { ReactElement } from 'react'

// ** Layout Import
import BlankLayoutWithAppBar from 'src/@core/layouts/BlankLayoutWithAppBar'

// ** View Import
import PlanificarConteo from 'src/views/apps/inventory-management/conteos/PlanificarConteo'

const PlanificarConteoPage = () => {
  return <PlanificarConteo />
}

PlanificarConteoPage.getLayout = (page: ReactElement) => (
  <BlankLayoutWithAppBar>{page}</BlankLayoutWithAppBar>
)

export default PlanificarConteoPage
