// The asset names below are keys in the JSON block at the end of this HTML.
// No image files or network requests are needed alongside the downloaded deck.
(() => {
  let assets;
  window.getEmbeddedAsset = name => {
    assets ??= JSON.parse(document.getElementById('embedded-assets').textContent);
    if (!Object.hasOwn(assets, name)) throw new Error(`Missing embedded asset: ${name}`);
    return assets[name];
  };

  // Downloading a live DOM must not copy the expanded data back into the body.
  window.prepareEmbeddedAssetDownload = page => {
    page.querySelectorAll('[data-asset-src]').forEach(element => element.removeAttribute('src'));
    page.querySelectorAll('[data-asset-style]').forEach(element => {
      element.style.removeProperty(element.dataset.assetProperty);
      if (!element.getAttribute('style')) element.removeAttribute('style');
    });
    const cover = page.querySelector('#cover-diorama');
    cover?.removeAttribute('srcdoc');
    for (const key of ['ready', 'loaded', 'paused', 'time']) cover?.removeAttribute(`data-${key}`);
  };

  // Run before the deck's own DOMContentLoaded handlers, once the footer exists.
  addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-asset-src]').forEach(element => {
      element.src = getEmbeddedAsset(element.dataset.assetSrc);
    });
    document.querySelectorAll('[data-asset-style]').forEach(element => {
      element.style.setProperty(element.dataset.assetProperty,
        `url("${getEmbeddedAsset(element.dataset.assetStyle)}")`);
    });
  }, { once: true });
})();
