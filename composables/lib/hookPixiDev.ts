export function hookPixiDev(window?: any, PIXI?: any) {
  window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
    window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI })
}
