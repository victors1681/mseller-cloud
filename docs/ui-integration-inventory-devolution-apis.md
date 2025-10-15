# UI Integration Guide - Inventory Movement & Devolution APIs

## Overview

This document provides comprehensive interface definitions and integration guidance for consuming the Inventory Movement and Devolution APIs in frontend applications. It covers data models, request/response formats, error handling, and implementation patterns without framework-specific code.

## Base Configuration

### API Base URLs

```
Inventory APIs: /portal/Inventario
Devolution APIs: /portal/Devolucion
```

### Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

---

## 📦 Inventory Movement APIs

### 1. Get Product Movement History

**Endpoint**: `GET /portal/Inventario/producto/{codigoProducto}/movimientos`

**Purpose**: Retrieve paginated movement history for a specific product with filtering capabilities.

#### Request Parameters

| Parameter      | Type   | Required | Default | Description                   |
| -------------- | ------ | -------- | ------- | ----------------------------- |
| codigoProducto | string | ✅       | -       | Product code (path parameter) |
| pageNumber     | number | ❌       | 1       | Page number (1-based)         |
| pageSize       | number | ❌       | 20      | Items per page (max: 100)     |
| localidadId    | number | ❌       | -       | Filter by location ID         |
| tipoMovimiento | enum   | ❌       | -       | Filter by movement type       |
| desde          | string | ❌       | -       | Start date (ISO 8601 format)  |
| hasta          | string | ❌       | -       | End date (ISO 8601 format)    |

#### TipoMovimientoInventario Values

```typescript
enum TipoMovimientoInventario {
  Salida = 0, // Inventory exit (sales, consumption)
  Entrada = 1, // Inventory entry (purchases, production)
  Devolucion = 2, // Returns (customer/supplier returns)
  Ajuste = 3, // Adjustments (corrections, shrinkage)
}
```

#### Example Request

```http
GET /portal/Inventario/producto/PROD001/movimientos?pageNumber=1&pageSize=20&localidadId=5&tipoMovimiento=0&desde=2024-01-01T00:00:00Z&hasta=2024-12-31T23:59:59Z
```

#### Response Structure

```typescript
interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface MovimientoInventarioResponse {
  id: number;
  numeroDocumento: string;
  codigoProducto: string;
  localidadId: number;
  tipoMovimiento: TipoMovimientoInventario;
  tipoMovimientoDescripcion: string;
  cantidad: number;
  costoUnitario: number;
  valorTotal: number;
  fechaMovimiento: string; // ISO 8601 datetime
  usuarioCreacion: string;
  observaciones?: string;
  producto?: {
    codigo: string;
    descripcion: string;
    unidad: string;
    // ... other product properties
  };
  localidad?: {
    id: number;
    nombre: string;
    // ... other location properties
  };
}
```

#### Success Response Example

```json
{
  "items": [
    {
      "id": 12345,
      "numeroDocumento": "FAC-00001234",
      "codigoProducto": "PROD001",
      "localidadId": 5,
      "tipoMovimiento": 0,
      "tipoMovimientoDescripcion": "Salida",
      "cantidad": 10.0,
      "costoUnitario": 25.5,
      "valorTotal": 255.0,
      "fechaMovimiento": "2024-10-14T15:30:00Z",
      "usuarioCreacion": "vendedor1@empresa.com",
      "observaciones": "Venta regular",
      "producto": {
        "codigo": "PROD001",
        "descripcion": "Producto Ejemplo",
        "unidad": "UND"
      },
      "localidad": {
        "id": 5,
        "nombre": "Almacén Principal"
      }
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

### 2. Manual Inventory Adjustment

**Endpoint**: `POST /portal/Inventario/ajuste-manual`

**Purpose**: Perform manual inventory adjustments for stock corrections.

#### Request Structure

```typescript
interface AjusteInventarioRequest {
  codigoProducto: string; // Required: Product code
  localidadId: number; // Required: Location ID
  cantidadAjuste: number; // Required: Adjustment quantity (+ increase, - decrease)
  razonAjuste: string; // Required: Reason for adjustment
  numeroDocumento?: string; // Optional: Custom document number
  costoUnitario?: number; // Optional: Override unit cost
}
```

#### Example Request

```json
{
  "codigoProducto": "PROD001",
  "localidadId": 5,
  "cantidadAjuste": -5.0,
  "razonAjuste": "Productos dañados durante inventario",
  "numeroDocumento": "ADJ-2024-001",
  "costoUnitario": 25.5
}
```

#### Response Structure

```typescript
interface MovimientoInventarioResponse {
  id: number;
  numeroDocumento: string;
  codigoProducto: string;
  localidadId: number;
  tipoMovimiento: TipoMovimientoInventario;
  tipoMovimientoDescripcion: string;
  cantidad: number;
  costoUnitario: number;
  valorTotal: number;
  fechaMovimiento: string;
  usuarioCreacion: string;
  observaciones: string;
}
```

#### Success Response Example

```json
{
  "id": 12346,
  "numeroDocumento": "ADJ-2024-001",
  "codigoProducto": "PROD001",
  "localidadId": 5,
  "tipoMovimiento": 3,
  "tipoMovimientoDescripcion": "Ajuste",
  "cantidad": -5.0,
  "costoUnitario": 25.5,
  "valorTotal": -127.5,
  "fechaMovimiento": "2024-10-14T16:45:00Z",
  "usuarioCreacion": "admin@empresa.com",
  "observaciones": "Ajuste manual - Razón: Productos dañados durante inventario"
}
```

---

### 3. Get Location Adjustment History

**Endpoint**: `GET /portal/Inventario/localidad/{localidadId}/ajustes`

**Purpose**: Retrieve manual adjustment history for a specific location.

#### Request Parameters

| Parameter      | Type   | Required | Default | Description                  |
| -------------- | ------ | -------- | ------- | ---------------------------- |
| localidadId    | number | ✅       | -       | Location ID (path parameter) |
| codigoProducto | string | ❌       | -       | Filter by product code       |
| desde          | string | ❌       | -       | Start date (ISO 8601 format) |
| hasta          | string | ❌       | -       | End date (ISO 8601 format)   |
| limit          | number | ❌       | 50      | Maximum results to return    |

#### Example Request

```http
GET /portal/Inventario/localidad/5/ajustes?codigoProducto=PROD001&desde=2024-01-01T00:00:00Z&limit=100
```

#### Response Structure

```typescript
interface MovimientoInventarioResponse[] // Array of movements
```

---

### 4. Transfer Stock Between Locations

**Endpoint**: `POST /portal/Inventario/transferir-stock`

**Purpose**: Transfer stock of a product between two locations with automatic stock updates.

#### Request Structure

```typescript
interface TransferirStockRequest {
  codigoProducto: string; // Required: Product code
  localidadOrigenId: number; // Required: Source location ID
  localidadDestinoId: number; // Required: Destination location ID
  cantidad: number; // Required: Quantity to transfer
  observaciones?: string; // Optional: Transfer notes/comments
}
```

#### Example Request

```json
{
  "codigoProducto": "PROD001",
  "localidadOrigenId": 5,
  "localidadDestinoId": 8,
  "cantidad": 15.0,
  "observaciones": "Transferencia para reposición de inventario"
}
```

#### Response Structure

```typescript
interface TransferenciaStockResponse {
  codigoProducto: string;
  numeroTransferencia: string;
  localidadOrigenId: number;
  localidadOrigenNombre: string;
  localidadDestinoId: number;
  localidadDestinoNombre: string;
  cantidad: number;
  stockOrigenAntes: number;
  stockOrigenDespues: number;
  stockDestinoAntes: number;
  stockDestinoDespues: number;
  fechaTransferencia: string; // ISO 8601 datetime
  usuario: string;
  observaciones?: string;
}
```

#### Success Response Example

```json
{
  "codigoProducto": "PROD001",
  "numeroTransferencia": "TRF-20241014-001",
  "localidadOrigenId": 5,
  "localidadOrigenNombre": "Almacén Principal",
  "localidadDestinoId": 8,
  "localidadDestinoNombre": "Tienda Centro",
  "cantidad": 15.0,
  "stockOrigenAntes": 100.0,
  "stockOrigenDespues": 85.0,
  "stockDestinoAntes": 20.0,
  "stockDestinoDespues": 35.0,
  "fechaTransferencia": "2024-10-14T17:30:00Z",
  "usuario": "admin@empresa.com",
  "observaciones": "Transferencia para reposición de inventario"
}
```

---

### 5. Get Location Transfer History

**Endpoint**: `GET /portal/Inventario/localidad/{localidadId}/transferencias`

**Purpose**: Retrieve transfer history for a specific location (both incoming and outgoing transfers).

#### Request Parameters

| Parameter   | Type   | Required | Default | Description                  |
| ----------- | ------ | -------- | ------- | ---------------------------- |
| localidadId | number | ✅       | -       | Location ID (path parameter) |
| desde       | string | ❌       | -       | Start date (ISO 8601 format) |
| hasta       | string | ❌       | -       | End date (ISO 8601 format)   |
| limit       | number | ❌       | 50      | Maximum results to return    |

#### Example Request

```http
GET /portal/Inventario/localidad/5/transferencias?desde=2024-01-01T00:00:00Z&hasta=2024-12-31T23:59:59Z&limit=100
```

#### Response Structure

```typescript
interface TransferenciaStockHistorial {
  id: number;
  codigoProducto: string;
  numeroTransferencia: string;
  localidadOrigenId: number;
  localidadOrigenNombre: string;
  localidadDestinoId: number;
  localidadDestinoNombre: string;
  cantidad: number;
  fechaTransferencia: string; // ISO 8601 datetime
  usuario: string;
  observaciones?: string;
}
```

#### Success Response Example

```json
[
  {
    "id": 1001,
    "codigoProducto": "PROD001",
    "numeroTransferencia": "TRF-20241014-001",
    "localidadOrigenId": 5,
    "localidadOrigenNombre": "Almacén Principal",
    "localidadDestinoId": 8,
    "localidadDestinoNombre": "Tienda Centro",
    "cantidad": 15.0,
    "fechaTransferencia": "2024-10-14T17:30:00Z",
    "usuario": "admin@empresa.com",
    "observaciones": "Transferencia para reposición de inventario"
  },
  {
    "id": 1002,
    "codigoProducto": "PROD002",
    "numeroTransferencia": "TRF-20241013-005",
    "localidadOrigenId": 8,
    "localidadOrigenNombre": "Tienda Centro",
    "localidadDestinoId": 5,
    "localidadDestinoNombre": "Almacén Principal",
    "cantidad": 5.0,
    "fechaTransferencia": "2024-10-13T14:15:00Z",
    "usuario": "supervisor@empresa.com",
    "observaciones": "Devolución de producto con defecto"
  }
]
```

---

### 6. Get Product Transfer History

**Endpoint**: `GET /portal/Inventario/producto/{codigoProducto}/transferencias`

**Purpose**: Retrieve transfer history for a specific product across all locations.

#### Request Parameters

| Parameter      | Type   | Required | Default | Description                   |
| -------------- | ------ | -------- | ------- | ----------------------------- |
| codigoProducto | string | ✅       | -       | Product code (path parameter) |
| desde          | string | ❌       | -       | Start date (ISO 8601 format)  |
| hasta          | string | ❌       | -       | End date (ISO 8601 format)    |
| limit          | number | ❌       | 50      | Maximum results to return     |

#### Example Request

```http
GET /portal/Inventario/producto/PROD001/transferencias?desde=2024-01-01T00:00:00Z&limit=100
```

#### Response Structure

```typescript
interface TransferenciaStockHistorial[] // Array of transfer history records
```

---

## 📋 Devolution/Return APIs

### 1. Process Devolution

**Endpoint**: `POST /portal/Devolucion`

**Purpose**: Process a complete product return/devolution with automatic fiscal calculations and inventory updates.

#### Request Structure

```typescript
interface ProcesarDevolucionRequest {
  numeroDocumento: string; // Required: Invoice number (NoPedidoStr or SecuenciaDocumento)
  productos: DevolucionDetalle[]; // Required: Products to return
}

interface DevolucionDetalle {
  codigoProducto: string; // Required: Product code
  cantidad: number; // Required: Quantity to return
  motivoDevolucion?: string; // Optional: Return reason

  // These are calculated automatically from original document
  // Include only if you want to override
  precioUnitario?: number;
  descuentoUnitario?: number;
  porcentajeDescuento?: number;
  impuestoUnitario?: number;
  porcentajeImpuesto?: number;
  tipoImpuesto?: string;
}
```

#### Example Request

```json
{
  "numeroDocumento": "FAC-00001234",
  "productos": [
    {
      "codigoProducto": "PROD001",
      "cantidad": 3,
      "motivoDevolucion": "Producto defectuoso"
    },
    {
      "codigoProducto": "PROD002",
      "cantidad": 1,
      "motivoDevolucion": "Error en pedido"
    }
  ]
}
```

#### Response Structure

```typescript
interface DevolucionResponse {
  numeroDocumento: string;
  montoDevolucion: number;
  productos: DevolucionDetalle[];
  movimientoCxc?: MovimientoCxc; // null if cash sale
  resumenFiscal: ResumenFiscalDevolucion;
}

interface DevolucionDetalle {
  codigoProducto: string;
  cantidad: number;
  motivoDevolucion?: string;
  precioUnitario: number;
  descuentoUnitario: number;
  porcentajeDescuento: number;
  impuestoUnitario: number;
  porcentajeImpuesto: number;
  tipoImpuesto?: string;

  // Calculated values
  subTotalSinDescuento: number;
  totalDescuento: number;
  baseImponible: number;
  totalImpuesto: number;
  montoDevolucion: number;
  detalleCalculo: DevolucionCalculo;
}

interface DevolucionCalculo {
  codigoProducto: string;
  cantidad: number;
  precioUnitario: number;
  subTotalBruto: number;
  descuentoTotal: number;
  baseGravable: number;
  impuestoTotal: number;
  montoFinal: number;
}

interface ResumenFiscalDevolucion {
  montoTotal: number;
  totalBaseGravable: number;
  totalDescuentos: number;
  totalImpuestos: number;
}

interface MovimientoCxc {
  id: number;
  numeroCxc: string;
  tipoMovimiento: number;
  tipoMovimientoDescripcion: string;
  monto: number;
  fechaMovimiento: string;
  usuarioCreacion: string;
  // ... other CXC movement properties
}
```

#### Success Response Example

```json
{
  "numeroDocumento": "FAC-00001234",
  "montoDevolucion": 428.5,
  "productos": [
    {
      "codigoProducto": "PROD001",
      "cantidad": 3,
      "motivoDevolucion": "Producto defectuoso",
      "precioUnitario": 100.0,
      "descuentoUnitario": 5.0,
      "porcentajeDescuento": 5.0,
      "impuestoUnitario": 17.1,
      "porcentajeImpuesto": 18.0,
      "subTotalSinDescuento": 300.0,
      "totalDescuento": 15.0,
      "baseImponible": 285.0,
      "totalImpuesto": 51.3,
      "montoDevolucion": 336.3,
      "detalleCalculo": {
        "codigoProducto": "PROD001",
        "cantidad": 3,
        "precioUnitario": 100.0,
        "subTotalBruto": 300.0,
        "descuentoTotal": 15.0,
        "baseGravable": 285.0,
        "impuestoTotal": 51.3,
        "montoFinal": 336.3
      }
    }
  ],
  "movimientoCxc": {
    "id": 1001,
    "numeroCxc": "CXC-00000567",
    "tipoMovimiento": 2,
    "tipoMovimientoDescripcion": "Devolución",
    "monto": -428.5,
    "fechaMovimiento": "2024-10-14T16:45:00Z",
    "usuarioCreacion": "vendedor1@empresa.com"
  },
  "resumenFiscal": {
    "montoTotal": 428.5,
    "totalBaseGravable": 365.0,
    "totalDescuentos": 20.0,
    "totalImpuestos": 65.7
  }
}
```

---

### 2. Calculate Devolution (Preview)

**Endpoint**: `POST /portal/Devolucion/calcular`

**Purpose**: Calculate devolution amounts without processing (preview mode). Useful for showing calculated amounts before confirming the return.

#### Request Structure

```typescript
interface CalcularDevolucionRequest {
  numeroDocumento: string; // Required: Invoice number
  productos: DevolucionDetalle[]; // Required: Products to calculate
}

interface DevolucionDetalle {
  codigoProducto: string; // Required: Product code
  cantidad: number; // Required: Quantity to return
}
```

#### Example Request

```json
{
  "numeroDocumento": "FAC-00001234",
  "productos": [
    {
      "codigoProducto": "PROD001",
      "cantidad": 3
    },
    {
      "codigoProducto": "PROD002",
      "cantidad": 1
    }
  ]
}
```

#### Response Structure

Same as `ProcesarDevolucion` but:

- `movimientoCxc` will be `null` (no movement created)
- Only calculation results are returned

---

## 🚨 Error Handling

### Standard Error Response

```typescript
interface ApiError {
  message: string;
  details?: string;
  validationErrors?: { [field: string]: string[] };
}
```

### Common HTTP Status Codes

| Status | Description           | Common Causes                           |
| ------ | --------------------- | --------------------------------------- |
| 200    | Success               | Request completed successfully          |
| 400    | Bad Request           | Invalid parameters, validation errors   |
| 401    | Unauthorized          | Missing or invalid authentication token |
| 404    | Not Found             | Product/document not found              |
| 500    | Internal Server Error | System error, check logs                |

### Error Response Examples

#### Validation Error (400)

```json
{
  "message": "Validación fallida",
  "validationErrors": {
    "codigoProducto": ["El código del producto es requerido"],
    "cantidadAjuste": ["La cantidad de ajuste no puede ser cero"]
  }
}
```

#### Business Logic Error (400)

```json
{
  "message": "El ajuste resultaría en stock negativo. Stock actual: 5, Ajuste: -10"
}
```

#### Not Found Error (404)

```json
{
  "message": "Producto con código 'INVALID001' no encontrado"
}
```

---

## 💡 Implementation Guidelines

### 1. Date Handling

- Always use ISO 8601 format for dates: `2024-10-14T16:45:00Z`
- Backend returns UTC dates, convert to local timezone in UI
- For date filters, ensure proper timezone handling

### 2. Pagination Best Practices

- Default page size: 20 items
- Maximum page size: 100 items
- Always show pagination metadata to users
- Implement "Load More" or traditional pagination controls

### 3. Real-time Updates

- Consider implementing WebSocket/SignalR for real-time inventory updates
- Refresh movement lists after successful adjustments
- Show loading states during API calls

### 4. Data Validation

- Validate required fields before submission
- Show clear error messages for validation failures
- Implement client-side validation for better UX

### 5. Error Recovery

- Implement retry logic for network errors
- Provide clear error messages to users
- Allow users to correct validation errors inline

### 6. Security Considerations

- Never store sensitive data in local storage
- Implement proper token refresh mechanisms
- Validate user permissions for inventory operations

---

## 📱 UI/UX Recommendations

### Movement History Display

- Show movements in reverse chronological order (newest first)
- Use color coding for movement types (red=exit, green=entry, blue=adjustment, orange=return)
- Include search and filter capabilities
- Implement expandable rows for movement details

### Adjustment Forms

- Pre-validate stock levels before allowing negative adjustments
- Show current stock levels when creating adjustments
- Require confirmation for large adjustments
- Provide reason templates/dropdown for common adjustment reasons

### Devolution Processing

- Show invoice details before processing returns
- Calculate and display return amounts in real-time
- Provide confirmation screen with fiscal breakdown
- Allow partial returns with quantity selectors

### Stock Transfer Operations

- Display current stock levels for both source and destination locations
- Validate sufficient stock at source location before allowing transfer
- Show transfer confirmation with before/after stock levels
- Implement location selector with search/filter capabilities
- Provide transfer history with visual indicators for incoming/outgoing transfers
- Use color coding: blue for outgoing transfers, green for incoming transfers
- Show transfer status and tracking information
- Include quantity validation to prevent negative stock

### Loading and Feedback

- Show loading indicators for API calls
- Provide success/error notifications
- Use optimistic updates where appropriate
- Implement proper error boundaries

---

## 🔧 Integration Checklist

- [ ] Configure base API URLs and authentication
- [ ] Implement proper error handling for all endpoints
- [ ] Add pagination controls for movement history
- [ ] Validate user input before API calls
- [ ] Implement loading states and progress indicators
- [ ] Add proper date/time formatting and timezone handling
- [ ] Test with different user permissions and scenarios
- [ ] Implement retry logic for failed requests
- [ ] Add comprehensive logging for debugging
- [ ] Test edge cases (large datasets, network failures, etc.)
- [ ] Implement stock transfer validation (sufficient stock, valid locations)
- [ ] Add transfer confirmation dialogs with stock level preview
- [ ] Test transfer operations between different location types
- [ ] Implement transfer history tracking and status display

---

This documentation provides all the necessary interfaces and patterns needed to integrate with the Inventory Movement, Stock Transfer, and Devolution APIs. Refer to the individual endpoint sections for specific implementation details.
