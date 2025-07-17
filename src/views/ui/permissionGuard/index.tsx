import { ReactNode, cloneElement, isValidElement } from 'react'
import { usePermissions, Permission } from 'src/hooks/usePermissions'

interface PermissionGuardProps {
  children: ReactNode
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean // for multiple permissions
  fallback?: ReactNode
  disabled?: boolean
}

export const PermissionGuard = ({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback = null,
  disabled = false,
}: PermissionGuardProps) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions()

  // If disabled prop is present, render children with disabled prop
  if (disabled) {
    if (isValidElement(children)) {
      return cloneElement(children, { disabled: true } as any)
    }
    return <>{children}</>
  }

  let hasAccess = false

  if (permission) {
    hasAccess = hasPermission(permission)
  } else if (permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions)
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

export default PermissionGuard
