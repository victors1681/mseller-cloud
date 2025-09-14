# MSeller Cloud - GitHub Copilot Instructions

## Code Generation Guidelines

### Material-UI Component Usage

When creating new components, always:

1. **Use Material-UI Components**: Prefer MUI components over HTML elements
2. **Apply Consistent Styling**: Use `sx` prop or `styled` components
3. **Follow Theme Variables**: Use theme colors, spacing, and breakpoints
4. **Implement Responsive Design**: Use MUI breakpoint system

Example component structure:

```tsx
import { Card, CardContent, Typography, Box } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[6],
}))

const MyComponent = () => {
  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" component="h2">
          Title
        </Typography>
        <Box sx={{ mt: 2 }}>Content</Box>
      </CardContent>
    </StyledCard>
  )
}
```

### Redux Integration

For state management:

1. **Create Typed Slices**: Always define TypeScript interfaces
2. **Use RTK Query**: For API data fetching when appropriate
3. **Follow Naming Conventions**: Use descriptive action names

Example slice structure:

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ModuleState {
  items: ModuleItem[]
  loading: boolean
  error: string | null
}

const moduleSlice = createSlice({
  name: 'module',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<ModuleItem[]>) => {
      state.items = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})
```

### Form Handling

Use React Hook Form with Yup validation:

```tsx
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email().required('Email is required'),
})

const MyForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    // Handle form submission
  }

  return <form onSubmit={handleSubmit(onSubmit)}>{/* Form fields */}</form>
}
```

### API Integration

When making API calls:

1. **Use restClient**: Always use the configured `restClient` instead of axios directly
2. **Include /api prefix**: All endpoints should start with `/api/portal/`
3. **Handle Errors**: Implement proper error handling with try/catch
4. **Type Responses**: Always type API responses

Example API integration in Redux slice:

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit'
import restClient from 'src/configs/restClient'

export const fetchData = createAsyncThunk(
  'module/fetchData',
  async (params: RequestParams) => {
    const response = await restClient.get('/api/portal/Module/data', { params })
    return response.data
  },
)

export const createItem = createAsyncThunk(
  'module/createItem',
  async (request: CreateItemRequest) => {
    const response = await restClient.post('/api/portal/Module/create', request)
    return response.data
  },
)
```

### Firebase Integration

When working with Firebase:

1. **Use Typed Functions**: Always type Firebase function responses
2. **Handle Errors**: Implement proper error handling
3. **Loading States**: Show loading indicators

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

### Page Structure

Follow this pattern for new pages:

```tsx
// pages/apps/[module]/[action]/index.tsx
import type { ReactElement } from 'react'
import BlankLayoutWithAppBar from 'src/@core/layouts/BlankLayoutWithAppBar'
import ModuleView from 'src/views/apps/[module]/ModuleView'

const ModulePage = () => {
  return <ModuleView />
}

ModulePage.getLayout = (page: ReactElement) => (
  <BlankLayoutWithAppBar>{page}</BlankLayoutWithAppBar>
)

export default ModulePage
```

## File Organization

### New Module Checklist

When adding a new module:

1. ✅ Create Redux slice in `store/apps/[module]/`
2. ✅ Define TypeScript types in `types/apps/[module]Types.ts`
3. ✅ Add pages in `pages/apps/[module]/`
4. ✅ Create view components in `views/apps/[module]/`
5. ✅ Update navigation in `navigation/vertical/index.ts`
6. ✅ Add to main store in `store/index.ts`

### Import Organization

Always organize imports in this order:

```typescript
// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import { Card, Typography, Box } from '@mui/material'

// ** Third Party Imports
import restClient from 'src/configs/restClient'

// ** Type Imports
import { ModuleType } from 'src/types/apps/moduleTypes'

// ** Component Imports
import CustomComponent from 'src/components/CustomComponent'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'

// ** Store Imports
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchModuleData } from 'src/store/apps/module'
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
