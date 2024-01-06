import { useRouter } from 'next/router'

export const useGoBack = (fallBackUrl: string) => {
  const router = useRouter()

  const handleGoBack = () => {
    const isSameDomain = document.referrer.startsWith(window.location.origin)

    if (isSameDomain) {
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
