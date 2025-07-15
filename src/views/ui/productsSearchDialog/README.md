# ProductSearchDialog Component

A reusable dialog component for searching and selecting products in the mseller-cloud application.

## Features

- **Search Functionality**: Search products by code, name, or description
- **Special Code Search**: Use the pattern `codigo#` for direct product code search
- **Product Table**: Display products in a table with codigo, nombre, precio, inventario, and estado
- **Multiple Price Selection**: Choose from available prices (precio1-precio5) using dropdown menus
- **Inventory Display**: View available inventory (existenciaAlmacen1) for each product
- **Pagination**: Navigate through search results with built-in pagination
- **Product Selection**: Select products by clicking on table rows or using the selection button
- **Loading States**: Visual feedback during search operations
- **Responsive Design**: Adapts to different screen sizes

## Usage

### Basic Implementation

```tsx
import { useState } from 'react'
import { ProductType } from 'src/types/apps/productTypes'
import ProductSearchDialog from 'src/views/ui/productsSearchDialog'

const MyComponent = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  )

  const handleSelectProduct = (product: ProductType) => {
    setSelectedProduct(product)
    // Handle the selected product here
    console.log('Selected product:', product)
  }

  return (
    <>
      <Button onClick={() => setDialogOpen(true)}>Search Product</Button>

      <ProductSearchDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSelectProduct={handleSelectProduct}
      />
    </>
  )
}
```

### Using the Hook (Recommended)

For easier state management, use the provided `useProductSearchDialog` hook:

```tsx
import { ProductType } from 'src/types/apps/productTypes'
import ProductSearchDialog, {
  useProductSearchDialog,
} from 'src/views/ui/productsSearchDialog'

const MyComponent = () => {
  const productDialog = useProductSearchDialog({
    onProductSelect: (product: ProductType) => {
      console.log('Selected product:', product)
      // Handle the selected product here
    },
  })

  return (
    <>
      <Button onClick={productDialog.openDialog}>Search Product</Button>

      {productDialog.selectedProduct && (
        <div>
          Selected: {productDialog.selectedProduct.nombre}
          <Button onClick={productDialog.clearSelection}>Clear</Button>
        </div>
      )}

      <ProductSearchDialog
        open={productDialog.dialogOpen}
        onClose={productDialog.closeDialog}
        onSelectProduct={productDialog.handleSelectProduct}
      />
    </>
  )
}
```

### Props

| Prop              | Type                                   | Required | Default             | Description                         |
| ----------------- | -------------------------------------- | -------- | ------------------- | ----------------------------------- |
| `open`            | `boolean`                              | Yes      | -                   | Controls dialog visibility          |
| `onClose`         | `() => void`                           | Yes      | -                   | Callback when dialog is closed      |
| `onSelectProduct` | `(product: ProductType) => void`       | Yes      | -                   | Callback when a product is selected |
| `title`           | `string`                               | No       | `"Buscar Producto"` | Dialog title                        |
| `maxWidth`        | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No       | `'lg'`              | Maximum dialog width                |

### Hook Options (useProductSearchDialog)

| Option            | Type                             | Default     | Description                                           |
| ----------------- | -------------------------------- | ----------- | ----------------------------------------------------- |
| `onProductSelect` | `(product: ProductType) => void` | `undefined` | Callback when a product is selected                   |
| `autoClose`       | `boolean`                        | `true`      | Whether to automatically close dialog after selection |

### Hook Return Value

| Property              | Type                             | Description                            |
| --------------------- | -------------------------------- | -------------------------------------- |
| `dialogOpen`          | `boolean`                        | Current dialog open state              |
| `selectedProduct`     | `ProductType \| null`            | Currently selected product             |
| `openDialog`          | `() => void`                     | Function to open the dialog            |
| `closeDialog`         | `() => void`                     | Function to close the dialog           |
| `handleSelectProduct` | `(product: ProductType) => void` | Function to handle product selection   |
| `clearSelection`      | `() => void`                     | Function to clear the selected product |

### Search Features

#### Regular Search

- Type any text to search by product name or description
- Results are automatically filtered as you type (with debounce)

#### Code Search

- Use the pattern `codigo#` for direct product code lookup
- Example: `ABC123#` will search for product with code "ABC123"
- Provides immediate results for known product codes

### Product Information Displayed

The table shows the following product information:

- **Código**: Product code
- **Nombre**: Product name with description preview
- **Precio**: Primary price (precio1) and cost information
- **Estado**: Product status (Activo/Inactivo) with color-coded chips

### Integration with Redux Store

The component automatically integrates with the application's Redux store:

- Uses `fetchData` action from `src/store/apps/products`
- Accesses product data from the products store state
- Handles loading states and error scenarios

### Example Implementation

See the following example files for different use cases:

- `ProductSearchDialogExample.tsx`: Basic usage example
- `ProductSearchDialogHookExample.tsx`: Hook usage example
- `ProductSearchWithFormExample.tsx`: Integration with react-hook-form

## Dependencies

- Material-UI components
- Redux for state management
- Product types from the application's type definitions
- Icon component from the core components

## Related Components

- `ProductAutoComplete`: For autocomplete-style product selection
- Product management pages in `/src/pages/apps/products/`

## File Structure

```text
src/views/ui/productsSearchDialog/
├── index.tsx                           # Main dialog component
├── useProductSearchDialog.ts           # Custom hook for state management
├── ProductSearchDialogExample.tsx      # Basic usage example
├── ProductSearchDialogHookExample.tsx  # Hook usage example
├── exports.ts                          # Centralized exports
└── README.md                          # This documentation
```

## Import Options

```tsx
// Import main component
import ProductSearchDialog from 'src/views/ui/productsSearchDialog'

// Import with hook
import ProductSearchDialog, {
  useProductSearchDialog,
} from 'src/views/ui/productsSearchDialog'

// Import from exports file
import {
  ProductSearchDialog,
  useProductSearchDialog,
} from 'src/views/ui/productsSearchDialog/exports'
```
