// ** Types for Document Renderer Component

export interface BatchPrintItem {
  documentNo: string
  tipoDocumento: number
  plantillaId?: number
}

export interface PrintLifecycleCallbacks {
  onPrintStarted?: (documentNo: string) => void
  onPrintCompleted?: (documentNo: string) => void
  onPrintCancelled?: (documentNo: string, error?: string) => void
}

export interface PrintOptions {
  /** Show preview before printing (default: false) */
  showPreview?: boolean
  /** Auto-trigger print dialog (default: true) */
  autoPrint?: boolean
  /** Delay in ms before auto-closing after print (default: 2000) */
  autoCloseDelay?: number
  /** Optional template ID to use instead of default */
  plantillaId?: number
}

export interface DocumentRendererProps
  extends PrintOptions,
    PrintLifecycleCallbacks {
  /** Modal open state */
  open: boolean
  /** Close handler */
  onClose: () => void
  /** Single document number or array for batch printing */
  documentNo?: string
  documentNos?: string[]
  /** Document type (0=Order, 1=Invoice, 2=Quote, etc.) */
  tipoDocumento: number
  /** Optional dialog title */
  title?: string
}

export interface UseDocumentRendererOptions {
  /** Document number to fetch */
  documentNo: string
  /** Document type */
  tipoDocumento: number
  /** Optional template ID */
  plantillaId?: number
  /** Auto-fetch on mount */
  autoFetch?: boolean
}

export interface UseDocumentRendererReturn {
  /** HTML content from API */
  htmlContent: string | null
  /** Loading state */
  loading: boolean
  /** Error message if any */
  error: string | null
  /** Function to fetch/refetch document */
  fetchDocument: () => Promise<void>
  /** Whether silent printing might be available (kiosk mode) */
  isSilentPrintAvailable: boolean
  /** Whether device is mobile */
  isMobile: boolean
}
