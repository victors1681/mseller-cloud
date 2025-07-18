# POS (Point of Sale) System

Este es un sistema completo de Punto de Venta diseñado para ser optimizado para tablets y pantallas táctiles pequeñas.

## Características Principales

### 🎯 Interfaz Optimizada

- **Diseño responsivo**: Adaptado para tablets y pantallas táctiles
- **Touch-friendly**: Botones y elementos con tamaño mínimo de 44px
- **Navegación intuitiva**: Interfaz dividida en paneles izquierdo y derecho
- **Animaciones suaves**: Feedback visual para interacciones

### 🛍️ Gestión de Productos

- **Grid de productos**: Visualización en cards con imagen, nombre y precio
- **Búsqueda avanzada**: Por nombre, código o código de barras
- **Filtros por área**: Chips interactivos para filtrar por categorías
- **Stock en tiempo real**: Indicadores visuales de disponibilidad
- **Múltiples precios**: Soporte para 5 niveles de precios

### 👥 Gestión de Clientes

- **Búsqueda de clientes**: Integración con el sistema de clientes existente
- **Clientes temporales**: Creación rápida para ventas casuales
- **Información completa**: Balance, límite de crédito, datos de contacto

### 🛒 Carrito de Compras

- **Gestión visual**: Lista interactiva con imágenes de productos
- **Control de cantidad**: Botones + / - y campo editable
- **Cálculos automáticos**: Subtotal, descuentos, impuestos y total
- **Resumen financiero**: Desglose completo de la transacción

### 💳 Procesamiento de Pagos

- **Múltiples métodos**: Efectivo, transferencia, tarjeta, cheque, crédito
- **Cálculo de cambio**: Automático para pagos en efectivo
- **Referencias**: Campo para números de transferencia o cheque
- **Notas opcionales**: Comentarios adicionales en la transacción

## Arquitectura Técnica

### 📁 Estructura de Archivos

```
src/
├── pages/apps/pos/
│   └── index.tsx                    # Página principal del POS
├── views/apps/pos/components/
│   ├── POSProductGrid.tsx           # Grid de productos
│   ├── POSCartSummary.tsx           # Resumen del carrito
│   ├── POSCustomerSection.tsx       # Sección de clientes
│   ├── POSAreaFilter.tsx            # Filtros por área
│   ├── POSQuantityDialog.tsx        # Diálogo de cantidad
│   ├── POSPaymentDialog.tsx         # Diálogo de pago
│   └── index.ts                     # Exports centralizados
├── types/apps/
│   └── posTypes.ts                  # Tipos TypeScript del POS
├── hooks/
│   └── usePOSStore.ts               # Estado global del POS
├── layouts/
│   └── POSLayout.tsx                # Layout especializado
└── pages/api/
    ├── products.ts                  # API de productos
    └── products/areas.ts            # API de áreas
```

### 🔧 Tecnologías Utilizadas

- **React 18**: Hooks y componentes funcionales
- **Material-UI**: Componentes de interfaz
- **TypeScript**: Tipado estático
- **Next.js**: Framework y API routes
- **Custom Hooks**: Gestión de estado local

### 🎨 Componentes Principales

#### POSProductGrid

- Grid responsivo de productos
- Cards con imagen, nombre, precio y stock
- Indicadores visuales de disponibilidad
- Optimizado para touch

#### POSCartSummary

- Lista scrolleable de items del carrito
- Controles de cantidad integrados
- Cálculos financieros en tiempo real
- Botón de checkout prominente

#### POSCustomerSection

- Búsqueda de clientes existentes
- Creación de clientes temporales
- Información de balance y crédito
- Avatar generado automáticamente

#### POSQuantityDialog

- Selección de cantidad con controles grandes
- Múltiples precios disponibles
- Vista previa del subtotal
- Validación de stock

#### POSPaymentDialog

- Métodos de pago visuales
- Cálculo automático de cambio
- Campos para referencias
- Resumen completo de la orden

### 🔄 Flujo de Trabajo

1. **Selección de Cliente** (opcional)

   - Buscar cliente existente
   - Crear cliente temporal
   - Continuar sin cliente

2. **Agregado de Productos**

   - Filtrar por área (opcional)
   - Buscar productos
   - Seleccionar producto → Diálogo de cantidad
   - Confirmar agregado al carrito

3. **Revisión del Carrito**

   - Modificar cantidades
   - Eliminar productos
   - Revisar totales

4. **Procesamiento de Pago**
   - Seleccionar método de pago
   - Ingresar monto recibido
   - Agregar referencias/notas
   - Confirmar transacción

### 🎯 Optimizaciones para Touch

- **Tamaños mínimos**: 44px para elementos interactivos
- **Espaciado generoso**: Evita toques accidentales
- **Feedback visual**: Animaciones en hover/active
- **Navegación simple**: Máximo 2 niveles de profundidad
- **Controles grandes**: Botones de cantidad y acciones principales

### 🔌 APIs Mock Implementadas

#### GET `/api/products`

```json
{
  "success": true,
  "products": [...],
  "total": 5
}
```

#### GET `/api/products/areas`

```json
{
  "success": true,
  "areas": [...],
  "total": 8
}
```

### 🚀 Próximos Pasos

1. **Integración con Backend Real**

   - Conectar con APIs de productos reales
   - Implementar sistema de inventory en tiempo real
   - Sincronización con base de datos

2. **Funcionalidades Avanzadas**

   - Códigos de barras con cámara
   - Impresión de recibos
   - Reportes de ventas
   - Descuentos y promociones

3. **Optimizaciones Adicionales**
   - Caché de productos
   - Modo offline
   - Sincronización en background
   - PWA capabilities

## 🎨 Personalización

El sistema está diseñado para ser fácilmente personalizable:

- **Colores**: Themes de Material-UI
- **Tamaños**: Variables CSS responsivas
- **Componentes**: Arquitectura modular
- **Layouts**: Sistema de layouts intercambiable

## 📱 Compatibilidad

- **Tablets**: iPad, Android tablets (10"+)
- **Pantallas táctiles**: Monitores touch de 15-24"
- **Móviles**: Responsive hasta 5" (modo emergencia)
- **Desktop**: Funcionalidad completa con mouse/teclado
