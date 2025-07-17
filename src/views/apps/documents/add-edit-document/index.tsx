import React, { forwardRef } from 'react'
import {
  Dialog,
  Button,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Slide,
  Grid,
  CircularProgress,
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Date Picker Wrapper
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Components
import ProductSearchDialog from 'src/views/ui/productsSearchDialog'
import CustomerSearchDialog from 'src/views/ui/customerSearchDialog'

// ** Local Components
import {
  DocumentHeader,
  CustomerInformation,
  DocumentInformation,
  DetailsTable,
  DetailForm,
  OrderSummary,
  AdditionalInformation,
} from './components'

// ** Hooks
import { useEditDocument } from './hooks'
import { useFormNavWarning } from './hooks/useFormNavWarning'

// ** Types
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
      handleClose()
    }
  }

  // Protect against accidental navigation with unsaved changes
  useFormNavWarning({ isDirty, isOpen: open })

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
          <Toolbar>
            <Icon
              icon="mdi:close"
              onClick={handleClose}
              style={{
                cursor: 'pointer',
                marginRight: '16px',
                color: 'white',
              }}
            />
            <Typography
              sx={{ ml: 2, flex: 1, color: 'white' }}
              variant="h6"
              component="div"
            >
              {store.isCreateMode ? 'Crear Documento' : 'Editar Documento'}
              {isDirty && (
                <span style={{ color: '#ffeb3b', marginLeft: '8px' }}>
                  • (Sin guardar)
                </span>
              )}
            </Typography>
            <Button
              autoFocus
              color="inherit"
              type="submit"
              form="document-form"
              disabled={store.isLoadingDetails || store.isSubmitting}
            >
              {store.isLoadingDetails
                ? 'Cargando...'
                : store.isSubmitting
                ? 'Guardando...'
                : store.isCreateMode
                ? 'Crear'
                : 'Guardar'}
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3, overflow: 'auto' }}>
          {store.isLoadingDetails ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 400,
              }}
            >
              <CircularProgress size={60} />
            </Box>
          ) : (
            <form onSubmit={mainForm.handleSubmit(onSubmit)} id="document-form">
              <Grid container spacing={3} maxWidth="lg" sx={{ mx: 'auto' }}>
                {/* Document Header */}
                <DocumentHeader
                  documentData={store.documentEditData}
                  isCreateMode={store.isCreateMode}
                />

                {/* Customer and Document Information */}
                <Grid item xs={12}>
                  <Grid container spacing={3}>
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
        maxWidth="lg"
      />

      {/* Customer Search Dialog */}
      <CustomerSearchDialog
        open={customerSearchDialog.dialogOpen}
        onClose={customerSearchDialog.closeDialog}
        onSelectCustomer={customerSearchDialog.handleSelectCustomer}
        title="Buscar y Seleccionar Cliente"
        maxWidth="lg"
      />
    </Dialog>
  )
}

export default EditDocumentDialog
