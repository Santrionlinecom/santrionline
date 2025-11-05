import type { AppRole } from '~/db/schema';

export const ADMIN_ROLES: ReadonlySet<AppRole> = new Set([
  'pengasuh',
  'pengurus',
  'admin_tech',
  'admin',
]);

export const HALAQOH_MANAGER_ROLES: ReadonlySet<AppRole> = new Set([
  'pengasuh',
  'pengurus',
  'asatidz',
  'admin_tech',
  'admin',
]);

export const OPERATIONAL_ROLES: ReadonlySet<AppRole> = new Set([
  'pengasuh',
  'pengurus',
  'wali_kelas',
  'asatidz',
  'admin_tech',
  'admin',
]);

export const WALISANTRI_VIEW_ROLES: ReadonlySet<AppRole> = new Set([
  'wali_santri',
  'pengasuh',
  'pengurus',
  'admin_tech',
  'admin',
]);

export function isAdminRole(role: AppRole | null | undefined): boolean {
  return role ? ADMIN_ROLES.has(role) : false;
}

export function canManageHalaqoh(role: AppRole | null | undefined): boolean {
  return role ? HALAQOH_MANAGER_ROLES.has(role) : false;
}

export function canValidateSetoran(role: AppRole | null | undefined): boolean {
  return role ? role === 'asatidz' || HALAQOH_MANAGER_ROLES.has(role) : false;
}

export function canRecordSetoran(role: AppRole | null | undefined): boolean {
  return role ? ['asatidz', 'pengurus', 'pengasuh', 'admin_tech', 'admin'].includes(role) : false;
}

export function canRecordExam(role: AppRole | null | undefined): boolean {
  return role ? ['asatidz', 'pengurus', 'pengasuh', 'admin_tech', 'admin'].includes(role) : false;
}

export function canAccessOperational(role: AppRole | null | undefined): boolean {
  return role ? OPERATIONAL_ROLES.has(role) : false;
}

export function canViewSantriProgress(role: AppRole | null | undefined): boolean {
  return role ? WALISANTRI_VIEW_ROLES.has(role) || role === 'santri' : false;
}
