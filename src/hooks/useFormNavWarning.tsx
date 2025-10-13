import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'

// Form-based interface (preferred)
interface UseFormNavigationWarningProps {
  form: UseFormReturn<any>
  isSubmitting?: boolean
  warningText?: string
}

// Legacy interface for backward compatibility
interface UseFormNavWarningLegacyProps {
  isDirty: boolean
  isOpen: boolean
  isSubmitting?: boolean
  warningText?: string
}

// Function overloads
export function useFormNavWarning(props: UseFormNavigationWarningProps): void
export function useFormNavWarning(props: UseFormNavWarningLegacyProps): void
export function useFormNavWarning(
  props: UseFormNavigationWarningProps | UseFormNavWarningLegacyProps,
): void {
  const router = useRouter()

  // Type guard to determine which interface is being used
  const isFormBased = 'form' in props

  const {
    warningText = '¿Seguro que deseas salir? Los cambios no guardados se perderán',
  } = props

  // Extract values for proper dependency tracking
  const isDirty = isFormBased
    ? (props as UseFormNavigationWarningProps).form?.formState?.isDirty || false
    : (props as UseFormNavWarningLegacyProps).isDirty || false

  const isOpen = isFormBased
    ? true // Form-based interface doesn't have isOpen concept
    : (props as UseFormNavWarningLegacyProps).isOpen || false

  const isSubmitting = isFormBased
    ? (props as UseFormNavigationWarningProps).isSubmitting || false
    : (props as UseFormNavWarningLegacyProps).isSubmitting || false

  useEffect(() => {
    // Event handlers that always check current state
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      // Calculate shouldWarn using current values at event time
      const shouldWarn = isDirty && isOpen && !isSubmitting
      if (shouldWarn) {
        e.preventDefault()
        e.returnValue = warningText
        return e.returnValue
      }
    }

    const handleBrowseAway = (url: string) => {
      // Calculate shouldWarn using current values at event time
      const shouldWarn = isDirty && isOpen && !isSubmitting
      if (shouldWarn) {
        const answer = window.confirm(warningText)
        if (!answer) {
          router.events.emit('routeChangeError')
          throw 'routeChange aborted'
        }
      }
    }

    // Always add listeners
    window.addEventListener('beforeunload', handleWindowClose)
    router.events.on('routeChangeStart', handleBrowseAway)

    // Always clean up listeners
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose)
      router.events.off('routeChangeStart', handleBrowseAway)
    }
  }, [isDirty, isOpen, isSubmitting, router, warningText])
}
