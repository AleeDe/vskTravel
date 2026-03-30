/**
 * Role Management Utilities
 * Ensures consistent role handling across the app
 */

export type UserRole = 'admin' | 'partner' | 'customer'

export const VALID_ROLES: UserRole[] = ['admin', 'partner', 'customer']
export const DEFAULT_ROLE: UserRole = 'customer'

/**
 * Normalize a role value - handles null, undefined, and invalid values
 */
export function normalizeRole(role: any): UserRole {
  if (!role || typeof role !== 'string') {
    return DEFAULT_ROLE
  }

  const normalized = role.toLowerCase().trim() as UserRole
  return VALID_ROLES.includes(normalized) ? normalized : DEFAULT_ROLE
}

/**
 * Check if a role is valid
 */
export function isValidRole(role: any): role is UserRole {
  return VALID_ROLES.includes(role as UserRole)
}

/**
 * Check if a user has a specific role or higher
 * Hierarchy: admin > partner > customer
 */
export function hasRole(userRole: UserRole | null, requiredRole: UserRole | 'any'): boolean {
  if (!userRole) {
    return false
  }

  if (requiredRole === 'any') {
    return true
  }

  const hierarchy: Record<UserRole, number> = {
    admin: 3,
    partner: 2,
    customer: 1,
  }

  return hierarchy[userRole] >= hierarchy[requiredRole]
}

/**
 * Get role-specific dashboard paths
 */
export function getRoleDashboardPath(role: UserRole | null): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'partner':
      return '/partner/dashboard'
    case 'customer':
    default:
      return '/dashboard'
  }
}

/**
 * Check if a role can access a protected route
 */
export function canAccessRoute(userRole: UserRole | null, requiredRoles: UserRole[]): boolean {
  if (!userRole) {
    return false
  }

  return requiredRoles.includes(userRole)
}
