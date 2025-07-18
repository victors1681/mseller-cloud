import {
  VerticalNavItemsType,
  NavLink,
  NavGroup,
  NavSectionTitle,
} from 'src/@core/layouts/types'
import { Permission } from 'src/hooks/usePermissions'

type HasPermissionFn = (permission: Permission) => boolean

export const filterNavigationByPermissions = (
  navItems: VerticalNavItemsType,
  hasPermission: HasPermissionFn,
): VerticalNavItemsType => {
  return navItems
    .map((item) => {
      // Handle NavSectionTitle - no filtering needed
      if ('sectionTitle' in item) {
        return item
      }

      // Handle NavGroup with children
      if ('children' in item && item.children) {
        const filteredChildren = filterNavigationByPermissions(
          item.children,
          hasPermission,
        )

        // If the group has permission requirement, check it
        if (item.permission && !hasPermission(item.permission as Permission)) {
          return null
        }

        // If no children remain after filtering, hide the group
        if (filteredChildren.length === 0) {
          return null
        }

        return {
          ...item,
          children: filteredChildren,
        }
      }

      // Handle NavLink
      const navLink = item as NavLink
      if (
        navLink.permission &&
        !hasPermission(navLink.permission as Permission)
      ) {
        return null
      }

      return item
    })
    .filter(Boolean) as VerticalNavItemsType
}
