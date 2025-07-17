# Customer Search Dialog

A reusable React component for searching and selecting customers in the mseller-cloud application.

## Features

- **Search Functionality**: Search customers by code or name with real-time results
- **Debounced Search**: Optimized search with 300ms debounce to reduce API calls
- **Pagination**: Navigate through multiple pages of results
- **Responsive Design**: Works on desktop and mobile devices
- **Redux Integration**: Uses the existing customer store and API endpoints
- **Customizable**: Configurable dialog size, title, and selection behavior

## Files

- `index.tsx` - Main CustomerSearchDialog component
- `useCustomerSearchDialog.ts` - Custom hook for dialog state management
- `CustomerSearchDialogExample.tsx` - Example usage component
- `README.md` - This documentation

## Usage

### Basic Usage

```tsx
import CustomerSearchDialog from 'src/views/ui/customerSearchDialog'
import { useCustomerSearchDialog } from 'src/views/ui/customerSearchDialog/useCustomerSearchDialog'

const MyComponent = () => {
  const customerSearchDialog = useCustomerSearchDialog({
    onCustomerSelect: (customer) => {
      console.log('Selected customer:', customer)
      // Handle customer selection
    },
    autoClose: true,
  })

  return (
    <>
      <Button onClick={customerSearchDialog.openDialog}>Search Customer</Button>

      <CustomerSearchDialog
        open={customerSearchDialog.dialogOpen}
        onClose={customerSearchDialog.closeDialog}
        onSelectCustomer={customerSearchDialog.handleSelectCustomer}
        title="Select Customer"
        maxWidth="lg"
      />
    </>
  )
}
```

### Integration with TextField

```tsx
<TextField
  fullWidth
  size="small"
  label="Customer Code"
  value={selectedCustomer?.codigo || ''}
  placeholder="Select a customer"
  InputProps={{
    readOnly: true,
    endAdornment: (
      <IconButton size="small" onClick={customerSearchDialog.openDialog}>
        <Icon icon="mdi:magnify" />
      </IconButton>
    ),
  }}
/>
```

## Props

### CustomerSearchDialog Props

| Prop               | Type                                   | Default            | Description                        |
| ------------------ | -------------------------------------- | ------------------ | ---------------------------------- |
| `open`             | `boolean`                              | -                  | Controls dialog visibility         |
| `onClose`          | `() => void`                           | -                  | Callback when dialog is closed     |
| `onSelectCustomer` | `(customer: CustomerType) => void`     | -                  | Callback when customer is selected |
| `title`            | `string`                               | `'Buscar Cliente'` | Dialog title                       |
| `maxWidth`         | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`             | Maximum dialog width               |

### useCustomerSearchDialog Props

| Prop               | Type                               | Default | Description                               |
| ------------------ | ---------------------------------- | ------- | ----------------------------------------- |
| `onCustomerSelect` | `(customer: CustomerType) => void` | -       | Callback when customer is selected        |
| `autoClose`        | `boolean`                          | `true`  | Whether to auto-close dialog on selection |

## API Integration

The component uses the existing customer store and API:

- **Store**: `state.clients` from Redux store
- **Action**: `fetchData` from `src/store/apps/clients`
- **API Endpoint**: `/api/portal/Cliente` (via `restClient`)

## Search Parameters

The search sends the following parameters to the API:

```typescript
{
  query: string,        // Search term (code or name)
  pageNumber: number,   // Current page (1-based)
  dates: [],           // Empty array
  procesado: '',       // Empty string
  vendedor: '',        // Empty string
}
```

## Table Columns

The search results table displays:

1. **Código** - Customer code
2. **Nombre** - Customer name
3. **Teléfono** - Phone number (telefono1)
4. **Ciudad** - City
5. **Estado** - Status (with color-coded chip)
6. **Acciones** - Select button

## Styling

The component uses Material-UI components and follows the application's design system:

- Small table size for compact display
- Hover effects on table rows
- Color-coded status chips
- Consistent spacing and typography
- Responsive pagination controls

## Error Handling

- Shows loading spinner during API calls
- Displays "No customers found" message when search returns empty results
- Graceful handling of missing customer data fields

## Performance Optimizations

- **Debounced Search**: 300ms delay to reduce API calls
- **Memoized Functions**: Optimized re-renders
- **Sticky Table Header**: Better UX for long lists
- **Controlled Pagination**: Efficient data loading
