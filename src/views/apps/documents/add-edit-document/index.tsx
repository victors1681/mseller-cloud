import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  Slide,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import React, { forwardRef, useState } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Date Picker Wrapper
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Components
import CustomerSearchDialog from 'src/views/ui/customerSearchDialog'
import ProductSearchDialog from 'src/views/ui/productsSearchDialog'

// ** Local Components
import {
  AdditionalInformation,
  CustomerInformation,
  DetailForm,
  DetailsTable,
  DocumentHeader,
  DocumentInformation,
  DocumentSuccessModal,
  OrderSummary,
} from './components'

// ** Hooks
import { useFormNavWarning } from 'src/hooks/useFormNavWarning'
import { useEditDocument } from './hooks'

// ** Types
import {
  TipoDocumentoEnum,
  tipoDocumentoSpanishNames,
} from 'src/types/apps/documentTypes'
import { EditDocumentDialogProps } from './types'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const EditDocumentDialog: React.FC<EditDocumentDialogProps> = ({ open }) => {
  // ** Responsive
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [savedDocumentData, setSavedDocumentData] = useState<any>(null)

  const {
    store,
    detailsData,
    newDetailForm,
    selectedCustomerData,
    orderCalculations,
    mainForm,
    detailForm,
    detailManagement,
    productSearchDialog,
    customerSearchDialog,
    isDirty,
    handleSubmit,
    handleClose,
  } = useEditDocument(open)

  const onSubmit = async (data: any) => {
    const result = await handleSubmit(data)
    if (result.success) {
      setSavedDocumentData(data)
      setShowSuccessModal(true)
      // Don't close immediately, wait for user action from success modal
    }
  }

  // Success modal handler
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    handleClose(true)
  }

  // Protect against accidental navigation with unsaved changes
  // Hook will cleanup listeners when isOpen becomes false
  useFormNavWarning({
    isDirty: open && isDirty,
    isOpen: open,
    isSubmitting: store.isSubmitting,
  })

  // Get button text based on document type
  const getButtonText = () => {
    if (store.isLoadingDetails) return 'Cargando...'
    if (store.isSubmitting) return 'Guardando...'

    if (store.isCreateMode) {
      const tipoDocumento = mainForm.watch('tipoDocumento') as TipoDocumentoEnum
      const documentTypeName =
        tipoDocumentoSpanishNames[tipoDocumento] || 'Documento'
      return `Crear ${documentTypeName}`
    }

    return 'Guardar'
  }

  // Handle dialog close with dirty check
  const handleDialogClose = (
    event: {},
    reason: 'backdropClick' | 'escapeKeyDown',
  ) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      handleClose() // This will include the dirty check
    }
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleDialogClose}
      TransitionComponent={Transition}
    >
      <DatePickerWrapper>
        <AppBar sx={{ position: 'sticky', top: 0, zIndex: 1300 }}>
          <Toolbar
            sx={{
              minHeight: isMobile ? 56 : 64,
              px: isMobile ? 1 : 3,
              flexDirection: isSmallMobile ? 'column' : 'row',
              alignItems: isSmallMobile ? 'stretch' : 'center',
              gap: isSmallMobile ? 1 : 0,
              py: isSmallMobile ? 1 : 0,
            }}
          >
            {/* Top row for small mobile */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: isSmallMobile ? '100%' : 'auto',
                flex: isSmallMobile ? 'none' : 1,
              }}
            >
              <Icon
                icon="mdi:close"
                onClick={() => handleClose()}
                style={{
                  cursor: 'pointer',
                  marginRight: isMobile ? '8px' : '16px',
                  color: 'white',
                  fontSize: isMobile ? '1.25rem' : '1.5rem',
                }}
              />
              <Typography
                sx={{
                  ml: isMobile ? 1 : 2,
                  flex: 1,
                  color: 'white',
                  fontSize: isMobile ? '1rem' : '1.25rem',
                  fontWeight: 500,
                }}
                variant={isMobile ? 'subtitle1' : 'h6'}
                component="div"
                noWrap={!isSmallMobile}
              >
                {store.isCreateMode ? 'Crear Documento' : 'Editar Documento'}
                {isDirty && (
                  <span
                    style={{
                      color: '#ffeb3b',
                      marginLeft: isMobile ? '4px' : '8px',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                    }}
                  >
                    • (Sin guardar)
                  </span>
                )}
              </Typography>
            </Box>

            {/* Button - separate row on small mobile */}
            <Button
              autoFocus
              variant="outlined"
              color="inherit"
              type="submit"
              form="document-form"
              disabled={store.isLoadingDetails || store.isSubmitting}
              size={'small'}
              sx={{
                minHeight: isMobile ? 40 : 'auto',
                fontSize: isMobile ? '0.875rem' : '1rem',
                fontWeight: 600,
                px: isMobile ? 2 : 3,
                width: isSmallMobile ? '100%' : 'auto',
                mt: isSmallMobile ? 1 : 0,
              }}
            >
              {getButtonText()}
            </Button>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            p: isMobile ? 2 : 3,
            overflow: 'auto',
            pb: isMobile ? 3 : 3, // Extra bottom padding for mobile
          }}
        >
          {store.isLoadingDetails ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: isMobile ? 300 : 400,
              }}
            >
              <CircularProgress size={isMobile ? 40 : 60} />
            </Box>
          ) : (
            <form onSubmit={mainForm.handleSubmit(onSubmit)} id="document-form">
              <Grid
                container
                spacing={isMobile ? 2 : 3}
                maxWidth="lg"
                sx={{
                  mx: 'auto',
                  width: '100%',
                }}
              >
                {/* Document Header */}
                <DocumentHeader
                  documentData={store.documentEditData}
                  isCreateMode={store.isCreateMode}
                />

                {/* Customer and Document Information */}
                <Grid item xs={12}>
                  <Grid container spacing={isMobile ? 2 : 3}>
                    <CustomerInformation
                      control={mainForm.control}
                      setValue={mainForm.setValue as any}
                      selectedCustomerData={selectedCustomerData}
                      documentEditData={store.documentEditData}
                      isCreateMode={store.isCreateMode}
                      isSubmitting={store.isSubmitting}
                      onCustomerSearch={customerSearchDialog.openDialog}
                    />

                    <DocumentInformation
                      control={mainForm.control}
                      setValue={mainForm.setValue as any}
                      isSubmitting={store.isSubmitting}
                      isCreateMode={store.isCreateMode}
                    />
                  </Grid>
                </Grid>

                {/* Details Table */}
                <DetailsTable
                  detailsData={detailsData}
                  isEditingDetail={detailManagement.isEditingDetail}
                  onEditDetail={detailManagement.handleEditDetail}
                  onDeleteDetail={detailManagement.handleDeleteDetail}
                />

                {/* Detail Form */}
                <DetailForm
                  control={detailForm.control}
                  cantidadInputRef={detailManagement.cantidadInputRef}
                  newDetailForm={newDetailForm}
                  setNewDetailForm={() => {}} // Form sync is handled in the hook
                  isEditingDetail={detailManagement.isEditingDetail}
                  onProductSearch={productSearchDialog.openDialog}
                  onSaveDetail={detailManagement.handleSaveDetail}
                  onCancelEdit={detailManagement.handleCancelEdit}
                />

                {/* Order Summary */}
                <OrderSummary orderCalculations={orderCalculations} />

                {/* Additional Information */}
                <AdditionalInformation
                  control={mainForm.control}
                  isSubmitting={store.isSubmitting}
                />
              </Grid>
            </form>
          )}
        </Box>
      </DatePickerWrapper>

      {/* Product Search Dialog */}
      <ProductSearchDialog
        open={productSearchDialog.dialogOpen}
        onClose={productSearchDialog.closeDialog}
        onSelectProduct={productSearchDialog.handleSelectProduct}
        title="Buscar y Seleccionar Producto"
        maxWidth={isMobile ? 'sm' : 'lg'}
      />

      {/* Customer Search Dialog */}
      <CustomerSearchDialog
        open={customerSearchDialog.dialogOpen}
        onClose={customerSearchDialog.closeDialog}
        onSelectCustomer={customerSearchDialog.handleSelectCustomer}
        title="Buscar y Seleccionar Cliente"
        maxWidth={isMobile ? 'sm' : 'lg'}
      />

      {/* Success Modal */}
      <DocumentSuccessModal
        open={showSuccessModal}
        onClose={handleSuccessModalClose}
        documentId={
          store.documentEditData?.noPedidoStr || savedDocumentData?.noPedidoStr
        }
        documentNumber={
          store.documentEditData?.noPedidoStr || savedDocumentData?.noPedidoStr
        }
        documentData={savedDocumentData || store.documentEditData}
      />
    </Dialog>
  )
}

export default EditDocumentDialog
