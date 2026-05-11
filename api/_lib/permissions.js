// ─────────────────────────────────────────────────────────────────────────────
// SoulfullBites — Permission System (Drupal-style RBAC)
// ─────────────────────────────────────────────────────────────────────────────

import { json } from './http.js';

/** All permission keys and metadata. */
export const ALL_PERMISSIONS = [
  // Orders
  { key: 'orders.view',          label: 'View all orders',        category: 'Orders' },
  { key: 'orders.view_own',      label: 'View own orders',        category: 'Orders' },
  { key: 'orders.update_status', label: 'Update order status',    category: 'Orders' },
  { key: 'orders.delete',        label: 'Delete orders',          category: 'Orders' },
  { key: 'orders.export',        label: 'Export orders CSV',      category: 'Orders' },
  // Products
  { key: 'products.view',        label: 'View products',          category: 'Products' },
  { key: 'products.create',      label: 'Create products',        category: 'Products' },
  { key: 'products.edit',        label: 'Edit products',          category: 'Products' },
  { key: 'products.delete',      label: 'Delete products',        category: 'Products' },
  // CMS
  { key: 'cms.edit',             label: 'Edit site content',      category: 'CMS' },
  { key: 'faq.manage',           label: 'Manage FAQs',            category: 'CMS' },
  { key: 'media.upload',         label: 'Upload media',           category: 'Media' },
  // Users (admin-only by default)
  { key: 'users.view',           label: 'View user list',         category: 'Users' },
  { key: 'users.create',         label: 'Create users',           category: 'Users' },
  { key: 'users.edit',           label: 'Edit users',             category: 'Users' },
  { key: 'users.delete',         label: 'Delete users',           category: 'Users' },
  { key: 'users.manage_roles',   label: 'Assign roles & permissions', category: 'Users' },
  // Reviews
  { key: 'reviews.moderate',     label: 'Moderate reviews',       category: 'Reviews' },
  // Profile (self)
  { key: 'profile.edit_own',     label: 'Edit own profile',       category: 'Profile' },
  { key: 'wishlist.manage',      label: 'Manage wishlist',        category: 'Profile' },
  { key: 'addresses.manage',     label: 'Manage saved addresses', category: 'Profile' },
];

/** Default permissions granted to each role. */
export const ROLE_DEFAULTS = {
  ashu: ALL_PERMISSIONS.map((p) => p.key), // Ashu (owner) gets EVERYTHING
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

/**
 * Resolve effective permissions for a user.
 * Merges role defaults with per-user overrides from the JWT.
 * @param {object} jwtPayload - decoded JWT payload { role, permissionOverrides }
 * @returns {string[]} effective permission keys
 */
export function resolvePermissions(jwtPayload) {
  const role = jwtPayload?.role || 'user';
  const basePerms = new Set(ROLE_DEFAULTS[role] || ROLE_DEFAULTS.user);
  const overrides = jwtPayload?.permissionOverrides || {};

  for (const [key, granted] of Object.entries(overrides)) {
    if (granted) {
      basePerms.add(key);
    } else {
      basePerms.delete(key);
    }
  }

  return Array.from(basePerms);
}

/**
 * Express-style middleware that checks a permission.
 * Returns false and sends a 401/403 if unauthorized.
 * @param {object} req
 * @param {object} res
 * @param {string} permissionKey
 * @returns {boolean}
 */
export function requirePermission(req, res, permissionKey) {
  const user = req._user; // Attached by getUserFromRequest()

  if (!user) {
    json(res, 401, { error: 'Authentication required' });
    return false;
  }

  const perms = resolvePermissions(user);

  if (!perms.includes(permissionKey)) {
    json(res, 403, { error: `Access denied. Missing permission: ${permissionKey}` });
    return false;
  }

  return true;
}
