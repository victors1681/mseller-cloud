# Dashboard Backend API Specification

## Overview

This document specifies the backend API endpoints required to support the MSeller Cloud Dashboard Overview page. All endpoints follow the pattern `/api/portal/Dashboard/*` and support date range filtering.

---

## Common Request Parameters

All endpoints accept optional query parameters for filtering:

```typescript
interface DashboardFilters {
  startDate?: string // ISO 8601 format (e.g., "2025-01-01T00:00:00Z")
  endDate?: string // ISO 8601 format (e.g., "2025-12-31T23:59:59Z")
  vendedorId?: string // Filter by specific seller
  localidadId?: number // Filter by location
  distribuidorId?: string // Filter by driver/distributor
}
```

### Date Range Presets (Frontend Handling)

The frontend provides these preset options that translate to startDate/endDate:

- **Today**: Current day (00:00:00 to 23:59:59)
- **This Week**: Monday to Sunday of current week
- **This Month**: First to last day of current month
- **Last Month**: First to last day of previous month

---

## API Endpoints

### 1. Dashboard Statistics Summary

**GET** `/api/portal/Dashboard/stats`

Returns high-level metrics and KPIs for the dashboard header cards.

#### Query Parameters

- `startDate` (optional): Start of date range
- `endDate` (optional): End of date range
- `vendedorId` (optional): Filter by seller
- `localidadId` (optional): Filter by location
- `distribuidorId` (optional): Filter by driver

#### Response

```json
{
  "totalOrders": 1245,
  "ordersGrowth": 15.5,
  "totalRevenue": 125000.5,
  "revenueGrowth": 23.2,
  "totalCollections": 98000.25,
  "collectionsGrowth": 12.8,
  "pendingCollections": 27000.25,
  "activeDrivers": 24,
  "driversGrowth": 8.5,
  "activeSellers": 45,
  "sellersGrowth": 12.3,
  "totalProducts": 350,
  "lowStockProducts": 28,
  "activeTransports": 18,
  "completedToday": 156
}
```

#### Field Descriptions

| Field                | Type   | Description                                   |
| -------------------- | ------ | --------------------------------------------- |
| `totalOrders`        | number | Total number of orders in the date range      |
| `ordersGrowth`       | number | Percentage growth compared to previous period |
| `totalRevenue`       | number | Total revenue amount in the date range        |
| `revenueGrowth`      | number | Percentage growth compared to previous period |
| `totalCollections`   | number | Total collected amount in the date range      |
| `collectionsGrowth`  | number | Percentage growth compared to previous period |
| `pendingCollections` | number | Amount still pending collection               |
| `activeDrivers`      | number | Number of currently active drivers            |
| `driversGrowth`      | number | Percentage growth in active drivers           |
| `activeSellers`      | number | Number of currently active sellers            |
| `sellersGrowth`      | number | Percentage growth in active sellers           |
| `totalProducts`      | number | Total number of products in inventory         |
| `lowStockProducts`   | number | Number of products below minimum stock level  |
| `activeTransports`   | number | Number of active transport routes             |
| `completedToday`     | number | Number of deliveries completed today          |

#### HTTP Status Codes

- `200 OK`: Success
- `400 Bad Request`: Invalid parameters
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server error

---

### 2. Revenue vs Collections Chart Data

**GET** `/api/portal/Dashboard/revenue`

Returns monthly revenue and collections data for the line chart visualization.

#### Query Parameters

- `startDate` (optional): Start of date range
- `endDate` (optional): End of date range
- `vendedorId` (optional): Filter by seller
- `localidadId` (optional): Filter by location

#### Response

```json
[
  {
    "month": "Ene",
    "revenue": 45000.0,
    "collections": 38000.0
  },
  {
    "month": "Feb",
    "revenue": 52000.0,
    "collections": 45000.0
  },
  {
    "month": "Mar",
    "revenue": 48000.0,
    "collections": 42000.0
  }
  // ... more months
]
```

#### Field Descriptions

| Field         | Type   | Description                              |
| ------------- | ------ | ---------------------------------------- |
| `month`       | string | Month abbreviation (Ene, Feb, Mar, etc.) |
| `revenue`     | number | Total revenue for the month              |
| `collections` | number | Total collections for the month          |

#### Notes

- Should return data for the last 12 months or within specified date range
- Months should be in chronological order
- Use Spanish month abbreviations

---

### 3. Top Products

**GET** `/api/portal/Dashboard/top-products`

Returns the top 5 best-selling products by revenue.

#### Query Parameters

- `startDate` (optional): Start of date range
- `endDate` (optional): End of date range
- `vendedorId` (optional): Filter by seller
- `localidadId` (optional): Filter by location
- `limit` (optional, default: 5): Number of products to return

#### Response

```json
[
  {
    "id": "prod-1",
    "name": "Coca Cola 2.5L",
    "sales": 450,
    "revenue": 22500.0,
    "trend": 15.5
  },
  {
    "id": "prod-2",
    "name": "Pepsi 2L",
    "sales": 380,
    "revenue": 19000.0,
    "trend": 12.3
  },
  {
    "id": "prod-3",
    "name": "Agua Mineral 500ml",
    "sales": 520,
    "revenue": 10400.0,
    "trend": -5.2
  }
  // ... more products
]
```

#### Field Descriptions

| Field     | Type   | Description                                                 |
| --------- | ------ | ----------------------------------------------------------- |
| `id`      | string | Product unique identifier                                   |
| `name`    | string | Product name                                                |
| `sales`   | number | Total units sold in period                                  |
| `revenue` | number | Total revenue generated by product                          |
| `trend`   | number | Percentage change vs previous period (positive or negative) |

#### Notes

- Should be sorted by revenue (highest first)
- Default limit is 5 products
- Trend calculation: `((current_period - previous_period) / previous_period) * 100`

---

### 4. Top Sellers

**GET** `/api/portal/Dashboard/top-sellers`

Returns the top 5 sellers by revenue performance.

#### Query Parameters

- `startDate` (optional): Start of date range
- `endDate` (optional): End of date range
- `localidadId` (optional): Filter by location
- `limit` (optional, default: 5): Number of sellers to return

#### Response

```json
[
  {
    "id": "seller-1",
    "name": "Juan Pérez",
    "orders": 125,
    "revenue": 65000.0,
    "collections": 52000.0,
    "avatar": "https://example.com/avatars/juan-perez.jpg"
  },
  {
    "id": "seller-2",
    "name": "María García",
    "orders": 110,
    "revenue": 58000.0,
    "collections": 48000.0,
    "avatar": null
  }
  // ... more sellers
]
```

#### Field Descriptions

| Field         | Type           | Description                             |
| ------------- | -------------- | --------------------------------------- |
| `id`          | string         | Seller unique identifier (vendedorId)   |
| `name`        | string         | Seller full name                        |
| `orders`      | number         | Total number of orders created          |
| `revenue`     | number         | Total revenue generated                 |
| `collections` | number         | Total amount collected                  |
| `avatar`      | string \| null | URL to seller's avatar image (optional) |

#### Notes

- Should be sorted by revenue (highest first)
- Default limit is 5 sellers
- Avatar can be null if not available

---

### 5. Recent Activity Feed

**GET** `/api/portal/Dashboard/recent-activity`

Returns the most recent business activities across all modules.

#### Query Parameters

- `limit` (optional, default: 8): Number of activities to return

#### Response

```json
[
  {
    "id": "act-1",
    "type": "order",
    "description": "Nueva orden #1234 creada por Juan Pérez - Cliente: Colmado El Buen Precio",
    "timestamp": "2025-12-27T14:30:00Z",
    "status": "success"
  },
  {
    "id": "act-2",
    "type": "collection",
    "description": "Cobro de $5,000 registrado por María García - Cliente: Super 24",
    "timestamp": "2025-12-27T14:15:00Z",
    "status": "success"
  },
  {
    "id": "act-3",
    "type": "transport",
    "description": "Ruta iniciada por Carlos Rodríguez - 12 entregas pendientes",
    "timestamp": "2025-12-27T14:00:00Z",
    "status": "info"
  },
  {
    "id": "act-4",
    "type": "product",
    "description": "Alerta: Stock bajo de Coca Cola 2.5L - Solo quedan 15 unidades",
    "timestamp": "2025-12-27T13:45:00Z",
    "status": "warning"
  },
  {
    "id": "act-5",
    "type": "transport",
    "description": "Entrega fallida - Cliente no disponible en dirección",
    "timestamp": "2025-12-27T13:30:00Z",
    "status": "error"
  }
  // ... more activities
]
```

#### Field Descriptions

| Field         | Type   | Description                                                  |
| ------------- | ------ | ------------------------------------------------------------ |
| `id`          | string | Activity unique identifier                                   |
| `type`        | string | Activity type: `order`, `collection`, `transport`, `product` |
| `description` | string | Human-readable description of the activity                   |
| `timestamp`   | string | ISO 8601 timestamp of when activity occurred                 |
| `status`      | string | Status: `success`, `warning`, `error`, `info`                |

#### Activity Types and Status Mapping

| Type         | Typical Status Values | Examples                                           |
| ------------ | --------------------- | -------------------------------------------------- |
| `order`      | success, info         | New order created, order completed                 |
| `collection` | success, warning      | Payment collected, payment pending                 |
| `transport`  | success, error, info  | Route started, delivery failed, delivery completed |
| `product`    | warning, error        | Low stock alert, out of stock                      |

#### Notes

- Should be sorted by timestamp (most recent first)
- Default limit is 8 activities
- Include activities from the last 24 hours by default

---

### 6. Orders by Status

**GET** `/api/portal/Dashboard/orders-status`

Returns the distribution of orders by their current status for donut chart visualization.

#### Query Parameters

- `startDate` (optional): Start of date range
- `endDate` (optional): End of date range
- `vendedorId` (optional): Filter by seller
- `localidadId` (optional): Filter by location

#### Response

```json
{
  "pending": 45,
  "processing": 78,
  "completed": 1020,
  "cancelled": 12
}
```

#### Field Descriptions

| Field        | Type   | Description                                |
| ------------ | ------ | ------------------------------------------ |
| `pending`    | number | Number of orders awaiting processing       |
| `processing` | number | Number of orders currently being processed |
| `completed`  | number | Number of successfully completed orders    |
| `cancelled`  | number | Number of cancelled orders                 |

#### Status Definitions

- **Pending**: Orders that have been created but not yet started processing
- **Processing**: Orders currently being prepared or in transit
- **Completed**: Orders successfully delivered and closed
- **Cancelled**: Orders that were cancelled before completion

---

### 7. Transport Activity

**GET** `/api/portal/Dashboard/transport-activity`

Returns current activity and delivery statistics for all drivers.

#### Query Parameters

- `startDate` (optional): Start of date range for delivery stats
- `endDate` (optional): End of date range for delivery stats
- `distribuidorId` (optional): Filter by specific driver
- `localidadId` (optional): Filter by location

#### Response

```json
[
  {
    "driverId": "driver-1",
    "driverName": "Carlos Rodríguez",
    "activeRoutes": 3,
    "completedToday": 12,
    "pendingDeliveries": 8,
    "status": "active",
    "deliveryStats": {
      "delivered": 28,
      "notDelivered": 3,
      "deliveredAnotherDay": 5,
      "partialDelivery": 2,
      "returned": 1
    }
  },
  {
    "driverId": "driver-2",
    "driverName": "Pedro Gómez",
    "activeRoutes": 2,
    "completedToday": 15,
    "pendingDeliveries": 5,
    "status": "active",
    "deliveryStats": {
      "delivered": 32,
      "notDelivered": 2,
      "deliveredAnotherDay": 4,
      "partialDelivery": 1,
      "returned": 0
    }
  },
  {
    "driverId": "driver-3",
    "driverName": "José Ramírez",
    "activeRoutes": 0,
    "completedToday": 18,
    "pendingDeliveries": 0,
    "status": "idle",
    "deliveryStats": {
      "delivered": 35,
      "notDelivered": 1,
      "deliveredAnotherDay": 3,
      "partialDelivery": 0,
      "returned": 0
    }
  },
  {
    "driverId": "driver-4",
    "driverName": "Rafael López",
    "activeRoutes": 0,
    "completedToday": 0,
    "pendingDeliveries": 0,
    "status": "offline",
    "deliveryStats": {
      "delivered": 15,
      "notDelivered": 1,
      "deliveredAnotherDay": 2,
      "partialDelivery": 0,
      "returned": 1
    }
  }
]
```

#### Field Descriptions

| Field                               | Type   | Description                                                   |
| ----------------------------------- | ------ | ------------------------------------------------------------- |
| `driverId`                          | string | Driver unique identifier (distribuidorId)                     |
| `driverName`                        | string | Driver full name                                              |
| `activeRoutes`                      | number | Number of currently active delivery routes                    |
| `completedToday`                    | number | Number of deliveries completed today                          |
| `pendingDeliveries`                 | number | Number of pending deliveries on active routes                 |
| `status`                            | string | Driver status: `active`, `idle`, `offline`                    |
| `deliveryStats`                     | object | Detailed delivery outcome statistics                          |
| `deliveryStats.delivered`           | number | Successfully delivered on scheduled day                       |
| `deliveryStats.notDelivered`        | number | Failed deliveries (customer unavailable, wrong address, etc.) |
| `deliveryStats.deliveredAnotherDay` | number | Delivered on a different day than scheduled                   |
| `deliveryStats.partialDelivery`     | number | Only part of the order delivered                              |
| `deliveryStats.returned`            | number | Orders returned to warehouse                                  |

#### Driver Status Definitions

- **active**: Driver is currently on an active route with pending deliveries
- **idle**: Driver is available but has no active routes
- **offline**: Driver is not currently working (end of shift, day off, etc.)

#### Notes

- Should include all drivers who have been active in the date range
- Delivery stats should reflect the entire date range, not just today
- Real-time status (active/idle/offline) reflects current moment

---

## Implementation Guidelines

### 1. Database Queries

#### Stats Endpoint

```sql
-- Example queries for stats calculation

-- Total orders in period
SELECT COUNT(*) as totalOrders
FROM Documento
WHERE fecha BETWEEN @startDate AND @endDate
AND (@vendedorId IS NULL OR vendedorId = @vendedorId)
AND (@localidadId IS NULL OR localidadId = @localidadId);

-- Revenue with growth calculation
WITH current_period AS (
  SELECT SUM(total) as revenue
  FROM Documento
  WHERE fecha BETWEEN @startDate AND @endDate
),
previous_period AS (
  SELECT SUM(total) as revenue
  FROM Documento
  WHERE fecha BETWEEN
    DATEADD(DAY, DATEDIFF(DAY, @startDate, @endDate), @startDate)
    AND @startDate
)
SELECT
  current_period.revenue as totalRevenue,
  CAST(((current_period.revenue - previous_period.revenue) /
    previous_period.revenue * 100) AS DECIMAL(10,2)) as revenueGrowth
FROM current_period, previous_period;

-- Pending collections
SELECT SUM(saldo) as pendingCollections
FROM CXC
WHERE estado != 'Pagado'
AND (@vendedorId IS NULL OR vendedorId = @vendedorId);

-- Low stock products
SELECT COUNT(*) as lowStockProducts
FROM Producto
WHERE existencia <= stockMinimo;
```

#### Top Products Query

```sql
SELECT TOP 5
  p.codigo as id,
  p.nombre as name,
  SUM(dd.cantidad) as sales,
  SUM(dd.cantidad * dd.precio) as revenue,
  -- Trend calculation comparing with previous period
  CAST(((SUM(dd.cantidad * dd.precio) - prev.revenue) /
    prev.revenue * 100) AS DECIMAL(10,2)) as trend
FROM Producto p
INNER JOIN DocumentoDetalle dd ON p.codigo = dd.productoId
INNER JOIN Documento d ON dd.documentoId = d.id
LEFT JOIN (
  -- Subquery for previous period revenue
  SELECT
    dd2.productoId,
    SUM(dd2.cantidad * dd2.precio) as revenue
  FROM DocumentoDetalle dd2
  INNER JOIN Documento d2 ON dd2.documentoId = d2.id
  WHERE d2.fecha BETWEEN @prevStartDate AND @prevEndDate
  GROUP BY dd2.productoId
) prev ON p.codigo = prev.productoId
WHERE d.fecha BETWEEN @startDate AND @endDate
AND (@vendedorId IS NULL OR d.vendedorId = @vendedorId)
GROUP BY p.codigo, p.nombre, prev.revenue
ORDER BY revenue DESC;
```

#### Transport Activity Query

```sql
SELECT
  d.id as driverId,
  d.nombre as driverName,
  COUNT(DISTINCT CASE WHEN t.estado = 'EnRuta' THEN t.id END) as activeRoutes,
  COUNT(DISTINCT CASE
    WHEN t.estado IN ('Entregado', 'Completado')
    AND CAST(t.fechaEntrega as DATE) = CAST(GETDATE() as DATE)
    THEN t.id
  END) as completedToday,
  COUNT(DISTINCT CASE WHEN t.estado IN ('Pendiente', 'EnRuta') THEN t.id END) as pendingDeliveries,
  CASE
    WHEN COUNT(DISTINCT CASE WHEN t.estado = 'EnRuta' THEN t.id END) > 0 THEN 'active'
    WHEN COUNT(DISTINCT CASE WHEN t.estado = 'Pendiente' THEN t.id END) = 0 THEN 'offline'
    ELSE 'idle'
  END as status,
  -- Delivery stats from DocumentoEntrega table
  COUNT(CASE WHEN de.estadoEntrega = 'Entregado' THEN 1 END) as delivered,
  COUNT(CASE WHEN de.estadoEntrega = 'NoEntregado' THEN 1 END) as notDelivered,
  COUNT(CASE WHEN de.estadoEntrega = 'EntregadoOtroDia' THEN 1 END) as deliveredAnotherDay,
  COUNT(CASE WHEN de.estadoEntrega = 'EntregaParcial' THEN 1 END) as partialDelivery,
  COUNT(CASE WHEN de.estadoEntrega = 'Devuelto' THEN 1 END) as returned
FROM Distribuidor d
LEFT JOIN Transporte t ON d.id = t.distribuidorId
LEFT JOIN DocumentoEntrega de ON t.documentoId = de.documentoId
WHERE (@startDate IS NULL OR de.fecha >= @startDate)
AND (@endDate IS NULL OR de.fecha <= @endDate)
AND (@distribuidorId IS NULL OR d.id = @distribuidorId)
GROUP BY d.id, d.nombre
ORDER BY status ASC, completedToday DESC;
```

### 2. Performance Considerations

- **Caching**: Consider caching dashboard data for 5-15 minutes depending on business needs
- **Indexing**: Ensure proper indexes on:
  - `Documento.fecha`
  - `Documento.vendedorId`
  - `Documento.localidadId`
  - `CXC.estado`
  - `Transporte.estado`
  - `DocumentoEntrega.estadoEntrega`
- **Pagination**: Not required for these endpoints as they return aggregated/limited data
- **Async Processing**: For heavy calculations, consider background job processing with cached results

### 3. Error Handling

All endpoints should return consistent error responses:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

Common error codes:

- `INVALID_DATE_RANGE`: Start date is after end date
- `INVALID_FILTER`: Invalid filter parameter
- `UNAUTHORIZED`: User not authenticated
- `FORBIDDEN`: User lacks permission to access resource
- `INTERNAL_ERROR`: Unexpected server error

### 4. Authentication & Authorization

- All endpoints require authentication via JWT token
- Verify user has `dashboard:read` permission or equivalent
- Filter data based on user's assigned locations/sellers if applicable
- Implement role-based restrictions (e.g., sellers can only see their own data)

### 5. Rate Limiting

Suggested rate limits:

- **Per User**: 100 requests per minute
- **Per IP**: 200 requests per minute
- Dashboard refresh triggers 7 API calls, so consider burst allowance

---

## Frontend Integration

### Redux Implementation

The frontend uses these async thunks that should be updated to call real APIs:

```typescript
// Example of converting mock to real API call
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (filters: DashboardFilters, { rejectWithValue }) => {
    try {
      const response = await restClient.get('/api/portal/Dashboard/stats', {
        params: filters,
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching dashboard stats',
      )
    }
  },
)
```

### API Calls on Page Load

When the dashboard loads, the frontend makes these 7 parallel API calls:

1. `GET /api/portal/Dashboard/stats`
2. `GET /api/portal/Dashboard/revenue`
3. `GET /api/portal/Dashboard/top-products`
4. `GET /api/portal/Dashboard/top-sellers`
5. `GET /api/portal/Dashboard/recent-activity`
6. `GET /api/portal/Dashboard/orders-status`
7. `GET /api/portal/Dashboard/transport-activity`

All calls include the selected date range filters.

---

## Testing

### Sample Test Cases

#### 1. Stats Endpoint

```bash
# Test with date range
GET /api/portal/Dashboard/stats?startDate=2025-01-01T00:00:00Z&endDate=2025-01-31T23:59:59Z

# Test with seller filter
GET /api/portal/Dashboard/stats?vendedorId=VEND001&startDate=2025-01-01T00:00:00Z&endDate=2025-01-31T23:59:59Z

# Test with location filter
GET /api/portal/Dashboard/stats?localidadId=5&startDate=2025-01-01T00:00:00Z&endDate=2025-01-31T23:59:59Z
```

#### 2. Revenue Chart

```bash
# Test last 12 months (no date filter)
GET /api/portal/Dashboard/revenue

# Test specific date range
GET /api/portal/Dashboard/revenue?startDate=2025-01-01T00:00:00Z&endDate=2025-06-30T23:59:59Z
```

#### 3. Top Products

```bash
# Test default (top 5)
GET /api/portal/Dashboard/top-products

# Test with custom limit
GET /api/portal/Dashboard/top-products?limit=10

# Test with seller filter
GET /api/portal/Dashboard/top-products?vendedorId=VEND001
```

#### 4. Transport Activity

```bash
# Test all drivers
GET /api/portal/Dashboard/transport-activity

# Test specific driver
GET /api/portal/Dashboard/transport-activity?distribuidorId=DIST001

# Test with date range for stats
GET /api/portal/Dashboard/transport-activity?startDate=2025-12-01T00:00:00Z&endDate=2025-12-27T23:59:59Z
```

### Expected Response Times

- Stats: < 500ms
- Revenue: < 300ms
- Top Products: < 400ms
- Top Sellers: < 400ms
- Recent Activity: < 200ms
- Orders Status: < 300ms
- Transport Activity: < 600ms

---

## Migration from Mock Data

### Step-by-Step Implementation

1. **Create Backend Endpoints**

   - Implement each endpoint following the specification
   - Test with Postman/curl using sample data
   - Verify response structure matches TypeScript interfaces

2. **Update Frontend Redux Thunks**

   - Replace mock data returns with `restClient.get()` calls
   - Keep the same response data structure
   - Maintain error handling patterns

3. **Test Integration**

   - Test each endpoint individually
   - Test with various filter combinations
   - Verify loading states and error handling
   - Test date range filtering with all presets

4. **Performance Optimization**

   - Monitor query performance
   - Add caching where appropriate
   - Optimize database indexes

5. **Rollout**
   - Deploy backend endpoints
   - Deploy frontend changes
   - Monitor for errors in production
   - Gather user feedback

---

## Appendix

### TypeScript Interfaces Reference

All TypeScript interfaces are defined in `/src/types/apps/dashboardTypes.ts`:

- `DashboardStats`
- `RevenueData`
- `TopProduct`
- `TopSeller`
- `RecentActivity`
- `OrdersByStatus`
- `TransportActivity`
- `DashboardFilters`

### Related Documentation

- [CXC Frontend API Integration](./cxc-frontend-api-integration.md)
- [Transport Module Documentation](./transports/)
- MSeller Cloud API Authentication Guide
- Database Schema Documentation

---

## Change Log

| Date       | Version | Changes                                |
| ---------- | ------- | -------------------------------------- |
| 2025-12-27 | 1.0.0   | Initial specification with 7 endpoints |

---

## Support

For questions or issues with this specification, contact the backend development team or create an issue in the project repository.
