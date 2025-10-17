# MSeller Cloud - GitHub Copilot Instructions

## Project Overview

MSeller Cloud is a Next.js admin template built with Material-UI (MUI) using the Materio template. The project follows a modular architecture with TypeScript, Redux Toolkit, and Firebase integration.

## Module Creation Guidelines

### 1. New Module Checklist (Following CXC Module Pattern)

When creating a new module, follow these steps in order:

#### ✅ **1. Create Redux Store Structure**

```
src/store/apps/[module]/
├── index.ts
└── [module]Slice.ts
```

#### ✅ **2. Define TypeScript Types**

```
src/types/apps/[module]Types.ts
```

#### ✅ **3. Create Page Components**

```
src/pages/apps/[module]/
├── index.tsx
├── reports/index.tsx (if needed)
├── detail/[id].tsx (if needed)
└── [other-pages].tsx
```

#### ✅ **4. Create View Components**

```
src/views/apps/[module]/
├── [Module]ListView.tsx
├── [Module]DetailView.tsx
├── [Module]ReportsView.tsx (if needed)
└── components/
    ├── [Module]Card.tsx
    ├── [Module]Modal.tsx
    └── [other-components].tsx
```

#### ✅ **5. Update Navigation**

```typescript
// In src/navigation/vertical/index.ts
{
  title: 'Module Name',
  icon: 'mdi:icon-name',
  children: [
    {
      title: 'List View',
      path: '/apps/[module]',
      icon: 'mdi:list'
    },
    {
      title: 'Reports',
      path: '/apps/[module]/reports',
      icon: 'mdi:chart-line'
    }
  ]
}
```

#### ✅ **6. Register in Main Store**

```typescript
// In src/store/index.ts
import [module]Slice from './apps/[module]'

export const store = configureStore({
  reducer: {
    // ... other reducers
    [module]: [module]Slice,
  }
})
```

### 2. File Structure Templates

#### **Page Component Template**

````tsx
#### **Page Component Template**
```tsx
// pages/apps/[module]/index.tsx
import [Module]ListView from 'src/views/apps/[module]/[Module]ListView'

const [Module]Page = () => {
  return <[Module]ListView />
}

export default [Module]Page
````

**Important**: Do NOT add `.getLayout` assignments to page components. The layout is handled automatically by the application.

````

#### **Redux Slice Template**

```typescript
// store/apps/[module]/[module]Slice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import restClient from 'src/configs/restClient'
import { [Module]State, [Module]Filters } from 'src/types/apps/[module]Types'

const initialState: [Module]State = {
  data: [],
  total: 0,
  loading: false,
  error: null,
  selectedItem: null,
}

// Async thunks
export const fetch[Module]Data = createAsyncThunk(
  '[module]/fetchData',
  async (params: [Module]Filters) => {
    const response = await restClient.get('/api/portal/[Module]', { params })
    return response.data
  }
)

const [module]Slice = createSlice({
  name: '[module]',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetch[Module]Data.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetch[Module]Data.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.data
        state.total = action.payload.total
      })
      .addCase(fetch[Module]Data.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error fetching data'
      })
  },
})

export const { setLoading, clearError } = [module]Slice.actions
export default [module]Slice.reducer
````

#### **Types Template**

```typescript
// types/apps/[module]Types.ts

// ============================================
// Enums
// ============================================
export enum [Module]Status {
  Active = 'Active',
  Inactive = 'Inactive',
  Pending = 'Pending',
}

// ============================================
// Main Entity Interface
// ============================================
export interface [Module]Item {
  id: number
  name: string
  status: [Module]Status
  createdAt: string
  updatedAt: string
}

// ============================================
// API Interfaces
// ============================================
export interface [Module]Filters {
  search?: string
  status?: [Module]Status
  vendedorId?: string
  localidadId?: number
  distribuidorId?: string
  pageNumber?: number
  pageSize?: number
}

export interface [Module]State {
  data: [Module]Item[]
  total: number
  loading: boolean
  error: string | null
  selectedItem: [Module]Item | null
}

export interface Paginated[Module]Response {
  data: [Module]Item[]
  total: number
  pageNumber: number
  pageSize: number
  totalPages: number
}
```

## Custom UI Components

### Filter Components

Use these custom autocomplete components for common filters:

#### **Seller Filter (Vendedores)**

```tsx
import SellerAutoComplete from 'src/views/ui/sellerAutoComplete'
;<SellerAutoComplete
  value={filters.vendedorId}
  onChange={(value) => setFilters({ ...filters, vendedorId: value })}
  fullWidth
  sx={{ mb: 2 }}
/>
```

#### **Location Filter (Localidad)**

```tsx
import LocationAutoComplete from 'src/views/ui/locationAutoComplete'
;<LocationAutoComplete
  value={filters.localidadId}
  onChange={(value) => setFilters({ ...filters, localidadId: value })}
  fullWidth
  sx={{ mb: 2 }}
/>
```

#### **Driver Filter (Distribuidores)**

```tsx
import DriverAutoComplete from 'src/views/ui/driverAutoComplete'
;<DriverAutoComplete
  value={filters.distribuidorId}
  onChange={(value) => setFilters({ ...filters, distribuidorId: value })}
  fullWidth
  sx={{ mb: 2 }}
/>
```

### Search Dialog Components

#### **Customer Search (Quick Find Customer)**

```tsx
import CustomerSearchDialog from 'src/views/ui/customerSearchDialog'

const [customerDialogOpen, setCustomerDialogOpen] = useState(false)

// Usage in component
<Button
  variant="outlined"
  onClick={() => setCustomerDialogOpen(true)}
  startIcon={<SearchIcon />}
>
  Buscar Cliente
</Button>

<CustomerSearchDialog
  open={customerDialogOpen}
  onClose={() => setCustomerDialogOpen(false)}
  onSelect={(customer) => {
    setSelectedCustomer(customer)
    setCustomerDialogOpen(false)
  }}
/>
```

#### **Product Search (Quick Locate Product)**

```tsx
import ProductsSearchDialog from 'src/views/ui/productsSearchDialog'

const [productDialogOpen, setProductDialogOpen] = useState(false)

// Usage in component
<Button
  variant="outlined"
  onClick={() => setProductDialogOpen(true)}
  startIcon={<SearchIcon />}
>
  Buscar Producto
</Button>

<ProductsSearchDialog
  open={productDialogOpen}
  onClose={() => setProductDialogOpen(false)}
  onSelect={(product) => {
    setSelectedProduct(product)
    setProductDialogOpen(false)
  }}
/>
```

### Other Custom UI Components Available

```tsx
// Custom Autocomplete Components
import CustomerTypeAutocomplete from 'src/views/ui/customerTypeAutocomplete'
import PaymentTypeAutoComplete from 'src/views/ui/paymentTypeAutoComplete'
import ProductsAutoComplete from 'src/views/ui/productsAutoComplete'

// Utility Components
import LoadingWrapper from 'src/views/ui/LoadingWrapper'
import PermissionGuard from 'src/views/ui/permissionGuard'
import InputLabelTooltip from 'src/views/ui/inputLabelTooltip'

// Custom Input Components
import CustomInput from 'src/views/ui/customInput'
import CustomAutocomplete from 'src/views/ui/customAutocomplete'
```

## Material-UI Best Practices

### 1. Mobile-First Design (CRITICAL REQUIREMENT)

Always design for mobile first, then enhance for larger screens. Use responsive breakpoints effectively:

```tsx
// Use MUI breakpoints for responsive design
<Grid container spacing={{ xs: 2, sm: 3 }}>
  <Grid item xs={12} sm={6} lg={3}>
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{
          fontSize: { xs: '1rem', sm: '1.25rem' }
        }}>
          Title
        </Typography>
      </CardContent>
    </Card>
  </Grid>
</Grid>

// Mobile-first spacing and sizing
<Box sx={{
  p: { xs: 2, sm: 3, md: 4 },
  mt: { xs: 1, sm: 2 },
}}>
  Content
</Box>

// Mobile-optimized buttons
<Button
  fullWidth
  variant="contained"
  size="large"
  sx={{
    minHeight: { xs: 48, sm: 'auto' },
    fontSize: { xs: '1rem', sm: '0.875rem' },
    mb: { xs: 2, sm: 1 },
    height: { xs: 44, sm: 'auto' }
  }}
>
  Action Button
</Button>
```

### 2. Desktop vs Mobile Views

For list views, implement both table (desktop) and card (mobile) layouts:

````tsx
// Desktop Table View
<Hidden mdDown>
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Column 1</TableCell>
          <TableCell>Column 2</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id} hover>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.value}</TableCell>
            <TableCell align="right">
              <IconButton size="small">
                <Icon icon="mdi:eye-outline" />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Hidden>

// Mobile Card View
<Hidden mdUp>
  <Grid container spacing={2}>
    {data.map((item) => (
      <Grid item xs={12} key={item.id}>
        <ItemCard item={item} />
      </Grid>
    ))}
  </Grid>
</Hidden>
```### 2. Core Components from @core (Materio Template)

Leverage existing core components from the Materio template:

```tsx
// Use core layouts (handled automatically - do NOT add getLayout)
// Layout is automatically applied by the application

// Use core theme utilities
import { useTheme } from '@mui/material/styles'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// Use core components
import CustomChip from 'src/@core/components/mui/chip'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
````

### 3. Consistent Styling Patterns

```tsx
// Use sx prop for styling
<Card sx={{
  boxShadow: theme => theme.shadows[6],
  borderRadius: 2,
  '&:hover': {
    boxShadow: theme => theme.shadows[12],
  }
}}>

// Use styled components for complex styling
import { styled } from '@mui/material/styles'

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[6],
  transition: theme.transitions.create(['box-shadow', 'transform']),
  '&:hover': {
    boxShadow: theme.shadows[12],
    transform: 'translateY(-2px)',
  },
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(1),
    borderRadius: theme.spacing(1),
  }
}))
```

## API Integration Guidelines

### 1. Use restClient

Always use the configured `restClient` instead of axios directly:

```typescript
// ✅ Correct
import restClient from 'src/configs/restClient'

const response = await restClient.get('/api/portal/Module/data', { params })
const result = await restClient.post('/api/portal/Module/create', request)

// ❌ Avoid
import axios from 'axios'
```

### 2. API Endpoint Convention

All endpoints should follow this pattern:

```
/api/portal/[ModuleName]/[action]
```

Examples:

- `/api/portal/Cxc/list`
- `/api/portal/Inventory/products`
- `/api/portal/Sales/create`

### 3. Error Handling Pattern

```typescript
// In Redux async thunks
export const fetchData = createAsyncThunk(
  'module/fetchData',
  async (params: RequestParams, { rejectWithValue }) => {
    try {
      const response = await restClient.get('/api/portal/Module/data', {
        params,
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching data',
      )
    }
  },
)

// In components
const [error, setError] = useState<string | null>(null)
const [loading, setLoading] = useState(false)

const handleAction = async () => {
  setLoading(true)
  setError(null)

  try {
    await dispatch(fetchData(params)).unwrap()
  } catch (err) {
    setError(err as string)
  } finally {
    setLoading(false)
  }
}
```

## Import Organization

Always organize imports in this order:

```typescript
// ** React Imports
import { useState, useEffect } from 'react'
import type { ReactElement } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'
import Link from 'next/link'

// ** MUI Imports
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  IconButton,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

// ** Third Party Imports
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Type Imports
import { ModuleType } from 'src/types/apps/moduleTypes'

// ** Custom Component Imports
import SellerAutoComplete from 'src/views/ui/sellerAutoComplete'
import CustomerSearchDialog from 'src/views/ui/customerSearchDialog'
import LocationAutoComplete from 'src/views/ui/locationAutoComplete'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'

// ** Store Imports
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchModuleData } from 'src/store/apps/module'

// ** Utils Imports
import { formatCurrency } from 'src/utils/formatCurrency'
import { formatDate } from 'src/utils/formatDate'
```

## Form Handling Best Practices

### 1. React Hook Form with Yup Validation

```tsx
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
})

const MyForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await dispatch(createItem(data)).unwrap()
      reset()
    } catch (error) {
      // Handle error
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Name"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </form>
  )
}
```

### 2. Mobile-Optimized Form Layout

```tsx
<Grid container spacing={{ xs: 2, sm: 3 }}>
  <Grid item xs={12} sm={6}>
    <TextField fullWidth label="Field 1" />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField fullWidth label="Field 2" />
  </Grid>
  <Grid item xs={12}>
    <Button
      fullWidth
      variant="contained"
      size="large"
      sx={{
        minHeight: { xs: 48, sm: 'auto' },
        fontSize: { xs: '1rem', sm: '0.875rem' },
      }}
    >
      Submit
    </Button>
  </Grid>
</Grid>
```

## Firebase Integration

When working with Firebase:

```typescript
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

const handleFirebaseAction = async () => {
  setLoading(true)
  setError(null)

  try {
    const result = await firebaseFunction()
    // Handle success
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred')
  } finally {
    setLoading(false)
  }
}
```

## Performance Optimization

### 1. Component Optimization

```tsx
// Use React.memo for expensive components
import { memo } from 'react'

const ExpensiveComponent = memo(({ data }: Props) => {
  return <ComplexRenderLogic data={data} />
})

// Use useMemo for expensive calculations
const processedData = useMemo(() => {
  return data.map((item) => expensiveTransformation(item))
}, [data])

// Use useCallback for stable function references
const handleClick = useCallback(
  (id: string) => {
    dispatch(selectItem(id))
  },
  [dispatch],
)
```

### 2. Lazy Loading

```tsx
// Lazy load heavy components
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <CircularProgress />,
  ssr: false,
})
```

## Common Patterns

### 1. List View with Filters (Mobile-Optimized)

```tsx
const [filters, setFilters] = useState<ModuleFilters>({
  search: '',
  vendedorId: '',
  localidadId: undefined,
  distribuidorId: '',
  pageNumber: 1,
  pageSize: 20,
})

// Mobile-optimized filter layout with lg breakpoint for 4 columns
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} lg={3}>
    <SellerAutoComplete
      value={filters.vendedorId}
      onChange={(value) => setFilters({...filters, vendedorId: value})}
      fullWidth
    />
  </Grid>
  <Grid item xs={12} sm={6} lg={3}>
    <LocationAutoComplete
      value={filters.localidadId}
      onChange={(value) => setFilters({...filters, localidadId: value})}
      fullWidth
    />
  </Grid>
</Grid>

// Desktop Table + Mobile Cards Pattern
<Hidden mdDown>
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Column</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id} hover sx={{ cursor: 'pointer' }}>
            <TableCell>{item.name}</TableCell>
            <TableCell align="right">
              <IconButton size="small">
                <Icon icon="mdi:eye-outline" />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Hidden>

<Hidden mdUp>
  <Grid container spacing={2}>
    {data.map((item) => (
      <Grid item xs={12} key={item.id}>
        <MobileCard item={item} />
      </Grid>
    ))}
  </Grid>
</Hidden>
```

### 2. Modal Pattern (Mobile-Responsive)

```tsx
const [modalOpen, setModalOpen] = useState(false)
const [selectedItem, setSelectedItem] = useState<ModuleItem | null>(null)

<Dialog
  open={modalOpen}
  onClose={handleClose}
  fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
  maxWidth="md"
  fullWidth
>
  <DialogContent>
    {/* Modal content */}
  </DialogContent>
</Dialog>
```

### 3. Loading States

```tsx
// Global loading from Redux
const { loading } = useAppSelector((state) => state.module)

return (
  <Card>
    {loading && <LinearProgress />}
    <CardContent>{/* Content */}</CardContent>
  </Card>
)
```

## Best Practices

### Performance

- Use `React.memo` for expensive components
- Implement proper loading states
- Use `useMemo` and `useCallback` when appropriate
- Lazy load heavy components with `dynamic` imports

### Accessibility

- Always provide proper ARIA labels
- Use semantic HTML elements
- Ensure keyboard navigation works
- Test with screen readers

### Error Handling

- Implement error boundaries
- Show user-friendly error messages
- Log errors for debugging
- Provide fallback UI states

### Testing

- Write unit tests for utility functions
- Test component rendering and interactions
- Mock external dependencies
- Aim for meaningful test coverage
