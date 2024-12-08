import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'

interface UseFormNavigationWarningProps {
  form: UseFormReturn<any>
  isSubmitting?: boolean
  warningText?: string
}

export const useFormNavWarning = ({
  form,
  isSubmitting = false,
  warningText = '¿Seguro que deseas salir? Los cambios no guardados se perderán',
}: UseFormNavigationWarningProps) => {
  const router = useRouter()

  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty && !isSubmitting) {
        e.preventDefault()
        e.returnValue = warningText
      }
    }

    const handleBrowseAway = (url: string) => {
      if (form.formState.isDirty && !isSubmitting) {
        const answer = window.confirm(warningText)
        if (!answer) {
          router.events.emit('routeChangeError')
          throw 'routeChange aborted'
        }
      }
    }

    window.addEventListener('beforeunload', handleWindowClose)
    router.events.on('routeChangeStart', handleBrowseAway)

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose)
      router.events.off('routeChangeStart', handleBrowseAway)
    }
  }, [form.formState.isDirty, router, isSubmitting, warningText])
}
