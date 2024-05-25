import { useRouter } from 'next/router'

export const useGoBack = (fallBackUrl: string, forceBack?: boolean) => {
  const router = useRouter()

  const handleGoBack = () => {
    const isSameDomain = document.referrer.startsWith(window.location.origin)

    //forceBack temporary until find better way to handle document.referer from the server side
    if (isSameDomain || forceBack) {
      // Go back only if the previous page is from the same domain
      router.back()
    } else {
      router.push(fallBackUrl)
    }
  }

  return {
    goBack: handleGoBack,
  }
}
