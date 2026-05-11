// ─────────────────────────────────────────────────────────────────────────────
// SoulfullBites — Permission System (Next.js Version)
// ─────────────────────────────────────────────────────────────────────────────

import { getUserFromCookies } from './user-auth.js';

export const ALL_PERMISSIONS = [
  { key: 'orders.view',          label: 'View all orders',        category: 'Orders' },
  { key: 'orders.view_own',      label: 'View own orders',        category: 'Orders' },
  { key: 'orders.update_status', label: 'Update order status',    category: 'Orders' },
  { key: 'orders.delete',        label: 'Delete orders',          category: 'Orders' },
  { key: 'orders.export',        label: 'Export orders CSV',      category: 'Orders' },
  { key: 'products.view',        label: 'View products',          category: 'Products' },
  { key: 'products.create',      label: 'Create products',        category: 'Products' },
  { key: 'products.edit',        label: 'Edit products',          category: 'Products' },
  { key: 'products.delete',      label: 'Delete products',        category: 'Products' },
  { key: 'cms.edit',             label: 'Edit site content',      category: 'CMS' },
  { key: 'faq.manage',           label: 'Manage FAQs',            category: 'CMS' },
  { key: 'media.upload',         label: 'Upload media',           category: 'Media' },
  { key: 'users.view',           label: 'View user list',         category: 'Users' },
  { key: 'users.create',         label: 'Create users',           category: 'Users' },
  { key: 'users.edit',           label: 'Edit users',             category: 'Users' },
  { key: 'users.delete',         label: 'Delete users',           category: 'Users' },
  { key: 'users.manage_roles',   label: 'Assign roles & permissions', category: 'Users' },
  { key: 'reviews.moderate',     label: 'Moderate reviews',       category: 'Reviews' },
  { key: 'profile.edit_own',     label: 'Edit own profile',       category: 'Profile' },
  { key: 'wishlist.manage',      label: 'Manage wishlist',        category: 'Profile' },
  { key: 'addresses.manage',     label: 'Manage saved addresses', category: 'Profile' },
];

export const ROLE_DEFAULTS = {
  ashu: ALL_PERMISSIONS.map((p) => p.key),
  staff: [
    'orders.view', 'orders.view_own', 'orders.update_status', 'orders.export',
    'products.view', 'products.create', 'products.edit',
    'cms.edit', 'faq.manage', 'media.upload',
    'users.view',
    'reviews.moderate',
    'profile.edit_own', 'wishlist.manage', 'addresses.manage',
  ],
  user: [
    'orders.view_own',
    'products.view',
    'profile.edit_own', 'wishlist.manage', 'addresses.manage',
  ],
};

export function resolvePermissions(jwtPayload) {
  const role = jwtPayload?.role || 'user';
  const basePerms = new Set(ROLE_DEFAULTS[role] || ROLE_DEFAULTS.user);
  const overrides = jwtPayload?.permissionOverrides || {};

  for (const [key, granted] of Object.entries(overrides)) {
    if (granted) basePerms.add(key);
    else basePerms.delete(key);
  }

  return Array.from(basePerms);
}

/**
 * Checks if the current authenticated user has a specific permission.
 */
export async function hasPermission(permissionKey) {
  const user = await getUserFromCookies();
  if (!user) return false;
  
  // owner role always has everything
  if (user.role === 'ashu') return true;

  const perms = resolvePermissions(user);
  return perms.includes(permissionKey);
}
