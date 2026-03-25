// ─── STORAGE UTILITY ─────────────────────────────────────────────────────────
// Thin wrapper around localStorage with JSON serialization, debounced writes,
// bulk export/import, and automatic pruning of old daily keys.
//
// All app keys are namespaced with the "gd_" prefix so that export/import
// and pruning only touch GrindDesigned data.

export const DB = {
  /**
   * Read a value from localStorage.
   * @param {string} key
   * @param {*} defaultValue - returned when the key is absent or parsing fails
   * @returns {*}
   */
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  /**
   * Write a value to localStorage as JSON.
   * @param {string} key
   * @param {*} value
   * @returns {boolean} true on success
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Remove a key from localStorage.
   * @param {string} key
   */
  del(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },

  // Internal debounce timers keyed by storage key
  _timers: {},

  /**
   * Debounced write — coalesces rapid updates for the same key into one write.
   * Useful for high-frequency state (e.g. schedule edits) to avoid localStorage
   * thrashing.
   * @param {string} key
   * @param {*} value
   * @param {number} delay - ms to wait before flushing (default 500)
   */
  setDebounced(key, value, delay = 500) {
    clearTimeout(this._timers[key]);
    this._timers[key] = setTimeout(() => this.set(key, value), delay);
  },

  /**
   * Export all "gd_" prefixed keys as a plain object.
   * Used for the in-app data export feature.
   * @returns {Object}
   */
  exportAll() {
    try {
      const out = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("gd_")) {
          out[key] = this.get(key);
        }
      }
      return out;
    } catch {
      return {};
    }
  },

  /**
   * Import an object of "gd_" prefixed keys back into localStorage.
   * Non-"gd_" keys in the data object are silently ignored.
   * @param {Object} data
   */
  importAll(data) {
    try {
      Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith("gd_")) this.set(key, value);
      });
    } catch {
      // ignore
    }
  },

  /**
   * Delete daily keys older than 90 days.
   * Daily keys follow the pattern: gd_*_YYYY-MM-DD
   * Safe to call on app mount — runs synchronously over all keys.
   */
  pruneOld() {
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 90);

      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
      }

      keys.forEach((key) => {
        if (!key) return;
        const match = key.match(/gd_.*_(\d{4}-\d{2}-\d{2})$/);
        if (match && new Date(match[1]) < cutoff) {
          this.del(key);
        }
      });
    } catch {
      // ignore
    }
  },
};

// ─── DATE HELPERS ─────────────────────────────────────────────────────────────

/**
 * Format a Date (or today) as "YYYY-MM-DD".
 * @param {Date} [date]
 * @returns {string}
 */
export function dateKey(date) {
  return (date || new Date()).toISOString().split("T")[0];
}

/** Shorthand: key for today. */
export const todayKey = () => dateKey();

/**
 * Key for the Monday that starts the current ISO week.
 * @returns {string} "YYYY-MM-DD"
 */
export function getWeekKey() {
  const d   = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff)
    .toISOString()
    .split("T")[0];
}
