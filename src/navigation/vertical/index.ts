// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      path: '/home',
      icon: 'mdi:view-dashboard-outline',
    },

    // === AI ASSISTANT ===
    {
      title: 'Chat AI',
      path: '/apps/ai-agent',
      icon: 'mdi:robot-outline',
      aiAgent: 'Portal Agent',
    },

    // === SALES & CUSTOMER OPERATIONS ===
    {
      title: 'Ventas',
      icon: 'mdi:point-of-sale',
      children: [
        {
          title: 'Terminal POS',
          icon: 'mdi:cash-register',
          path: '/apps/pos',
          permission: 'pos.allowCashierAccess',
        },
        {
          title: 'Gestión de Turnos',
          icon: 'mdi:clock-outline',
          path: '/apps/pos/manager',
        },
        {
          title: 'Cotizaciones',
          icon: 'mdi:file-document-edit-outline',
          path: '/apps/documents/cotizacion',
        },
        {
          title: 'Pedidos',
          icon: 'mdi:clipboard-list-outline',
          path: '/apps/documents/pedidos',
        },
        {
          title: 'Facturas',
          icon: 'mdi:receipt',
          path: '/apps/documents/facturas',
        },
      ],
    },
    {
      title: 'Biblioteca de Medios',
      icon: 'mdi:folder-multiple-image',
      path: '/apps/media',
    },
    // === CUSTOMER MANAGEMENT ===
    {
      title: 'Clientes',
      icon: 'mdi:account-group',
      children: [
        {
          title: 'Gestión de Clientes',
          icon: 'mdi:account-details',
          path: '/apps/clients/list',
        },
        {
          title: 'Condiciones de Pago',
          icon: 'mdi:account-payment',
          path: '/apps/paymentTypes/list',
        },
        {
          title: 'Facturas CxC',
          icon: 'lets-icons:order',
          path: '/apps/invoices/list',
        },
        // {
        //   title: 'Visitas',
        //   icon: 'material-symbols:map-outline',
        //   path: '/apps/visits/list',
        // },
        {
          title: 'Mensajería',
          icon: 'mdi:message-text',
          path: '/apps/communication',
        },
        {
          title: 'Cuentas por Cobrar',
          icon: 'mdi:account-cash-outline',
          path: '/apps/cxc',
        },
        {
          title: 'Notas Crédito/Débito',
          icon: 'mdi:note-multiple-outline',
          path: '/apps/cxc/notes',
        },
        {
          title: 'Reportes CXC',
          icon: 'mdi:chart-line',
          path: '/apps/cxc/reports',
        },
        {
          title: 'Cobranzas Remotas',
          icon: 'ph:money-fill',
          path: '/apps/collections/list',
        },
        {
          title: 'Vendedores',
          icon: 'gis:map-users',
          path: '/apps/sellers/list',
        },
      ],
    },

    // === INVENTORY & PRODUCTS ===
    {
      title: 'Inventario',
      icon: 'mdi:warehouse',
      children: [
        {
          title: 'Productos',
          icon: 'fluent-mdl2:product',
          path: '/apps/products/list',
        },
        {
          title: 'Conteos',
          icon: 'mdi:clipboard-list-outline',
          children: [
            {
              title: 'Conteos de Inventario',
              icon: 'mdi:clipboard-list-outline',
              path: '/apps/inventory-management/counts',
            },
            {
              title: 'Reconciliaciones',
              icon: 'mdi:compare-horizontal',
              path: '/apps/inventory-management/reconciliations',
            },
          ],
        },

        {
          title: 'Movimientos',
          icon: 'mdi:swap-horizontal',
          path: '/apps/inventory-management/movements',
        },
        {
          title: 'Ajustes',
          icon: 'mdi:playlist-edit',
          path: '/apps/inventory-management/adjustments',
        },
        {
          title: 'Transferencias',
          icon: 'mdi:transfer-right',
          path: '/apps/inventory-management/transfers',
        },
        {
          title: 'Devoluciones',
          icon: 'mdi:keyboard-return',
          children: [
            {
              title: 'Listado',
              icon: 'mdi:history',
              path: '/apps/documents/item-returns/list',
            },
            {
              title: 'Nueva Devolución',
              icon: 'mdi:plus',
              path: '/apps/documents/item-returns',
            },
          ],
        },
        {
          title: 'Zonas de Inventario',
          icon: 'mdi:map-marker-multiple',
          path: '/apps/inventory-zones',
        },
      ],
    },

    // === OPERATIONS & LOGISTICS ===
    {
      title: 'Operaciones',
      icon: 'mdi:truck-delivery',
      children: [
        {
          title: 'Transportes',
          icon: 'mdi:truck',
          path: '/apps/transports/list',
        },
        {
          title: 'Distribuidores',
          icon: 'healthicons:truck-driver',
          path: '/apps/drivers/list',
        },
      ],
    },

    // === CATALOG & PRICING ===
    {
      title: 'Catálogo',
      icon: 'mdi:tag-multiple',
      children: [
        {
          title: 'Ofertas',
          icon: 'hugeicons-sale-tag-02',
          path: '/apps/offers/list',
        },
      ],
    },

    // === REPORTS & ANALYTICS ===
    {
      title: 'Reportes',
      icon: 'mdi:chart-line',
      children: [
        {
          title: 'Plantillas de Reportes',
          icon: 'mdi:file-document-multiple',
          path: '/apps/reports',
        },
        {
          title: 'Plantillas de Documentos',
          icon: 'mdi:file-cog-outline',
          path: '/apps/settings/templates',
        },
      ],
    },

    // === ADMINISTRATION ===
    {
      title: 'Administración',
      icon: 'mdi:cog',
      children: [
        {
          title: 'Empresa',
          icon: 'mdi:office-building',
          path: '/apps/business',
        },
        {
          title: 'Configuración de Empresa',
          icon: 'mdi:cog-outline',
          path: '/apps/settings/business-configuration',
        },
        {
          title: 'Sucursales',
          icon: 'mdi:location',
          path: '/apps/locations/list',
        },
        {
          title: 'Comunicación',
          icon: 'mdi:message-settings',
          path: '/apps/communication/config',
        },
        {
          title: 'eCF',
          icon: 'mdi:file-document-edit',
          children: [
            {
              title: 'Integración',
              icon: 'mdi:cog',
              path: '/apps/ecf/integration/list',
            },
            {
              title: 'Secuencias eCF',
              icon: 'mdi:counter',
              path: '/apps/ecf/secuencia/list',
            },
            {
              title: 'Auditoría',
              icon: 'mdi:file-search',
              path: '/apps/ecf/audit',
            },
          ],
        },
        {
          title: 'Tipos de Documentos',
          icon: 'mdi:file-document-multiple',
          path: '/apps/docTypeSec/list',
        },
        {
          title: 'Cuenta',
          icon: 'mdi:account-cog',
          path: '/account-settings/account',
        },
      ],
    },
  ]
}

export default navigation
