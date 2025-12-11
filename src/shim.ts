// Firefox extension RAF shim
if (typeof window !== "undefined") {
  // In Firefox content scripts, requestAnimationFrame must be called with window as `this`
  // Wrap the native function to ensure proper context
  const nativeRAF = window.requestAnimationFrame;
  const nativeCAF = window.cancelAnimationFrame;

  // @ts-ignore - Override global to fix library calls
  window.requestAnimationFrame = function (
    callback: FrameRequestCallback,
  ): number {
    return nativeRAF.call(window, callback);
  };

  // @ts-ignore - Override global to fix library calls
  window.cancelAnimationFrame = function (id: number): void {
    return nativeCAF.call(window, id);
  };

  globalThis.requestAnimationFrame = window.requestAnimationFrame;
  globalThis.cancelAnimationFrame = window.cancelAnimationFrame;
} else {
  // Fallback for non-window contexts (background/service workers)
  let lastTime = 0;
  globalThis.requestAnimationFrame = (callback) => {
    const now = performance.now();
    const timeout = Math.max(0, 16.7 - (now - lastTime)); // ~60fps
    const id: number = setTimeout(
      () => callback(now + timeout),
      timeout,
    ) as unknown as number;
    lastTime = now + timeout;
    return id;
  };
  globalThis.cancelAnimationFrame = (id) =>
    clearTimeout(id as unknown as number);
}
