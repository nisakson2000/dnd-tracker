/**
 * Z-Index Hierarchy — single source of truth for all layering.
 *
 * Layers (low → high):
 *   Base content → Sticky headers → Dropdowns → Tooltips →
 *   Modals → Toasts → Overlays → Dev tools
 */

const Z = {
  // Base content
  BASE: 0,
  RAISED: 1,

  // Sticky / fixed UI elements
  STICKY: 10,
  SIDEBAR: 15,
  TOPBAR: 20,
  FAB: 50,           // Floating action buttons

  // Interactive overlays (dropdowns, menus)
  DROPDOWN: 100,
  POPOVER: 200,
  TOOLTIP: 300,

  // Modals and dialogs
  MODAL_BACKDROP: 9000,
  MODAL: 9001,
  MODAL_NESTED: 9010,   // Modal on top of modal

  // Full-screen overlays
  OVERLAY: 9500,
  TUTORIAL: 9990,

  // System-level
  TOAST: 9999,
  COMMAND_PALETTE: 10000,

  // Dev tools (always on top)
  DEV_BANNER: 99997,
  DEV_TOOLS: 99998,
  DEV_OVERLAY: 99999,
};

export default Z;
