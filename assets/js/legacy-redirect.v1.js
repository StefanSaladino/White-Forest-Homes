/** Preserve campaign parameters and meaningful legacy anchors on static hosts. */
(() => {
  const target = document.querySelector('meta[name="redirect-target"]')?.content;
  if (!target) return;
  const destination = new URL(target, location.href);
  if (location.pathname.endsWith('/renovations-additions.html') && location.hash === '#additions') {
    destination.hash = 'additions';
  }
  destination.search = location.search;
  location.replace(destination);
})();
