# CXC Module - Frontend API Integration Guide

## Overview

This document provides essential guidance for frontend developers building user interfaces for the CXC (Cuentas por Cobrar / Accounts Receivable) system. It focuses on API endpoints, data structures, business rules, and UI considerations without framework-specific implementation details.

**Base URL**: `/api/cxc`
**Authentication**: Required - Bearer token (JWT)
**Content-Type**: `application/json`

---

## Table of Contents

1. [Data Models & Type Definitions](#data-models--type-definitions)
2. [API Endpoints Reference](#api-endpoints-reference)
3. [Business Rules & Validation](#business-rules--validation)
4. [UI Design Considerations](#ui-design-considerations)
5. [Error Handling](#error-handling)
6. [Best Practices](#best-practices)
7. [Integration Workflow Summary](#integration-workflow-summary)

---

## Data Models & Type Definitions

### Core Types

```typescript
// ============================================
// Enums
// ============================================

export enum EstadoCxc {
  Pendiente = "Pendiente",
  PagoParcial = "PagoParcial",
  Pagado = "Pagado",
  Vencido = "Vencido",
  Anulado = "Anulado",
}

export enum TipoMovimientoCxc {
  Pago = "Pago",
  NotaCredito = "NotaCredito",
  Devolucion = "Devolucion",
  AjustePositivo = "AjustePositivo",
  AjusteNegativo = "AjusteNegativo",
}

export enum TipoDocumento {
  Invoice = "invoice",
  CreditNote = "creditNote",
  DebitNote = "debitNote",
}

// ============================================
// CXC Entities
// ============================================

export interface CuentaCxc {
  id: number;
  numeroCxc: string;
  numeroDocumento: string;
  secuenciaDocumento: string | null;
  tipoDocumento: TipoDocumento;
  codigoCliente: string;
  fechaEmision: string; // ISO 8601 date string
  fechaVencimiento: string; // ISO 8601 date string
  montoTotal: number;
  montoAbonado: number;
  saldoPendiente: number;
  estado: EstadoCxc;
  condicionPago: string | null;
  diasCredito: number;
  localidadId: number;
  businessId: string | null;
  fechaCreacion: string; // ISO 8601 date string
  creadoPor: string | null;

  // Navigation properties (may be null if not included)
  cliente?: Cliente;
  localidad?: Localidad;
  condicion?: CondicionPago;
  movimientos?: MovimientoCxc[];

  // Calculated properties
  estaVencido: boolean;
  diasVencimiento: number;
  porcentajePagado: number;
}

export interface MovimientoCxc {
  id: number;
  cuentasPorCobrarId: number;
  tipoMovimiento: TipoMovimientoCxc;
  numeroMovimiento: string;
  fechaMovimiento: string; // ISO 8601 date string
  monto: number;
  numeroReferencia: string | null;
  observaciones: string | null;
  businessId: string | null;
  usuarioCreacion: string;
  fechaCreacion: string; // ISO 8601 date string

  // Navigation properties
  cuentasPorCobrar?: CuentaCxc;

  // Calculated properties
  tipoMovimientoDescripcion: string;
}

export interface Cliente {
  codigo: string;
  nombre: string;
  // ... other client properties
}

export interface Localidad {
  id: number;
  nombre: string;
  // ... other location properties
}

export interface CondicionPago {
  condicionPago: string;
  descripcion: string;
  dias: number;
  // ... other properties
}

// ============================================
// Pagination
// ============================================

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationParams {
  pageNumber?: number; // Default: 1
  pageSize?: number; // Default: 20, Max: 100
}

// ============================================
// Reports
// ============================================

export interface ReporteCxc {
  fechaInicio: string; // ISO 8601 date string
  fechaFin: string; // ISO 8601 date string
  totalDocumentos: number;
  montoTotalFacturado: number;
  montoTotalCobrado: number;
  saldoPendienteTotal: number;
  documentosVencidos: number;
  montoVencido: number;
  cxcPorCliente: CxcPorCliente[];
  cxcPorEstado: CxcPorEstado[];
  cxcVencidas: CxcVencida[];
}

export interface CxcPorCliente {
  codigoCliente: string;
  nombreCliente: string;
  cantidadDocumentos: number;
  montoTotal: number;
  saldoPendiente: number;
  diasPromedioVencimiento: number;
}

export interface CxcPorEstado {
  estado: string;
  cantidad: number;
  montoTotal: number;
  porcentaje: number;
}

export interface CxcVencida {
  numeroCxc: string;
  numeroDocumento: string;
  codigoCliente: string;
  nombreCliente: string;
  fechaVencimiento: string; // ISO 8601 date string
  diasVencimiento: number;
  saldoPendiente: number;
}

// ============================================
// Request/Response Types
// ============================================

export interface PagoRequest {
  monto: number;
  numeroReferencia?: string;
}

export interface NotaCreditoRequest {
  monto: number;
  motivo?: string;
}

export interface DevolucionRequest {
  productos: DevolucionDetalle[];
}

export interface DevolucionDetalle {
  codigoProducto: string;
  cantidad: number;
  motivoDevolucion?: string;

  // Optional - calculated automatically if not provided
  precioUnitario?: number;
  descuentoUnitario?: number;
  porcentajeDescuento?: number;
  impuestoUnitario?: number;
  porcentajeImpuesto?: number;
  tipoImpuesto?: string;
}

export interface CalcularDevolucionRequest {
  numeroDocumento: string;
  productos: ProductoDevolucionSimple[];
}

export interface ProductoDevolucionSimple {
  codigoProducto: string;
  cantidad: number;
}

export interface DevolucionResponse {
  movimiento: MovimientoCxc;
  detalleCalculos: DevolucionCalculoDetalle[];
  resumenFiscal: ResumenFiscal;
}

export interface DevolucionCalculoDetalle {
  codigoProducto: string;
  cantidad: number;
  precioUnitario: number;
  baseGravable: number;
  totalDescuento: number;
  totalImpuesto: number;
  montoFinal: number;
  detalleCalculo: DevolucionCalculo;
}

export interface DevolucionCalculo {
  codigoProducto: string;
  cantidad: number;
  precioUnitario: number;
  subTotalBruto: number;
  descuentoTotal: number;
  baseGravable: number;
  impuestoTotal: number;
  montoFinal: number;
}

export interface ResumenFiscal {
  montoTotal: number;
  totalBaseGravable: number;
  totalDescuentos: number;
  totalImpuestos: number;
}

// ============================================
// Error Response
// ============================================

export interface ApiError {
  message: string;
}
```

---

## API Endpoints Reference

### 1. Get CXC by Client (All Records)

**Endpoint**: `GET /api/cxc/cliente/{codigoCliente}`
**Auth**: Required
**Use Case**: Get all CXC records for a specific client (small datasets only)

**Request**:

```typescript
GET /api/cxc/cliente/CLI001
Authorization: Bearer {token}
```

**Response**: `200 OK`

```json
[
  {
    "id": 1,
    "numeroCxc": "CXC-00000001",
    "numeroDocumento": "INV-2024-001",
    "secuenciaDocumento": "B0100000001",
    "codigoCliente": "CLI001",
    "fechaEmision": "2024-01-15T00:00:00Z",
    "fechaVencimiento": "2024-02-14T00:00:00Z",
    "montoTotal": 15000.0,
    "montoAbonado": 5000.0,
    "saldoPendiente": 10000.0,
    "estado": "PagoParcial",
    "diasCredito": 30,
    "estaVencido": false,
    "diasVencimiento": 0,
    "porcentajePagado": 33.33,
    "cliente": {
      "codigo": "CLI001",
      "nombre": "Empresa ABC S.A."
    }
  }
]
```

---

### 2. Get CXC by Client (Paginated) ⭐ **Recommended**

**Endpoint**: `GET /api/cxc/cliente/{codigoCliente}/paginado`
**Auth**: Required
**Use Case**: Get paginated CXC records for a client (large datasets)

**Query Parameters**:

- `pageNumber` (optional): Page number, default: 1
- `pageSize` (optional): Items per page, default: 20, max: 100

**Request**:

```typescript
GET /api/cxc/cliente/CLI001/paginado?pageNumber=1&pageSize=20
Authorization: Bearer {token}
```

**Response**: `200 OK`

```json
{
  "items": [
    {
      "id": 1,
      "numeroCxc": "CXC-00000001",
      "numeroDocumento": "INV-2024-001",
      "codigoCliente": "CLI001",
      "montoTotal": 15000.0,
      "saldoPendiente": 10000.0,
      "estado": "PagoParcial"
    }
  ],
  "pageNumber": 1,
  "pageSize": 20,
  "totalCount": 150,
  "totalPages": 8,
  "hasPreviousPage": false,
  "hasNextPage": true
}
```

---

### 3. Get CXC by Number

**Endpoint**: `GET /api/cxc/numero/{numeroCxc}`
**Auth**: Required
**Use Case**: Get a specific CXC by its internal number

**Request**:

```typescript
GET /api/cxc/numero/CXC-00000001
Authorization: Bearer {token}
```

**Response**: `200 OK`

```json
{
  "id": 1,
  "numeroCxc": "CXC-00000001",
  "numeroDocumento": "INV-2024-001",
  "codigoCliente": "CLI001",
  "montoTotal": 15000.0,
  "saldoPendiente": 10000.0,
  "movimientos": [
    {
      "id": 1,
      "numeroMovimiento": "PAG-00000001",
      "tipoMovimiento": "Pago",
      "monto": 5000.0,
      "fechaMovimiento": "2024-01-20T10:30:00Z",
      "numeroReferencia": "REF-12345"
    }
  ]
}
```

**Error**: `404 Not Found`

```json
{
  "message": "CXC no encontrada"
}
```

---

### 4. Get CXC by Document Number

**Endpoint**: `GET /api/cxc/documento/{numeroDocumento}`
**Auth**: Required
**Use Case**: Get CXC by invoice/document number

**Request**:

```typescript
GET /api/cxc/documento/INV-2024-001
Authorization: Bearer {token}
```

**Response**: Same as "Get CXC by Number"

---

### 5. Get Overdue CXCs (All Records)

**Endpoint**: `GET /api/cxc/vencidas`
**Auth**: Required
**Use Case**: Get all overdue CXC records (small datasets only)

**Request**:

```typescript
GET /api/cxc/vencidas
Authorization: Bearer {token}
```

**Response**: `200 OK`

```json
[
  {
    "id": 5,
    "numeroCxc": "CXC-00000005",
    "codigoCliente": "CLI002",
    "fechaVencimiento": "2024-01-01T00:00:00Z",
    "saldoPendiente": 5000.0,
    "diasVencimiento": 45,
    "estaVencido": true
  }
]
```

---

### 6. Get Overdue CXCs (Paginated) ⭐ **Recommended**

**Endpoint**: `GET /api/cxc/vencidas/paginado`
**Auth**: Required
**Use Case**: Get paginated overdue CXC records

**Query Parameters**:

- `pageNumber` (optional): Page number, default: 1
- `pageSize` (optional): Items per page, default: 20, max: 100

**Request**:

```typescript
GET /api/cxc/vencidas/paginado?pageNumber=1&pageSize=20
Authorization: Bearer {token}
```

**Response**: Same format as paginated client CXC response

---

### 7. Register Payment

**Endpoint**: `POST /api/cxc/{cxcId}/pago`
**Auth**: Required
**Use Case**: Record a payment against a CXC

**Request**:

```typescript
POST /api/cxc/1/pago
Authorization: Bearer {token}
Content-Type: application/json

{
  "monto": 5000.00,
  "numeroReferencia": "REF-12345"
}
```

**Response**: `200 OK`

```json
{
  "id": 10,
  "cuentasPorCobrarId": 1,
  "tipoMovimiento": "Pago",
  "numeroMovimiento": "PAG-00000010",
  "fechaMovimiento": "2024-02-15T14:30:00Z",
  "monto": 5000.0,
  "numeroReferencia": "REF-12345",
  "observaciones": "Pago registrado por Juan Perez",
  "usuarioCreacion": "Juan Perez"
}
```

**Validation Errors**: `400 Bad Request`

```json
{
  "message": "El monto del pago debe ser mayor a 0 y no exceder el saldo pendiente"
}
```

---

### 8. Create Credit Note

**Endpoint**: `POST /api/cxc/{cxcId}/nota-credito`
**Auth**: Required
**Use Case**: Create a credit note to reduce CXC balance

**Request**:

```typescript
POST /api/cxc/1/nota-credito
Authorization: Bearer {token}
Content-Type: application/json

{
  "monto": 1000.00,
  "motivo": "Ajuste por error de facturación"
}
```

**Response**: `200 OK` - Same format as payment response

---

### 9. Process Return/Devolution

**Endpoint**: `POST /api/cxc/{cxcId}/devolucion`
**Auth**: Required
**Use Case**: Process product returns with automatic tax/discount calculations

**Request**:

```typescript
POST /api/cxc/1/devolucion
Authorization: Bearer {token}
Content-Type: application/json

{
  "productos": [
    {
      "codigoProducto": "PROD001",
      "cantidad": 5,
      "motivoDevolucion": "Producto defectuoso"
    },
    {
      "codigoProducto": "PROD002",
      "cantidad": 2,
      "motivoDevolucion": "Error en el pedido"
    }
  ]
}
```

**Response**: `200 OK`

```json
{
  "movimiento": {
    "id": 15,
    "numeroMovimiento": "DEV-00000001",
    "tipoMovimiento": "Devolucion",
    "monto": 3250.5,
    "fechaMovimiento": "2024-02-15T16:00:00Z"
  },
  "detalleCalculos": [
    {
      "codigoProducto": "PROD001",
      "cantidad": 5,
      "precioUnitario": 500.0,
      "baseGravable": 2250.0,
      "totalDescuento": 250.0,
      "totalImpuesto": 405.0,
      "montoFinal": 2655.0,
      "detalleCalculo": {
        "codigoProducto": "PROD001",
        "cantidad": 5,
        "precioUnitario": 500.0,
        "subTotalBruto": 2500.0,
        "descuentoTotal": 250.0,
        "baseGravable": 2250.0,
        "impuestoTotal": 405.0,
        "montoFinal": 2655.0
      }
    }
  ],
  "resumenFiscal": {
    "montoTotal": 3250.5,
    "totalBaseGravable": 2920.0,
    "totalDescuentos": 330.0,
    "totalImpuestos": 525.6
  }
}
```

**Validation Errors**: `400 Bad Request`

```json
{
  "message": "El producto PROD001 no existe en el documento INV-2024-001"
}
```

---

### 10. Calculate Return (Preview)

**Endpoint**: `POST /api/cxc/calcular-devolucion`
**Auth**: Required
**Use Case**: Calculate return amounts before processing (preview mode)

**Request**:

```typescript
POST /api/cxc/calcular-devolucion
Authorization: Bearer {token}
Content-Type: application/json

{
  "numeroDocumento": "INV-2024-001",
  "productos": [
    {
      "codigoProducto": "PROD001",
      "cantidad": 5
    }
  ]
}
```

**Response**: `200 OK` - Same format as devolution response (without creating movement)

---

### 11. Generate CXC Report

**Endpoint**: `GET /api/cxc/reporte`
**Auth**: Required
**Use Case**: Generate comprehensive CXC report for a date range

**Query Parameters**:

- `fechaInicio` (required): Start date (ISO 8601 format)
- `fechaFin` (required): End date (ISO 8601 format)

**Request**:

```typescript
GET /api/cxc/reporte?fechaInicio=2024-01-01&fechaFin=2024-01-31
Authorization: Bearer {token}
```

**Response**: `200 OK`

```json
{
  "fechaInicio": "2024-01-01T00:00:00Z",
  "fechaFin": "2024-01-31T00:00:00Z",
  "totalDocumentos": 150,
  "montoTotalFacturado": 500000.0,
  "montoTotalCobrado": 350000.0,
  "saldoPendienteTotal": 150000.0,
  "documentosVencidos": 25,
  "montoVencido": 75000.0,
  "cxcPorCliente": [
    {
      "codigoCliente": "CLI001",
      "nombreCliente": "Empresa ABC S.A.",
      "cantidadDocumentos": 10,
      "montoTotal": 50000.0,
      "saldoPendiente": 15000.0,
      "diasPromedioVencimiento": 5
    }
  ],
  "cxcPorEstado": [
    {
      "estado": "Pendiente",
      "cantidad": 80,
      "montoTotal": 200000.0,
      "porcentaje": 53.33
    },
    {
      "estado": "Pagado",
      "cantidad": 70,
      "montoTotal": 300000.0,
      "porcentaje": 46.67
    }
  ],
  "cxcVencidas": [
    {
      "numeroCxc": "CXC-00000005",
      "numeroDocumento": "INV-2023-999",
      "codigoCliente": "CLI002",
      "nombreCliente": "Cliente XYZ",
      "fechaVencimiento": "2023-12-15T00:00:00Z",
      "diasVencimiento": 45,
      "saldoPendiente": 5000.0
    }
  ]
}
```

**Validation Errors**: `400 Bad Request`

```json
{
  "message": "La fecha de inicio debe ser menor que la fecha de fin"
}
```

---

### 12. Update CXC Status

**Endpoint**: `PUT /api/cxc/{cxcId}/actualizar-estado`
**Auth**: Required
**Use Case**: Manually recalculate and update CXC status

**Request**:

```typescript
PUT /api/cxc/1/actualizar-estado
Authorization: Bearer {token}
```

**Response**: `200 OK` - Returns updated CXC object

**Error**: `404 Not Found`

```json
{
  "message": "CXC 999 no encontrada"
}
```

---

## Business Rules & Validation

### Payment Validation Rules

1. **Payment Amount Validation**:

   - Must be greater than 0
   - Cannot exceed the pending balance (`saldoPendiente`)
   - Cannot be applied to already paid CXCs (`estado === 'Pagado'`)

2. **CXC Status Rules**:

   - `Pendiente`: No payments made, full balance outstanding
   - `PagoParcial`: Some payments made, partial balance remaining
   - `Pagado`: Fully paid, no outstanding balance
   - `Vencido`: Past due date with outstanding balance
   - `Anulado`: Cancelled/voided, cannot accept payments

3. **Overdue Calculation**:
   - `estaVencido = true` when current date > `fechaVencimiento` and `saldoPendiente > 0`
   - `diasVencimiento` = days elapsed since `fechaVencimiento`

### Return/Devolution Rules

1. **Product Validation**:

   - Products must exist in the original invoice
   - Quantity cannot exceed originally invoiced quantity
   - Calculations include taxes and discounts automatically

2. **Automatic Calculations**:
   - Tax percentages applied from original invoice
   - Discount percentages maintained from original invoice
   - Net amounts calculated: `(price × quantity) - discounts + taxes`

### Credit Note Rules

1. **Amount Validation**:
   - Must be greater than 0
   - Cannot exceed the pending balance
   - Automatically reduces `saldoPendiente`

## UI Design Considerations

### Dashboard Widgets

**Client Balance Summary Widget**:

- Total outstanding balance per client
- Number of overdue invoices
- Average days overdue
- Payment trend indicators

**Overdue Alerts Widget**:

- Count of overdue invoices
- Total overdue amount
- Clients with highest overdue amounts
- Visual indicators (red badges for critical overdue)

### List Views & Tables

**CXC List Table Columns** (Priority Order):

1. **Status Badge** - Color-coded status indicator
2. **CXC Number** - Link to detail view
3. **Client Name** - Searchable/filterable
4. **Document Number** - Reference to original invoice
5. **Issue Date** / **Due Date** - Date formatting
6. **Total Amount** / **Pending Balance** - Currency formatting
7. **Days Overdue** - Highlighted if > 0
8. **Actions** - Payment, Credit Note, Return buttons

**Status Color Coding**:

- `Pendiente`: Yellow/Orange (⚠️)
- `PagoParcial`: Blue (ℹ️)
- `Pagado`: Green (✅)
- `Vencido`: Red (🚨)
- `Anulado`: Gray (❌)

### Form Designs

**Payment Form Requirements**:

- Amount input with currency formatting
- Reference number field (optional)
- Current balance display
- Remaining balance calculator
- Validation error display

**Return/Devolution Form Requirements**:

- Product selection (dropdown/autocomplete)
- Quantity selector with validation
- Return reason field
- Preview calculation display
- Tax/discount breakdown

**Credit Note Form Requirements**:

- Amount input with max value validation
- Reason/notes field
- Impact preview (new balance calculation)

### Filtering & Search Options

**Standard Filters**:

- Client selection (dropdown/autocomplete)
- Status filter (multi-select)
- Date ranges (issue date, due date)
- Amount ranges
- Overdue only toggle

**Advanced Filters**:

- Location/branch filter
- Document type filter
- Payment condition filter
- Created by user filter

### Pagination & Performance

**Recommended Page Sizes**:

- Desktop: 20-50 items per page
- Mobile: 10-20 items per page
- Always use paginated endpoints for lists

**Loading States**:

- Skeleton loading for tables
- Progressive loading for large datasets
- Search debouncing (300-500ms)

## Common Use Cases

### Use Case 1: Client Outstanding Balance Dashboard

**Endpoint**: `GET /api/cxc/cliente/{codigoCliente}/paginado`
**Purpose**: Display total outstanding balance for a specific client
**Calculation**: Sum of `saldoPendiente` for all non-paid CXCs
**UI Elements**: Balance card, progress indicator, payment history list

### Use Case 2: Overdue Invoices Management

**Endpoint**: `GET /api/cxc/vencidas/paginado`
**Purpose**: Manage overdue accounts receivable
**Key Data**: `diasVencimiento`, `saldoPendiente`, client contact info
**UI Elements**: Sortable table, bulk actions, contact client buttons

### Use Case 3: Payment Processing Workflow

**Endpoints**:

- `GET /api/cxc/numero/{numeroCxc}` (get details)
- `POST /api/cxc/{cxcId}/pago` (process payment)
  **Purpose**: Record customer payments against invoices
  **Validation**: Amount validation, balance updates
  **UI Flow**: Search CXC → Verify details → Enter payment → Confirm → Receipt

### Use Case 4: Return/Devolution Processing

**Endpoints**:

- `POST /api/cxc/calcular-devolucion` (preview)
- `POST /api/cxc/{cxcId}/devolucion` (process)
  **Purpose**: Handle product returns with tax/discount calculations
  **Workflow**: Select products → Preview calculation → Confirm → Process
  **UI Elements**: Product selector, quantity inputs, calculation preview

### Use Case 5: Monthly CXC Reporting

**Endpoint**: `GET /api/cxc/reporte`
**Purpose**: Generate comprehensive CXC reports for management
**Parameters**: Date range selection
**Data**: Aging reports, client summaries, collection metrics
**UI Elements**: Date pickers, export options, chart visualizations

---

## Error Handling

### Standard Error Response Format

All API errors return a consistent format:

```typescript
interface ApiError {
  message: string;
}
```

### HTTP Status Codes

| Status Code                 | Meaning               | When it Occurs                                |
| --------------------------- | --------------------- | --------------------------------------------- |
| `200 OK`                    | Success               | Request completed successfully                |
| `400 Bad Request`           | Validation Error      | Invalid input data or business rule violation |
| `401 Unauthorized`          | Authentication Failed | Missing or invalid Bearer token               |
| `404 Not Found`             | Resource Not Found    | CXC, client, or document doesn't exist        |
| `500 Internal Server Error` | Server Error          | Unexpected server-side error                  |

### Error Handling for UI

**User-Friendly Error Messages**:

- `400 Bad Request`: Show validation errors inline near form fields
- `401 Unauthorized`: Redirect to login page, show session expired message
- `404 Not Found`: Show "Record not found" with search/navigation options
- `500 Internal Server Error`: Show generic "System error" message with retry option

**Error Display Patterns**:

- **Form Validation**: Inline field errors with red text/border
- **API Failures**: Toast notifications or modal dialogs
- **Loading Failures**: Replace content with error message and retry button
- **Permission Errors**: Show access denied page with contact information

**Recommended Error Messages**:

- Payment validation: "Payment amount cannot exceed pending balance of $X,XXX.XX"
- CXC not found: "Invoice not found. Please verify the CXC number."
- Insufficient permissions: "You don't have permission to perform this action."
- Network errors: "Connection error. Please check your internet and try again."

---

## Best Practices

### 1. Always Use Pagination for Lists

**Performance**: Always use paginated endpoints (`/paginado`) for CXC lists to prevent loading large datasets that can slow down the UI.

**Recommended Page Sizes**:

- Desktop tables: 20-50 items
- Mobile lists: 10-20 items
- Never exceed 100 items per page

### 2. Data Caching Strategy

**Cache Duration Recommendations**:

- CXC lists: 5 minutes (data changes frequently with payments)
- Client information: 30 minutes (relatively static)
- Reports: 1 hour (expensive to generate)
- Master data (conditions, locations): 24 hours

**Cache Invalidation**: Clear cache after successful payments, credit notes, or returns.

### 3. Date and Time Formatting

**Date Display Standards**:

- All API dates are in ISO 8601 format (`2024-01-15T00:00:00Z`)
- Display dates in local format (e.g., "15 Ene 2024" for Spanish locales)
- Show relative dates for recent items ("hace 2 días", "ayer")
- Highlight overdue dates in red

**Date Input Requirements**:

- Use date pickers with proper validation
- Convert to ISO format for API calls
- Handle timezone differences appropriately

### 4. Currency and Number Formatting

**Currency Display**:

- Format using local currency standards (Dominican Peso: RD$)
- Show thousands separators: RD$15,000.00
- Align currency amounts to the right in tables
- Use consistent decimal places (2 digits)

**Number Formatting**:

- Days overdue: Whole numbers, no decimals
- Percentages: 1 decimal place (33.3%)
- Payment progress bars: Percentage-based width

### 5. Status Indicators and Colors

**Visual Status System**:

- `Pendiente`: 🟡 Yellow/Orange - Requires attention
- `PagoParcial`: 🔵 Blue - Progress made
- `Pagado`: 🟢 Green - Complete
- `Vencido`: 🔴 Red - Urgent action needed
- `Anulado`: ⚫ Gray - Inactive

**Status Display Options**:

- Badges with icons and text
- Colored table rows for quick scanning
- Progress bars for partial payments
- Sort by urgency (overdue first)

### 6. Form Validation and UX

**Input Validation**:

- Real-time validation for payment amounts
- Show remaining balance as user types
- Disable submit button until valid
- Clear error messages with corrective actions

**User Feedback**:

- Loading states during API calls
- Success confirmations with details
- Error messages with retry options
- Confirmation dialogs for destructive actions

### 7. Search and Filtering

**Search Implementation**:

- Debounce search input (300-500ms)
- Search across multiple fields (CXC number, document number, client name)
- Show search results count
- Clear search functionality

**Filter Options**:

- Predefined filter chips (Overdue, Paid Today, This Month)
- Date range pickers for flexible filtering
- Multi-select for status filtering
- Save commonly used filter combinations

### 8. Accessibility Considerations

**Screen Reader Support**:

- Proper ARIA labels for status indicators
- Table headers with scope attributes
- Form labels associated with inputs
- Loading state announcements

**Keyboard Navigation**:

- Tab order through forms and tables
- Enter key to submit forms
- Escape key to close modals
- Arrow keys for table navigation

### 9. Mobile Responsiveness

**Mobile-First Design**:

- Stack table columns vertically on small screens
- Use card layout for CXC items
- Touch-friendly button sizes (44px minimum)
- Swipe actions for common operations

**Progressive Enhancement**:

- Core functionality works without JavaScript
- Enhanced interactions with JavaScript
- Offline indicator when API unavailable
- Retry mechanisms for failed requests

---

## Integration Workflow Summary

### Key Implementation Steps

1. **Setup Authentication**: Implement Bearer token authentication for all API calls
2. **Implement Pagination**: Use paginated endpoints for all list views
3. **Error Handling**: Implement consistent error handling and user feedback
4. **Status Management**: Create visual status indicators with proper color coding
5. **Form Validation**: Implement client-side validation matching API business rules
6. **Data Formatting**: Implement proper date, currency, and number formatting
7. **Accessibility**: Ensure ARIA labels and keyboard navigation support
8. **Mobile Design**: Implement responsive design for mobile devices

### Critical UI Components Needed

**CXC Details View**:

- Header with CXC number and status badge
- General information panel (client, document, dates)
- Financial summary with progress visualization
- Payment history table
- Action buttons (Pay, Credit Note, Return)

**CXC List/Table View**:

- Searchable and filterable data table
- Pagination controls
- Status indicators and overdue alerts
- Bulk action capabilities
- Export functionality

**Payment Form Modal**:

- Amount input with balance validation
- Reference number field
- Balance calculator display
- Confirmation summary

**Return/Devolution Form**:

- Product selection interface
- Quantity inputs with validation
- Calculation preview
- Tax and discount breakdown

**Reports Dashboard**:

- Date range selectors
- Summary cards with key metrics
- Charts and visualizations
- Export capabilities

### Testing Checklist

- [ ] All API endpoints return expected data structures
- [ ] Pagination works correctly with large datasets
- [ ] Error messages display appropriately
- [ ] Currency and dates format correctly
- [ ] Status colors and indicators work properly
- [ ] Form validation prevents invalid submissions
- [ ] Mobile responsiveness functions on various screen sizes
- [ ] Accessibility features work with screen readers
- [ ] Loading states display during API calls
- [ ] Offline behavior is handled gracefully

---

## Related Documentation

- [cxc-performance-improvements.md](./cxc-performance-improvements.md) - Performance optimization guide
- [modulo-cxc-implementacion.md](./modulo-cxc-implementacion.md) - Backend implementation details
- [cxc-impuestos-descuentos.md](./cxc-impuestos-descuentos.md) - Tax and discount calculation logic

---

## Support

For API issues or questions:

1. Check this documentation first
2. Review error messages carefully
3. Verify authentication token is valid
4. Check network tab in browser DevTools
5. Contact backend team for API bugs

---

## Quick Reference Summary

### Most Important Endpoints for UI Development

1. **`GET /api/cxc/cliente/{codigoCliente}/paginado`** - Client CXC list (paginated)
2. **`GET /api/cxc/vencidas/paginado`** - Overdue CXCs (paginated)
3. **`GET /api/cxc/numero/{numeroCxc}`** - CXC details with movements
4. **`POST /api/cxc/{cxcId}/pago`** - Process payment
5. **`GET /api/cxc/reporte`** - Generate reports

### Key UI Data Points

- **Status Colors**: Pendiente (Yellow), PagoParcial (Blue), Pagado (Green), Vencido (Red), Anulado (Gray)
- **Financial Fields**: `montoTotal`, `montoAbonado`, `saldoPendiente`, `porcentajePagado`
- **Date Fields**: `fechaEmision`, `fechaVencimiento` (ISO 8601 format)
- **Calculated Fields**: `estaVencido`, `diasVencimiento`, `porcentajePagado`

### Critical Business Rules

- Payment amounts cannot exceed `saldoPendiente`
- Overdue = `fechaVencimiento` < today AND `saldoPendiente` > 0
- Always use paginated endpoints for performance
- All monetary amounts should be formatted as currency
- Status changes automatically based on payment activity

---

**Last Updated**: October 13, 2025
**API Version**: v1
**Document Focus**: UI Integration Guidelines
