/**
 * Deferred media hydration — entry video gets priority; after the gate opens,
 * images and videos load strictly one at a time in DOM order.
 */

const DEFAULT_CONFIG = {
  criticalSelectors: [
    '#main-content .ganesh-icon[data-src]',
  ],
  sequentialImageSelectors: [
    '#main-content img[data-src]',
  ],
  sequentialVideoSelector: '#main-content video',
};

let sequentialLoadStarted = false;

export function hydrateImage(img) {
  const url = img.dataset.src;
  if (!url) return;
  img.src = url;
  img.removeAttribute('data-src');
}

export function hydrateVideo(video) {
  const sources = video.querySelectorAll('source[data-src]');
  if (sources.length > 0) {
    sources.forEach((source) => {
      source.src = source.dataset.src;
      source.removeAttribute('data-src');
    });
    video.load();
  } else if (video.dataset.src) {
    video.src = video.dataset.src;
    video.removeAttribute('data-src');
    video.load();
  }
}

export function hydrateImageAsync(img) {
  return new Promise((resolve) => {
    if (!img.dataset.src) {
      resolve();
      return;
    }
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
    hydrateImage(img);
    if (img.complete && img.naturalWidth) done();
  });
}

export function hydrateVideoAsync(video) {
  return new Promise((resolve) => {
    const hasSource = video.querySelector('source[data-src]') || video.dataset.src;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    if (!hasSource) {
      finish();
      return;
    }
    const timeout = setTimeout(finish, 15000); // 15s max wait per video
    const onReady = () => {
      clearTimeout(timeout);
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('error', onReady);
      finish();
    };
    video.addEventListener('canplay', onReady);
    video.addEventListener('error', onReady);
    hydrateVideo(video);
  });
}

export function hydrateCriticalMedia() {
  DEFAULT_CONFIG.criticalSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach(hydrateImage);
  });
}

export async function startSequentialMediaLoad() {
  if (sequentialLoadStarted) return;
  sequentialLoadStarted = true;

  // 1. Load all sequential images one by one
  const imgs = Array.from(document.querySelectorAll(DEFAULT_CONFIG.sequentialImageSelectors.join(', ')));
  for (const img of imgs) {
    await hydrateImageAsync(img);
  }

  // 2. Load all videos one by one
  const videos = Array.from(document.querySelectorAll(DEFAULT_CONFIG.sequentialVideoSelector));
  for (const video of videos) {
    if (video.id === 'entry-video') continue;
    await hydrateVideoAsync(video);
  }
}

export function beginDeferredMediaLoad() {
  hydrateCriticalMedia();
  startSequentialMediaLoad();
}

export function hydrateAllDeferredMedia() {
  document.querySelectorAll('#main-content img[data-src]').forEach(hydrateImage);
  document.querySelectorAll('#main-content video').forEach((video) => {
    if (video.id === 'entry-video') return;
    hydrateVideo(video);
  });
}
