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
          title: 'Pedidos',
          icon: 'lets-icons:order',
          path: '/apps/documents/list'
        },
        {
          title: 'Transportes',
          icon: 'mdi:truck',
          path: '/apps/transports/list'
        },
        {
          title: 'Cobranza',
          icon: 'ph:money-fill',
          path: '/apps/collections/edit'
        },
        {
          title: 'Visitas',
          icon: 'material-symbols:map-outline',
          path: '/apps/visits/add'
        }
      ]
    }, 
    {
      title: 'Data Maestra',
      icon: 'bxs:data',
      children: [
        {
          title: 'Clientes',
          icon: 'mdi:account-details',
          path: '/apps/clients/list'
        },
        {
          title: 'Productos',
          icon: 'fluent-mdl2:product',
          path: '/apps/products/preview'
        },
        {
          title: 'Condiciones Pago',
          icon: 'mdi:account-payment',
          path: '/apps/paymentType/edit'
        },
        {
          title: 'Localidades',
          icon: 'mdi:location',
          path: '/apps/locations/add'
        },
        {
          title: 'Vendedores',
          icon: 'gis:map-users',
          path: '/apps/sellers/add'
        },
        {
          title: 'Distribuidores',
          icon: 'healthicons:truck-driver',
          path: '/apps/drivers/add'
        }
      ]
    }, 
    {
      title: 'Configuración',
      icon: 'uil:setting',
      children: [
        {
          title: 'Usuarios',
          path: '/apps/users/list'
        }
      ]
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
