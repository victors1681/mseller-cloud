import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'

export type CloudAccessPermissions = {
  collections: Record<string, any>
  masterdata: Record<string, any>
  orders: {
    allowApprove: boolean
    allowEdit: boolean
  }
  pos: {
    allowCashierAccess: boolean
    allowOpenCashDrawer: boolean
    allowVoidTransaction: boolean
    allowRefund: boolean
    allowDiscounts: boolean
    allowCashControl: boolean
    allowReports: boolean
    allowPriceOverride: boolean
  }
  settings: Record<string, any>
  statistics: Record<string, any>
  transports: {
    allowChangeStatus: boolean
    allowForceClose: boolean
  }
  visits: Record<string, any>
}

// Permission type for cloudAccess properties only
export type Permission =
  | 'collections'
  | 'masterdata'
  | 'orders'
  | 'orders.allowApprove'
  | 'orders.allowEdit'
  | 'orders.allowCreate'
  | 'pos'
  | 'pos.allowCashierAccess'
  | 'pos.allowOpenCashDrawer'
  | 'pos.allowVoidTransaction'
  | 'pos.allowRefund'
  | 'pos.allowDiscounts'
  | 'pos.allowCashControl'
  | 'pos.allowReports'
  | 'pos.allowPriceOverride'
  | 'settings'
  | 'statistics'
  | 'transports'
  | 'transports.allowChangeStatus'
  | 'transports.allowForceClose'
  | 'visits'

export const usePermissions = () => {
  const { user } = useContext(AuthContext)

  const defaultPermissions: CloudAccessPermissions = {
    collections: {},
    masterdata: {},
    orders: {
      allowApprove: false,
      allowEdit: false,
    },
    pos: {
      allowCashierAccess: false,
      allowOpenCashDrawer: false,
      allowVoidTransaction: false,
      allowRefund: false,
      allowDiscounts: false,
      allowCashControl: false,
      allowReports: false,
      allowPriceOverride: false,
    },
    settings: {},
    statistics: {},
    transports: {
      allowChangeStatus: false,
      allowForceClose: false,
    },
    visits: {},
  }

  const permissions: CloudAccessPermissions = {
    ...defaultPermissions,
    ...user?.cloudAccess,
    pos: {
      ...defaultPermissions.pos,
      ...(user?.cloudAccess as any)?.pos,
    },
  }

  const hasPermission = (permission: Permission): boolean => {
    // Support nested permissions with dot notation
    const keys = permission.split('.')
    let current: any = permissions

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        return false
      }
    }

    return Boolean(current)
  }

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(permission))
  }

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((permission) => hasPermission(permission))
  }

  // Helper function specifically for POS access
  const hasPOSAccess = (): boolean => {
    return hasPermission('pos.allowCashierAccess')
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasPOSAccess,
    permissions,
  }
}
