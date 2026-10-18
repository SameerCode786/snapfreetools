const VIEWPORT_PRESETS = {
  your_screen: { width: 1280, height: 800, deviceScaleFactor: 1.0, isMobile: false, hasTouch: false },
  desktop_hd: { width: 1920, height: 1080, deviceScaleFactor: 1.0, isMobile: false, hasTouch: false },
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1.0, isMobile: false, hasTouch: false },
  tablet: { width: 768, height: 1024, deviceScaleFactor: 2.0, isMobile: true, hasTouch: true },
  mobile: { width: 320, height: 568, deviceScaleFactor: 2.0, isMobile: true, hasTouch: true }
};

const DEFAULT_VIEWPORT = { width: 1280, height: 800, deviceScaleFactor: 1.0, isMobile: false, hasTouch: false };

const MARGIN_PRESETS = {
  none: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
  small: { top: '5mm', right: '5mm', bottom: '5mm', left: '5mm' },
  big: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
};

const PAGE_SIZES = ['A4', 'Letter', 'Legal', 'A3', 'A5', 'OneLongPage'];

const MARGIN_REGEX = /^\d+(\.\d+)?(mm|cm|in|px)?$/i;

/**
 * Resolve Viewport options based on screenSize preset or custom width
 */
function resolveViewport(screenSize, customScreenWidth) {
  if (!screenSize) {
    return { ...DEFAULT_VIEWPORT };
  }

  if (screenSize === 'your_screen') {
    let width = 1280;
    if (typeof customScreenWidth === 'number' && Number.isInteger(customScreenWidth)) {
      if (customScreenWidth >= 320 && customScreenWidth <= 2560) {
        width = customScreenWidth;
      }
    }
    return {
      width,
      height: 800,
      deviceScaleFactor: 1.0,
      isMobile: false,
      hasTouch: false
    };
  }

  const preset = VIEWPORT_PRESETS[screenSize];
  if (preset) {
    return { ...preset };
  }

  return { ...DEFAULT_VIEWPORT };
}

/**
 * Resolve Margin options based on marginPreset or individual margins.
 * Precedence Rule:
 * 1. If marginPreset is 'none', 'small', or 'big', preset values override individual margins.
 * 2. If marginPreset is 'custom' or omitted, individual margins (marginTop, marginRight, etc.) are used,
 *    defaulting to '10mm' for any unprovided individual margin.
 */
function resolveMargins(settings = {}) {
  const { marginPreset, marginTop, marginRight, marginBottom, marginLeft } = settings;

  if (marginPreset && marginPreset !== 'custom' && MARGIN_PRESETS[marginPreset]) {
    return { ...MARGIN_PRESETS[marginPreset] };
  }

  return {
    top: (typeof marginTop === 'string' && MARGIN_REGEX.test(marginTop)) ? marginTop : '10mm',
    right: (typeof marginRight === 'string' && MARGIN_REGEX.test(marginRight)) ? marginRight : '10mm',
    bottom: (typeof marginBottom === 'string' && MARGIN_REGEX.test(marginBottom)) ? marginBottom : '10mm',
    left: (typeof marginLeft === 'string' && MARGIN_REGEX.test(marginLeft)) ? marginLeft : '10mm'
  };
}

/**
 * Canonical Normalization Function for PDF & Preview Rendering Options
 */
function normalizeRenderSettings(input = {}) {
  const viewport = resolveViewport(input.screenSize, input.customScreenWidth);
  const margins = resolveMargins(input);

  const rawPageSize = input.pageSize || 'A4';
  const pageSize = PAGE_SIZES.includes(rawPageSize) ? rawPageSize : 'A4';
  const isOneLongPage = pageSize === 'OneLongPage';

  // Orientation logic: OneLongPage forces portrait
  const orientation = isOneLongPage ? 'portrait' : (input.orientation === 'landscape' ? 'landscape' : 'portrait');

  const mediaType = input.mediaType === 'screen' ? 'screen' : 'print';

  let scale = 1.0;
  if (typeof input.scale === 'number' && Number.isFinite(input.scale)) {
    scale = Math.min(Math.max(input.scale, 0.1), 2.0);
  }

  // OneLongPage forces respectCssPageSize to false
  const respectCssPageSize = isOneLongPage ? false : Boolean(input.respectCssPageSize);

  return {
    screenSize: input.screenSize || null,
    customScreenWidth: input.customScreenWidth || null,
    viewport,
    pageSize,
    isOneLongPage,
    orientation,
    margins,
    mediaType,
    scale,
    printBackground: input.printBackground !== false,
    showFooter: Boolean(input.showFooter),
    respectCssPageSize,
    pageRanges: typeof input.pageRanges === 'string' && input.pageRanges.trim() !== '' ? input.pageRanges.trim() : undefined
  };
}

module.exports = {
  VIEWPORT_PRESETS,
  DEFAULT_VIEWPORT,
  MARGIN_PRESETS,
  PAGE_SIZES,
  resolveViewport,
  resolveMargins,
  normalizeRenderSettings
};
