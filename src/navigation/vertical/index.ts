// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      path: '/home',
      icon: 'mdi:home-outline',
    },
    {
      title: 'Transacciones',
      icon: 'mdi:file-document-outline',
      children: [
        {
          title: 'POS',
          icon: 'mdi:point-of-sale',
          // This will be filtered by UserLayout based on permissions
          permission: 'pos.allowCashierAccess',
          children: [
            {
              title: 'Terminal de Ventas',
              icon: 'mdi:cash-register',
              path: '/apps/pos',
            },
            {
              title: 'Gestión de Turnos',
              icon: 'mdi:clock-outline',
              path: '/apps/pos/manager',
            },
          ],
        },
        {
          title: 'Documentos',
          icon: 'lets-icons:order',
          path: '/apps/documents/list',
        },
        {
          title: 'Transportes',
          icon: 'mdi:truck',
          path: '/apps/transports/list',
        },
        {
          title: 'Cobranza',
          icon: 'ph:money-fill',
          path: '/apps/collections/list',
        },
        {
          title: 'Cuentas por Cobrar',
          icon: 'mdi:account-cash-outline',
          children: [
            {
              title: 'Gestión CXC',
              icon: 'mdi:format-list-bulleted',
              path: '/apps/cxc',
            },
            {
              title: 'Reportes',
              icon: 'mdi:chart-line',
              path: '/apps/cxc/reports',
            },
          ],
        },
        {
          title: 'Visitas',
          icon: 'material-symbols:map-outline',
          path: '/apps/visits/list',
        },
      ],
    },
    {
      title: 'Gestión Inventario',
      icon: 'mdi:warehouse',
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
      title: 'Data Maestra',
      icon: 'bxs:data',
      children: [
        {
          title: 'Clientes',
          icon: 'mdi:account-details',
          path: '/apps/clients/list',
        },
        {
          title: 'Productos',
          icon: 'fluent-mdl2:product',
          path: '/apps/products/list',
        },
        {
          title: 'Ofertas',
          icon: 'hugeicons-sale-tag-02',
          path: '/apps/offers/list',
        },
        {
          title: 'Condiciones Pago',
          icon: 'mdi:account-payment',
          path: '/apps/paymentTypes/list',
        },
        {
          title: 'Sucursales',
          icon: 'mdi:location',
          path: '/apps/locations/list',
        },
        {
          title: 'Vendedores',
          icon: 'gis:map-users',
          path: '/apps/sellers/list',
        },
        {
          title: 'Facturas CxC',
          icon: 'lets-icons:order',
          path: '/apps/invoices/list',
        },
        {
          title: 'Distribuidores',
          icon: 'healthicons:truck-driver',
          path: '/apps/drivers/list',
        },
        {
          title: 'Zonas de Inventario',
          icon: 'mdi:map-marker-multiple',
          path: '/apps/inventory-zones',
        },
      ],
    },
    {
      title: 'Configuración',
      icon: 'uil:setting',
      children: [
        {
          title: 'ECF',
          icon: 'mdi:file-document-edit',
          children: [
            {
              title: 'Integración',
              icon: 'mdi:cog',
              path: '/apps/ecf/integration/list',
            },
            {
              title: 'Secuencias ECF',
              icon: 'mdi:counter',
              path: '/apps/ecf/secuencia/list',
            },
            {
              title: 'Empresa',
              icon: 'mdi:office-building',
              path: '/apps/ecf/business',
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
    // {
    //   title: 'Second Page',
    //   path: '/second-page',
    //   icon: 'mdi:email-outline',
    // },
    // {
    //   path: '/acl',
    //   action: 'read',
    //   subject: 'acl-page',
    //   title: 'Access Control',
    //   icon: 'mdi:shield-outline',
    // }
  ]
}

export default navigation
