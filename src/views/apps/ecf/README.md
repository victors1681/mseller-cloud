# ECF (Electronic Invoice Configuration) Implementation

## Overview

This implementation provides a complete CRUD interface for managing Electronic Invoice Configuration (Configuración de Facturación Electrónica) following the same patterns used in the sellers module.

## Files Created

### 1. **Store Implementation**

- **Path**: `src/store/apps/ecf/index.ts`
- **Description**: Redux store with async thunks for all ECF operations
- **Features**:
  - Fetch ECF configurations
  - Add/Update/Delete configurations
  - Test connection functionality
  - Transform documents
  - Loading states and error handling

### 2. **Type Definitions**

- **Path**: `src/types/apps/ecfType.ts`
- **Description**: TypeScript interfaces for ECF data structures
- **Types**:
  - `ECFType`: Main configuration interface
  - `ECFTestConnectionResponse`: Connection test response
  - `ECFTransformDocumentRequest/Response`: Document transformation types

### 3. **UI Components**

#### Main List Page

- **Path**: `src/pages/apps/ecf/list/index.tsx`
- **Features**:
  - DataGrid with pagination
  - Search functionality
  - CRUD operations (Edit, Delete)
  - Transform document functionality
  - Status indicators (Active/Inactive)

#### Table Header

- **Path**: `src/views/apps/ecf/list/TableHeader.tsx`
- **Features**:
  - Search input
  - "Create Configuration" button

#### Add/Edit Drawer

- **Path**: `src/views/apps/ecf/AddECFDrawer.tsx`
- **Features**:
  - Form validation with Yup
  - All ECF fields (ambiente, urlBase, usuario, clave, claveApi, businessId, habilitado)
  - Test connection functionality
  - Loading states

#### Transform Document Dialog

- **Path**: `src/views/apps/ecf/TransformDocumentDialog.tsx`
- **Features**:
  - Modal dialog for document transformation
  - Input for document number
  - Result display with success/error handling

### 4. **Navigation**

- **Path**: `src/navigation/vertical/index.ts`
- **Addition**: Added "Config. ECF" menu item under "Data Maestra" section

## API Endpoints Supported

1. **GET** `/api/portal/ConfiguracionFacturacionElectronica` - Fetch configurations
2. **POST** `/api/portal/ConfiguracionFacturacionElectronica` - Create configuration
3. **PUT** `/api/portal/ConfiguracionFacturacionElectronica` - Update configuration
4. **DELETE** `/api/portal/ConfiguracionFacturacionElectronica` - Delete configuration
5. **POST** `/api/portal/ConfiguracionFacturacionElectronica/probar-conexion` - Test connection
6. **POST** `/api/portal/ConfiguracionFacturacionElectronica/transformar-documento` - Transform document

## Features

### Core Functionality

- ✅ **CRUD Operations**: Create, Read, Update, Delete ECF configurations
- ✅ **Search & Filter**: Search by ambiente, usuario, or business ID
- ✅ **Pagination**: Server-side pagination support
- ✅ **Validation**: Form validation using Yup schema
- ✅ **Loading States**: Proper loading indicators for all operations

### Advanced Features

- ✅ **Test Connection**: Test connection without parameters
- ✅ **Transform Document**: Transform documents using document number
- ✅ **Status Management**: Enable/Disable configurations
- ✅ **Toast Notifications**: Success/Error feedback
- ✅ **Error Handling**: Comprehensive error handling with user feedback

### UI/UX Features

- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Material-UI Components**: Consistent with app design
- ✅ **Icons & Visual Indicators**: Clear action buttons and status chips
- ✅ **Confirmation Dialogs**: Delete confirmation
- ✅ **Form Drawer**: Side drawer for add/edit operations
- ✅ **Modal Dialogs**: Transform document dialog

## Usage

### Navigation

Access the ECF configuration through:
**Data Maestra > Config. ECF**

### Operations

1. **View Configurations**: The list shows all ECF integrations with status
2. **Create New**: Click "Crear Integración ECF" button
3. **Edit**: Click edit icon on any row
4. **Delete**: Click delete icon (with confirmation)
5. **Test Connection**: Use "Probar Conexión" button in the drawer
6. **Transform Document**: Click document icon and enter document number

### Form Fields

- **Ambiente**: Environment (Production, Testing, etc.)
- **URL Base**: Base URL for the service
- **Usuario**: Username for authentication
- **Clave**: Password (hidden input)
- **Clave API**: API Key (hidden input)
- **Business ID**: Business identifier
- **Habilitado**: Enable/Disable toggle

## Store Integration

The ECF store is properly integrated into the main Redux store and follows the same patterns as other modules:

```typescript
// Usage in components
const store = useSelector((state: RootState) => state.ecf)
dispatch(fetchECFConfiguration())
dispatch(addECFConfiguration(data))
dispatch(updateECFConfiguration(data))
dispatch(deleteECFConfiguration(id))
dispatch(testECFConnection())
dispatch(transformDocument({ noDocumento }))
```

## State Management

The store maintains:

- Configuration data and pagination info
- Loading states for all operations
- Form drawer open/close state
- Edit data for the drawer
- Connection test results
- Document transformation results

This implementation provides a complete, production-ready interface for ECF management that follows the established patterns in the application.
