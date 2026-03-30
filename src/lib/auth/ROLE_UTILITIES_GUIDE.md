# Role Utilities Guide

All role-related functionality is now centralized in `src/lib/auth/roles.ts` for consistency across the app.

## Available Functions

### 1. `normalizeRole(role: any): UserRole`

Converts any value to a valid role, with fallback to 'customer'.

```typescript
import { normalizeRole } from '@/lib/auth/roles'

// Valid values
normalizeRole('admin')      // → 'admin'
normalizeRole('ADMIN')      // → 'admin'
normalizeRole(' admin ')    // → 'admin'

// Invalid/null values fallback to 'customer'
normalizeRole(null)         // → 'customer'
normalizeRole(undefined)    // → 'customer'
normalizeRole('invalid')    // → 'customer'
normalizeRole(123)          // → 'customer'
```

**Use this to:**
- Handle database values that might be NULL
- Ensure type safety when reading roles
- Prevent errors from invalid role values

### 2. `isValidRole(role: any): boolean`

Checks if a value is a valid role.

```typescript
import { isValidRole } from '@/lib/auth/roles'

isValidRole('admin')        // → true
isValidRole('customer')     // → true
isValidRole('invalid')      // → false
isValidRole(null)           // → false
```

**Use this to:**
- Validate user input before database updates
- API request validation
- Type guards in conditionals

### 3. `hasRole(userRole: UserRole | null, requiredRole: UserRole | 'any'): boolean`

Checks if a user has a specific role or higher (hierarchical).

Hierarchy: `admin (3) > partner (2) > customer (1)`

```typescript
import { hasRole } from '@/lib/auth/roles'

// Basic role check
hasRole('admin', 'partner')     // → true (admin ≥ partner)
hasRole('partner', 'partner')   // → true (partner ≥ partner)
hasRole('customer', 'partner')  // → false (customer < partner)

// Any role check
hasRole('customer', 'any')      // → true (any role matches)

// Null handling
hasRole(null, 'admin')          // → false (no role fails)
```

**Use this to:**
- Check permissions based on hierarchy
- Allow admins to do what partners can do
- Require minimum permission level

### 4. `getRoleDashboardPath(role: UserRole | null): string`

Returns the dashboard path for a role.

```typescript
import { getRoleDashboardPath } from '@/lib/auth/roles'

getRoleDashboardPath('admin')       // → '/admin'
getRoleDashboardPath('partner')     // → '/partner'
getRoleDashboardPath('customer')    // → '/dashboard'
getRoleDashboardPath(null)          // → '/dashboard'
```

**Use this to:**
- Redirect users to correct dashboard
- Generate navigation links
- Set redirect targets after login

### 5. `canAccessRoute(userRole: UserRole | null, requiredRoles: UserRole[]): boolean`

Checks if a user can access a route based on required roles.

```typescript
import { canAccessRoute } from '@/lib/auth/roles'

canAccessRoute('admin', ['admin'])                  // → true
canAccessRoute('admin', ['admin', 'partner'])      // → true
canAccessRoute('partner', ['admin'])               // → false
canAccessRoute(null, ['admin', 'partner'])         // → false
```

**Use this to:**
- Protect API endpoints
- Check route access in middleware
- Permission checks before showing UI

## Usage Examples

### Example 1: API Endpoint Protection

```typescript
// src/app/api/admin/stats/route.ts
import { NextRequest } from 'next/server'
import { canAccessRoute } from '@/lib/auth/roles'
import { getUserWithRole } from '@/lib/auth/guard'

export async function GET(req: NextRequest) {
  const { user, role } = await getUserWithRole()

  if (!canAccessRoute(role, ['admin'])) {
    return Response.json(
      { error: 'Admin access required' },
      { status: 403 }
    )
  }

  // Admin-only logic...
}
```

### Example 2: Frontend Role Check

```typescript
// src/components/Dashboard.tsx
import { normalizeRole, getRoleDashboardPath } from '@/lib/auth/roles'

export default function Dashboard({ userRole }: { userRole: string | null }) {
  const role = normalizeRole(userRole)  // Safe! Handles null/invalid
  const dashPath = getRoleDashboardPath(role)

  return (
    <div>
      <h1>Welcome, {role}</h1>
      <a href={dashPath}>Go to {role} dashboard</a>
    </div>
  )
}
```

### Example 3: Hierarchical Permission Check

```typescript
// src/lib/permissions.ts
import { hasRole } from '@/lib/auth/roles'

export function canManagePartners(userRole: string | null) {
  return hasRole(userRole, 'admin')  // Only admins can manage partners
}

export function canViewReports(userRole: string | null) {
  return hasRole(userRole, 'partner')  // Partners and admins can view reports
}

export function canEditProfile(userRole: string | null) {
  return hasRole(userRole, 'customer')  // Everyone can edit their profile
}
```

### Example 4: Middleware Role Checking

```typescript
// src/lib/supabase/middleware.ts
import { canAccessRoute, getRoleDashboardPath } from '@/lib/auth/roles'

if (request.nextUrl.pathname.startsWith('/admin')) {
  if (!canAccessRoute(role, ['admin'])) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
}

// Smart redirect to correct dashboard
if (request.nextUrl.pathname === '/dashboard') {
  const target = getRoleDashboardPath(role)
  if (target !== '/dashboard') {
    return NextResponse.redirect(new URL(target, request.url))
  }
}
```

## Constants

### `VALID_ROLES: UserRole[]`
```typescript
import { VALID_ROLES } from '@/lib/auth/roles'

// → ['admin', 'partner', 'customer']
VALID_ROLES.includes('admin')  // → true
```

### `DEFAULT_ROLE: UserRole`
```typescript
import { DEFAULT_ROLE } from '@/lib/auth/roles'

// → 'customer'
```

### `UserRole` Type
```typescript
import type { UserRole } from '@/lib/auth/roles'

// Valid types: 'admin' | 'partner' | 'customer'
const role: UserRole = 'admin'
```

## Files Using These Utilities

- ✅ `src/lib/auth/guard.ts` — imports and exports
- ✅ `src/app/api/me/role/route.ts` — normalizes role response
- ✅ `src/app/api/debug/me/route.ts` — shows dashboard path
- ✅ `src/lib/supabase/middleware.ts` — normalizes roles + redirects
- ✅ `src/app/api/admin/assign-role/route.ts` — validates roles

## Migration Guide

If you have existing code that doesn't use these utilities:

### Before
```typescript
// ❌ No fallback if role is null
const role = profile?.role || 'unknown'

// ❌ Hardcoded role checks
if (user.role === 'admin') { /* ... */ }

// ❌ Hardcoded dashboard paths
const path = role === 'admin' ? '/admin' : '/dashboard'
```

### After
```typescript
// ✅ Safe normalization
import { normalizeRole, canAccessRoute, getRoleDashboardPath } from '@/lib/auth/roles'

const role = normalizeRole(profile?.role)

// ✅ Use helper functions
if (canAccessRoute(role, ['admin'])) { /* ... */ }

// ✅ Use dashboard path helper
const path = getRoleDashboardPath(role)
```

## Testing

```typescript
import { normalizeRole, isValidRole, hasRole, getRoleDashboardPath, canAccessRoute } from '@/lib/auth/roles'

describe('Role Utilities', () => {
  test('normalizeRole handles null', () => {
    expect(normalizeRole(null)).toBe('customer')
  })

  test('isValidRole checks validity', () => {
    expect(isValidRole('admin')).toBe(true)
    expect(isValidRole('invalid')).toBe(false)
  })

  test('hasRole checks hierarchy', () => {
    expect(hasRole('admin', 'partner')).toBe(true)
    expect(hasRole('customer', 'admin')).toBe(false)
  })

  test('getRoleDashboardPath maps correctly', () => {
    expect(getRoleDashboardPath('admin')).toBe('/admin')
    expect(getRoleDashboardPath(null)).toBe('/dashboard')
  })

  test('canAccessRoute filters roles', () => {
    expect(canAccessRoute('admin', ['admin'])).toBe(true)
    expect(canAccessRoute('customer', ['admin'])).toBe(false)
  })
})
```

## Summary

| Function | Purpose | Use When |
|----------|---------|----------|
| `normalizeRole()` | Convert any value to valid role | Reading from DB/API |
| `isValidRole()` | Check if value is valid role | Validating user input |
| `hasRole()` | Check hierarchical permission | Checking minimum role |
| `getRoleDashboardPath()` | Get dashboard for role | Redirecting users |
| `canAccessRoute()` | Check exact role match | Protecting routes |

All these functions handle `null` gracefully and provide sensible defaults!
