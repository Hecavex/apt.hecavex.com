(() => {
  // Delegation also covers record fragments opened in the contextual dialog.
  document.addEventListener('click', async (event) => {
    const button = event.target.closest?.('[data-record-copy]');
    if (!button || button.disabled) return;
    const container = button.closest('[data-copy-container]');
    const status = container?.querySelector('[data-copy-status]');
    const value = button.dataset.copyValue;
    if (!container || !status || !value) return;
    container.querySelector('[data-copy-fallback]')?.remove();
    button.disabled = true;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(value);
      status.textContent = 'Copied.';
    } catch {
      status.textContent = 'Clipboard unavailable. Select and copy the text below.';
      const fallback = document.createElement('textarea');
      fallback.dataset.copyFallback = '';
      fallback.readOnly = true;
      fallback.rows = 3;
      fallback.value = value;
      fallback.setAttribute('aria-label', button.dataset.copyLabel || 'Text to copy');
      container.append(fallback);
      fallback.focus();
      fallback.select();
    } finally {
      button.disabled = false;
    }
  });
  document.documentElement.dataset.recordCopyReady = 'true';
})();
