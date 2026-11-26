export const haptics = {
  enabled: true,

  buzz(pattern) {
    if (!this.enabled) return;

    try {
      if (globalThis.navigator?.userActivation?.hasBeenActive === false) return;

      if (typeof globalThis.navigator?.vibrate === 'function') {
        globalThis.navigator.vibrate(pattern);
      }
    } catch {
      // Vibration can be unavailable or blocked by the browser.
    }
  },
};
