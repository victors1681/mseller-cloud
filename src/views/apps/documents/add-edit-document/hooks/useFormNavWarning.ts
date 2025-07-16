import { useEffect } from 'react'
import { useRouter } from 'next/router'

interface UseFormNavWarningProps {
  isDirty: boolean
  isOpen: boolean
}

export const useFormNavWarning = ({
  isDirty,
  isOpen,
}: UseFormNavWarningProps) => {
  const router = useRouter()

  useEffect(() => {
    if (!isOpen || !isDirty) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue =
          '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'
        return e.returnValue
      }
    }

    const handleRouteChange = (url: string) => {
      if (
        isDirty &&
        !window.confirm(
          '¿Estás seguro de que quieres navegar? Los cambios no guardados se perderán.',
        )
      ) {
        router.events.emit('routeChangeError')
        throw 'routeChange aborted.'
      }
    }

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload)
    router.events.on('routeChangeStart', handleRouteChange)

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [isDirty, isOpen, router])
}
