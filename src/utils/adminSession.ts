const base = (import.meta.env.VITE_SUPABASE_URL as string || '').replace(/\/$/, '');
const endpoint = `${base}/functions/v1/admin-session`;
const TOKEN_KEY = 'zk_admin_session_token';
const DEVICE_KEY = 'zk_admin_device_id';
const AUTHED_KEY = 'zk_admin_authed';
const PASSWORD_UPGRADE_KEY='zk_admin_password_upgrade_required';
// نشست ادمین پیش‌فرض در sessionStorage ذخیره می‌شود تا توکن در storage ماندگار
// (که در برابر XSS ماندگار آسیب‌پذیرتر است) باقی نماند. اگر کاربر با بیومتریک
// «اعتماد به این دستگاه» را انتخاب کرده باشد، با کلید جدا در localStorage به آن
// Device سوئیچ می‌کنیم.
const BIOMETRIC_TRUST_KEY = 'zk_admin_biometric_trusted';
const wantsPersistent = (): boolean => {
  try { return (typeof localStorage !== 'undefined') && localStorage.getItem(BIOMETRIC_TRUST_KEY) === '1'; } catch { return false; }
};
const pickStore = (): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> => {
  if (typeof sessionStorage !== 'undefined' && !wantsPersistent()) return sessionStorage;
  if (typeof localStorage !== 'undefined') return localStorage;
  return { getItem: () => null, setItem: () => {}, removeItem: () => {} } as any;
};
const STORE: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> = pickStore();
const deviceInfo = () => ({
  device_name: `${navigator.platform || 'Device'} · ${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}`,
  platform: navigator.platform || 'Unknown',
  browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Browser',
  user_agent: navigator.userAgent,
});
export async function adminSessionAction(action: string, payload: Record<string, unknown> = {}) {
  let res: Response;
  try {
    res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, ...payload }) });
  } catch (e: any) {
    console.error('[admin-session] network error', e);
    throw new Error(e?.message?.includes('Failed to fetch') ? 'اتصال به سرور برقرار نشد. VPN را خاموش کنید یا اینترنت را بررسی کنید.' : (e?.message || 'خطا در ارتباط با سرویس امنیت'));
  }
  const text = await res.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    console.error('[admin-session] non-JSON response', res.status, text.slice(0,500));
    if (res.status >= 500) throw new Error(`سرور موقتاً در دسترس نیست (${res.status}). لطفاً ۱ دقیقه بعد دوباره تلاش کنید.`);
    throw new Error(`خطا در ارتباط با سرویس امنیت (${res.status})`);
  }
  if (!res.ok) throw new Error(data?.message || data?.error || `خطا در ارتباط با سرویس امنیت (${res.status})`);
  return data;
}
export async function loginAdminSession(phone: string, password: string) {
  const data = await adminSessionAction('login', { phone, password, ...deviceInfo() });
  STORE.setItem(TOKEN_KEY, data.sessionToken);
  STORE.setItem(DEVICE_KEY, data.deviceId);
  STORE.setItem(AUTHED_KEY,'true');
  if(data?.mustChangePassword===true)STORE.setItem(PASSWORD_UPGRADE_KEY,'true');else STORE.removeItem(PASSWORD_UPGRADE_KEY);
  try {
    const ls = typeof localStorage !== 'undefined' ? localStorage : null;
    if (ls) {
      if (data?.biometricEnrolled === true || data?.trustedDevice === true) ls.setItem(BIOMETRIC_TRUST_KEY, '1');
      ls.setItem('zk_admin_login_at', String(Date.now()));
    }
  } catch {}
  return data;
}
export const getAdminSessionToken = () => STORE.getItem(TOKEN_KEY) || '';
export const getAdminDeviceId = () => STORE.getItem(DEVICE_KEY) || '';
export const clearAdminSession=()=>{STORE.removeItem(TOKEN_KEY);STORE.removeItem(DEVICE_KEY);STORE.removeItem(AUTHED_KEY);STORE.removeItem(PASSWORD_UPGRADE_KEY);try{if(typeof localStorage!=='undefined'){localStorage.removeItem(BIOMETRIC_TRUST_KEY);localStorage.removeItem('zk_admin_login_at');}}catch{}};
export const isAdminPasswordUpgradeRequired=()=>STORE.getItem(PASSWORD_UPGRADE_KEY)==='true';

export async function revokeAllAdminSessions(): Promise<void> {
  const token = getAdminSessionToken();
  if (!token) return;
  const data = await adminSessionAction('revoke_all', { sessionToken: token });
  if (data?.revoked !== true) throw new Error(data?.message || data?.error || 'خروج از همه نشست‌ها انجام نشد');
  clearAdminSession();
}

export async function listAdminDevices(): Promise<any[]> {
  const token = getAdminSessionToken();
  if (!token) return [];
  const data = await adminSessionAction('list_devices', { sessionToken: token });
  return Array.isArray(data?.devices) ? data.devices : [];
}

export async function revokeAdminDevice(deviceId: string): Promise<void> {
  const token = getAdminSessionToken();
  if (!token) return;
  const data = await adminSessionAction('revoke_device', { deviceId, sessionToken: token });
  if (data?.revoked !== true) throw new Error(data?.message || data?.error || 'خروج این دستگاه انجام نشد');
}

const CRED_ENDPOINT = `${base}/functions/v1/admin-credentials`;

async function credAction(action: string, payload: Record<string, unknown> = {}): Promise<any> {
  const token = getAdminSessionToken();
  const res = await fetch(CRED_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ action, ...payload }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || data?.message || 'خطا در ارتباط با سرویس امنیت');
  return data;
}

export async function getAdminCredsInfo(): Promise<{ phoneMasked: string }> {
  const data = await credAction('get_info');
  return { phoneMasked: data?.phoneMasked || '' };
}

export async function changeAdminCredentials(opts: {
  currentPassword: string;
  newPhone?: string;
  newPassword?: string;
}): Promise<void> {
  const data = await credAction('change_credentials', {
    currentPassword: opts.currentPassword,
    ...(opts.newPhone ? { newPhone: opts.newPhone } : {}),
    ...(opts.newPassword ? { newPassword: opts.newPassword } : {}),
  });
  if(data?.ok!==true)throw new Error(data?.error||'تغییر اطلاعات ورود انجام نشد');
  STORE.removeItem(PASSWORD_UPGRADE_KEY);
}

export async function validateAdminSession(): Promise<{ valid: boolean; ownerPhone?: string }> {
  const token = getAdminSessionToken();
  if (!token) { clearAdminSession(); return { valid: false }; }
  try {
    const data = await adminSessionAction('validate_session', { sessionToken: token });
    if (data?.valid === true) { STORE.setItem(AUTHED_KEY, 'true'); return { valid: true, ownerPhone: data.ownerPhone }; }
    clearAdminSession();
    return { valid: false };
  } catch {
    clearAdminSession();
    return { valid: false };
  }
}
