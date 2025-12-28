// ** React Imports
import Box from '@mui/material/Box'
import { ReactNode, useMemo } from 'react'

// ** MUI Imports
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import Layout from 'src/@core/layouts/Layout'

// ** Navigation Imports
import HorizontalNavItems from 'src/navigation/horizontal'
import VerticalNavItems from 'src/navigation/vertical'

// ** Utils
import { filterNavigationByPermissions } from 'src/utils/navigationUtils'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { usePermissions } from 'src/hooks/usePermissions'

// ** Component Import
// Uncomment the below line (according to the layout type) when using server-side menu
// import ServerSideVerticalNavItems from './components/vertical/ServerSideNavItems'
// import ServerSideHorizontalNavItems from './components/horizontal/ServerSideNavItems'

import HorizontalAppBarContent from './components/horizontal/AppBarContent'
import VerticalAppBarContent from './components/vertical/AppBarContent'

// ** Hook Import
import { RootState } from '@/store'
import AddDriverDrawer from '@/views/apps/drivers/AddDriverDrawer'
import AddLocationDrawer from '@/views/apps/locations/AddLocationDrawer'
import AddLegacyOfferDrawer from '@/views/apps/offers/AddLegacyOfferDrawer'
import AddPaymentTypeDrawer from '@/views/apps/paymentTypes/AddPaymentTypeDrawer'
import AddSellerDrawer from '@/views/apps/sellers/AddSellerDrawer'
import { useSelector } from 'react-redux'
import { useSettings } from 'src/@core/hooks/useSettings'
import WelcomeModal from 'src/views/apps/welcome'

interface Props {
  children: ReactNode
  contentHeightFixed?: boolean
}

const AppBrand = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <img
        src="/images/logos/mseller-logo-dark.png"
        alt="mseller logo"
        height="50"
        style={{ paddingLeft: '10px' }}
      />
    </Box>
  )
}

const UserLayout = ({ children, contentHeightFixed }: Props) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()
  const { hasPermission } = usePermissions()
  const { user } = useAuth()

  // Filter navigation items based on permissions and AI agent access
  const filteredVerticalNavItems = useMemo(() => {
    return filterNavigationByPermissions(
      VerticalNavItems(),
      hasPermission,
      user,
    )
  }, [hasPermission, user])
  // ** Vars for server side navigation
  // const { menuItems: verticalMenuItems } = ServerSideVerticalNavItems()
  // const { menuItems: horizontalMenuItems } = ServerSideHorizontalNavItems()

  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/material-ui/react-use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const store = useSelector((state: RootState) => state)
  const isPaymentTypeDrawerOpen = store.paymentTypes.isAddUpdateDrawerOpen
  const isLocationDrawerOpen = store.locations.isAddUpdateDrawerOpen
  const isSellerDrawerOpen = store.sellers.isAddUpdateDrawerOpen
  const isDriverDrawerOpen = store.drivers.isAddUpdateDrawerOpen
  const isLegacyOfferDrawerOpen = store.offers.isAddUpdateDrawerOpen
  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical'
  }

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={contentHeightFixed}
      verticalLayoutProps={{
        navMenu: {
          navItems: filteredVerticalNavItems,
          branding: () => <AppBrand />,
          // Uncomment the below line when using server-side menu in vertical layout and comment the above line
          // navItems: verticalMenuItems
        },
        appBar: {
          content: (props) => (
            <VerticalAppBarContent
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              toggleNavVisibility={props.toggleNavVisibility}
            />
          ),
        },
      }}
      {...(settings.layout === 'horizontal' && {
        horizontalLayoutProps: {
          navMenu: {
            navItems: HorizontalNavItems(),

            // Uncomment the below line when using server-side menu in horizontal layout and comment the above line
            // navItems: horizontalMenuItems
          },
          appBar: {
            content: () => (
              <HorizontalAppBarContent
                settings={settings}
                saveSettings={saveSettings}
              />
            ),
          },
        },
      })}
    >
      <WelcomeModal />
      <AddPaymentTypeDrawer open={isPaymentTypeDrawerOpen} />
      <AddSellerDrawer open={isSellerDrawerOpen} />
      <AddLocationDrawer open={isLocationDrawerOpen} />
      <AddDriverDrawer open={isDriverDrawerOpen} />
      <AddLegacyOfferDrawer open={isLegacyOfferDrawerOpen} />
      {children}
    </Layout>
  )
}

export default UserLayout
