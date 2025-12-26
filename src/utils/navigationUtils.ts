import { NavLink, VerticalNavItemsType } from 'src/@core/layouts/types'
import { Permission } from 'src/hooks/usePermissions'
import { UserTypes } from 'src/types/apps/userTypes'
import { isAIAgentEnabled } from './aiAgentUtils'

type HasPermissionFn = (permission: Permission) => boolean

export const filterNavigationByPermissions = (
  navItems: VerticalNavItemsType,
  hasPermission: HasPermissionFn,
  user?: UserTypes | null,
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
          user,
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

      // Check permission requirement
      if (
        navLink.permission &&
        !hasPermission(navLink.permission as Permission)
      ) {
        return null
      }

      // Check AI agent requirement
      if ('aiAgent' in navLink && navLink.aiAgent) {
        if (!user || !isAIAgentEnabled(user, navLink.aiAgent as string)) {
          return null
        }
      }

      return item
    })
    .filter(Boolean) as VerticalNavItemsType
}
