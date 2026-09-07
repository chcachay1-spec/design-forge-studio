export type LicenseTier = 'free' | 'starter' | 'studio';

export interface UserLicense {
  tier: LicenseTier;
  key?: string;
  exportsUsed: number;
  maxExports: number; // 1 for free trial, 10 for starter ($5), Infinity (999999) for studio ($10)
  purchasedAt?: string;
}

const STORAGE_KEY = 'designforge_user_license';

// Default free license with 1 courtesy export
export const getDefaultLicense = (): UserLicense => ({
  tier: 'free',
  exportsUsed: 0,
  maxExports: 1,
});

export const loadUserLicense = (): UserLicense => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultLicense();
    return JSON.parse(raw);
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

export const canUserExport = (license: UserLicense): boolean => {
  if (license.tier === 'studio') return true;
  return license.exportsUsed < license.maxExports;
};

export const recordExportUsed = (license: UserLicense): UserLicense => {
  const updated: UserLicense = {
    ...license,
    exportsUsed: license.exportsUsed + 1,
  };
  saveUserLicense(updated);
  return updated;
};

// Validates license codes (e.g. from Gumroad / Lemon Squeezy or VIP keys)
export const activateLicenseKey = (rawKey: string): { success: boolean; tier?: LicenseTier; message: string } => {
  const key = rawKey.trim().toUpperCase();

  if (!key) {
    return { success: false, message: 'Por favor ingresa una clave de licencia.' };
  }

  // Studio ($10) unlimited keys
  if (
    key === 'FORGEPRO2026' ||
    key === 'FORGE-STUDIO-VIP' ||
    key === 'FORGE-PRO-VIP' ||
    key.startsWith('FORGE-STUDIO-') ||
    key.startsWith('STUDIO-')
  ) {
    const newLicense: UserLicense = {
      tier: 'studio',
      key,
      exportsUsed: 0,
      maxExports: 999999,
      purchasedAt: new Date().toISOString(),
    };
    saveUserLicense(newLicense);
    return { success: true, tier: 'studio', message: '¡Plan Studio Pro ($10) activado! Exportaciones ilimitadas.' };
  }

  // Starter ($5) keys (10 exports)
  if (
    key === 'FORGE-STARTER-10' ||
    key === 'STARTER5' ||
    key.startsWith('FORGE-STARTER-') ||
    key.startsWith('FORGE-5-') ||
    key.startsWith('STARTER-')
  ) {
    const newLicense: UserLicense = {
      tier: 'starter',
      key,
      exportsUsed: 0,
      maxExports: 10,
      purchasedAt: new Date().toISOString(),
    };
    saveUserLicense(newLicense);
    return { success: true, tier: 'starter', message: '¡Plan Starter ($5) activado! 10 exportaciones disponibles.' };
  }

  // Generic FORGE- key defaults to Starter or Studio
  if (key.startsWith('FORGE-')) {
    const newLicense: UserLicense = {
      tier: 'studio',
      key,
      exportsUsed: 0,
      maxExports: 999999,
      purchasedAt: new Date().toISOString(),
    };
    saveUserLicense(newLicense);
    return { success: true, tier: 'studio', message: '¡Licencia Pro activada con éxito!' };
  }

  return { 
    success: false, 
    message: 'Clave no reconocida. Utiliza tu clave de Lemon Squeezy / Gumroad o la demo FORGEPRO2026.' 
  };
};
