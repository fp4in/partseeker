// Centralized native bridge (Capacitor). На вебе все вызовы — безопасные no-op,
// поэтому компоненты можно вызывать одинаково и в браузере, и в приложении.
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform();

/* ---- Haptics (тактильный отклик) ---- */
const IMPACT = { light: ImpactStyle.Light, medium: ImpactStyle.Medium, heavy: ImpactStyle.Heavy };
export async function haptic(style = 'light') {
  if (!isNative) return;
  try { await Haptics.impact({ style: IMPACT[style] || ImpactStyle.Light }); } catch { /* ignore */ }
}

/* ---- Share (нативное «Поделиться» с веб-фолбэком) ---- */
export async function shareContent({ title, text, url }) {
  if (isNative) {
    try { await Share.share({ title, text, url, dialogTitle: title }); return 'shared'; }
    catch { return false; }
  }
  if (typeof navigator !== 'undefined' && navigator.share) {
    try { await navigator.share({ title, text, url }); return 'shared'; }
    catch { return false; }
  }
  // фолбэк: копируем в буфер обмена
  try {
    await navigator.clipboard.writeText([text, url].filter(Boolean).join(' '));
    return 'copied';
  } catch { return false; }
}

/* ---- Status bar под текущую тему ---- */
export async function syncStatusBar(theme) {
  if (!isNative) return;
  try {
    // Style.Light = тёмные иконки (для светлого фона); Style.Dark = светлые иконки.
    await StatusBar.setStyle({ style: theme === 'light' ? Style.Light : Style.Dark });
    if (platform === 'android') {
      await StatusBar.setBackgroundColor({ color: theme === 'light' ? '#f4f6fb' : '#0b0d14' });
    }
  } catch { /* ignore */ }
}

/* ---- Splash ---- */
export async function hideSplash() {
  if (!isNative) return;
  try { await SplashScreen.hide(); } catch { /* ignore */ }
}

/* ---- Аппаратная кнопка «Назад» (Android) ----
   Компоненты регистрируют обработчики; при нажатии вызываются по убыванию
   приоритета (а при равенстве — последний зарегистрированный первым).
   Первый обработчик, вернувший true, «поглощает» нажатие. Если никто не
   обработал — выходим из приложения. */
const backHandlers = []; // { fn, priority, seq }
let seqCounter = 0;

export function registerBack(fn, priority = 0) {
  const entry = { fn, priority, seq: seqCounter++ };
  backHandlers.push(entry);
  return () => {
    const i = backHandlers.indexOf(entry);
    if (i >= 0) backHandlers.splice(i, 1);
  };
}

export async function initBackButton() {
  if (!isNative) return () => {};
  const handle = await App.addListener('backButton', () => {
    const ordered = [...backHandlers].sort((a, b) =>
      b.priority - a.priority || b.seq - a.seq
    );
    for (const h of ordered) {
      try { if (h.fn()) return; } catch { /* ignore */ }
    }
    App.exitApp();
  });
  return () => handle.remove();
}
