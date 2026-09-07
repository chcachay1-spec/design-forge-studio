export type LicenseTier = 'free' | 'donor';

export interface UserLicense {
  tier: LicenseTier;
  exportsUsed: number;
  maxExports: number; // Always Infinity (999999) — no limits
  hasDonated?: boolean;
  donatedAt?: string;
}

const STORAGE_KEY = 'designforge_user_license';

// Default free license — unlimited exports, always
export const getDefaultLicense = (): UserLicense => ({
  tier: 'free',
  exportsUsed: 0,
  maxExports: 999999,
});

export const loadUserLicense = (): UserLicense => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultLicense();
    const parsed = JSON.parse(raw);
    // Migration: ensure maxExports is always unlimited
    parsed.maxExports = 999999;
    return parsed;
  } catch (e) {
    console.error('Error loading license:', e);
    return getDefaultLicense();
  }
};

export const saveUserLicense = (license: UserLicense): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(license));
  } catch (e) {
    console.error('Error saving license:', e);
  }
};

// Exports are always allowed — no restrictions
export const canUserExport = (_license: UserLicense): boolean => {
  return true;
};

export const recordExportUsed = (license: UserLicense): UserLicense => {
  const updated: UserLicense = {
    ...license,
    exportsUsed: license.exportsUsed + 1,
  };
  saveUserLicense(updated);
  return updated;
};

// Mark user as donor (called after voluntary donation)
export const markAsDonor = (): UserLicense => {
  const current = loadUserLicense();
  const updated: UserLicense = {
    ...current,
    tier: 'donor',
    hasDonated: true,
    donatedAt: new Date().toISOString(),
  };
  saveUserLicense(updated);
  return updated;
};

// Legacy key activation — kept for backward compatibility, but all exports are free
export const activateLicenseKey = (rawKey: string): { success: boolean; tier?: LicenseTier; message: string } => {
  const key = rawKey.trim().toUpperCase();
  if (!key) {
    return { success: false, message: 'No se proporcionó clave.' };
  }
  // Any key now just marks as donor
  const updated = markAsDonor();
  saveUserLicense(updated);
  return { success: true, tier: 'donor', message: '¡Gracias por tu apoyo! Todas las funciones ya son gratuitas.' };
};
