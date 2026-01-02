// ** React Imports
import { ReactNode } from 'react'
// ** Next Imports
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Router } from 'next/router'

// ** Store Imports
import { Provider } from 'react-redux'
import { store } from 'src/store'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import type { EmotionCache } from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

// ** Config Imports

import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import AclGuard from 'src/@core/components/auth/AclGuard'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'
import OnboardingGuard from 'src/@core/components/auth/OnboardingGuard'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import UserLayout from 'src/layouts/UserLayout'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Contexts
import {
  SettingsConsumer,
  SettingsProvider,
} from 'src/@core/context/settingsContext'
import { AuthProvider } from 'src/context/AuthContext'
import { FirebaseProvider } from 'src/context/FirebaseContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import { configureRestClient } from 'src/configs/restClient'
import '../../styles/globals.css'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}
configureRestClient()

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout = /print/.test(props.router.route)
    ? Component.getLayout ?? ((page) => <>{page}</>)
    : Component.getLayout ??
      ((page) => (
        <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>
      ))
  const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  const aclAbilities = Component.acl ?? defaultACLObj

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${themeConfig.templateName} - Conecta tu fuerza de ventas y distribución`}</title>
          <meta
            name="description"
            content={`${themeConfig.templateName} – Admin dashboard`}
          />
          <meta
            name="keywords"
            content="Mobile Seller, iPad, iPhone, distribución, ventas"
          />
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>

        <AuthProvider>
          <FirebaseProvider>
            <SettingsProvider
              {...(setConfig ? { pageSettings: setConfig() } : {})}
            >
              <SettingsConsumer>
                {({ settings }) => {
                  return (
                    <ThemeComponent settings={settings}>
                      <Guard authGuard={authGuard} guestGuard={guestGuard}>
                        <OnboardingGuard
                          fallback={<Spinner />}
                          authGuard={authGuard}
                        >
                          <AclGuard
                            aclAbilities={aclAbilities}
                            guestGuard={guestGuard}
                            authGuard={authGuard}
                          >
                            {getLayout(<Component {...pageProps} />)}
                          </AclGuard>
                        </OnboardingGuard>
                      </Guard>
                      <ReactHotToast>
                        <Toaster
                          position={settings.toastPosition}
                          toastOptions={{ className: 'react-hot-toast' }}
                        />
                      </ReactHotToast>
                    </ThemeComponent>
                  )
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </FirebaseProvider>
        </AuthProvider>
      </CacheProvider>
    </Provider>
  )
}

export default App
