# Performance Optimizations: A Deep Dive

This document provides a technical deep-dive into the performance optimizations implemented to improve PageSpeed Insights scores from 87 to 90+. Each section explains the underlying browser mechanisms, network protocols, and rendering pipelines that make these optimizations effective.

## 1. Image Optimization: Formats, Lazy Loading, and Delivery

### Problem: 132 KiB Savings Opportunity

Modern web images are one of the largest contributors to page weight. Without optimization, browsers download unnecessarily large files, blocking the critical rendering path and delaying Largest Contentful Paint (LCP).

### Solution 1: Modern Image Formats (AVIF/WebP)

```typescript
images: {
  formats: ["image/avif", "image/webp"],
  // ...
}
```

**How it works:**

- **AVIF (AV1 Image File Format)**: Uses the AV1 video codec's intra-frame compression. Achieves 50% better compression than JPEG at equivalent quality.
- **WebP**: Google's format with both lossy and lossless compression. ~30% smaller than JPEG.

**Browser mechanism:**
When a browser encounters an `<img>` tag with a `srcset`, it:

1. Checks the `Accept` header it sent (via `accept` attribute or browser capabilities)
2. Matches available formats against supported MIME types
3. Selects the smallest supported format

**Network impact:**

- Smaller payloads = faster transfer times
- Reduced bandwidth usage on mobile networks
- Lower server costs for CDN bandwidth

**Trade-offs:**

- Fallback chain: AVIF → WebP → JPEG ensures compatibility
- Encoding time during build is slightly longer
- Browser support: AVIF is ~85% globally, WebP is ~96%

### Solution 2: Responsive Image Sizes

```typescript
deviceSizes: [640, 750, 828, 1080, 1200, 1920],
imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
```

**Problem:** Mobile devices don't need 1920px wide images, but desktop does. Sending large images to mobile wastes bandwidth.

**How it works:**

- Next.js generates multiple image sizes using Sharp
- The browser uses `srcset` with `sizes` attribute to select appropriate size
- `sizes="(max-width: 768px) 100vw, 661px"` tells browser:
  - On mobile: image is 100% viewport width
  - On desktop: image is 661px

**Browser decision algorithm:**

1. Calculate effective pixel density (devicePixelRatio)
2. Determine required image width based on `sizes` attribute
3. Select smallest image that meets or exceeds requirements
4. Avoids downloading images larger than needed

### Solution 3: Lazy Loading

```typescript
<Image
  src="/clouds.jpg"
  loading="lazy"
  // ...
/>
```

**Problem:** Images below the fold (not immediately visible) still load immediately, competing with critical resources for bandwidth.

**How it works:**

- Native browser `loading="lazy"` uses Intersection Observer API
- Browser defers loading until image is within ~1000px of viewport
- No JavaScript needed - it's built into the browser

**Rendering pipeline impact:**

- Initial HTML parse doesn't trigger image downloads
- Network bandwidth prioritized for critical resources
- Images load as user scrolls, improving perceived performance

**Technical details:**

```javascript
// Simplified browser behavior
if (img.loading === "lazy") {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.src = entry.target.dataset.src;
        }
      });
    },
    { rootMargin: "1000px" }
  );
  observer.observe(img);
}
```

### Solution 4: Image Quality Optimization

```typescript
quality={75} // vs previous 70
```

**Quality vs file size curve:**

- Quality 100: ~5x file size of quality 70, minimal visual difference
- Quality 75: Sweet spot - ~15% larger than 70, but better perceived quality
- Quality 70: Smaller, but may show compression artifacts on photos

**Visual perception:**
Human eye is more sensitive to certain types of compression artifacts. Quality 75 typically eliminates visible artifacts while maintaining good compression ratios.

## 2. JavaScript Optimization: Tree-Shaking, Minification, and Code Splitting

### Problem: 73 KiB Unused JavaScript + 12 KiB Legacy JavaScript

JavaScript bundles often contain code that's never executed. This increases parse time, compile time, and memory usage.

### Solution 1: Package Import Optimization

```typescript
experimental: {
  optimizePackageImports: ["framer-motion", "lucide-react"],
}
```

**Problem:**

```javascript
// Without optimization
import { motion } from "framer-motion";
// Bundles entire framer-motion library (~250KB)

// Common pattern in libraries:
export * from "./motion";
export * from "./drag";
export * from "./gestures";
// ... 50+ more exports
```

**How Next.js optimizes:**

1. **Static analysis**: During build, Next.js analyzes import paths
2. **Barrel file resolution**: Identifies barrel exports (index files that re-export)
3. **Direct import transformation**:

   ```javascript
   // Transforms this:
   import { motion } from "framer-motion";

   // To this:
   import { motion } from "framer-motion/dist/es/motion";
   ```

4. **Tree-shaking**: Webpack/Rollup can now eliminate unused exports more effectively

**Impact:**

- Framer Motion: ~250KB → ~50KB (80% reduction)
- Lucide React: ~500KB → ~20KB per icon used (96% reduction)

### Solution 2: SWC Minification

```typescript
swcMinify: true; // Enabled by default in Next.js 13+
```

**SWC (Speedy Web Compiler)** is a Rust-based compiler that's 20x faster than Babel.

**Minification process:**

1. **Variable name mangling**: Shortens identifiers

   ```javascript
   // Before
   function calculateTotalPrice(items) {
     return items.reduce((sum, item) => sum + item.price, 0);
   }

   // After
   function a(b) {
     return b.reduce((c, d) => c + d.price, 0);
   }
   ```

2. **Dead code elimination**: Removes unreachable code
3. **Constant folding**: Evaluates constant expressions at build time
4. **Function inlining**: Inlines small functions
5. **Removes whitespace and comments**

**Why SWC matters:**

- Rust implementation = native performance
- Parallel compilation
- Better dead code elimination than Terser
- Integrated with Next.js build pipeline

### Solution 3: Console Removal in Production

```typescript
compiler: {
  removeConsole: process.env.NODE_ENV === "production",
}
```

**Problem:** `console.log()` statements:

- Add bytes to bundle
- Create function call overhead
- Can leak information in production

**SWC transformation:**

```javascript
// Development
console.log("Debug info");

// Production (removed entirely)
// (nothing)
```

**Impact:** Typically saves 2-5KB, but more importantly, removes runtime overhead.

## 3. Third-Party Script Optimization: Defer, Lazy Loading, and Resource Hints

### Problem: Render-Blocking Scripts

Scripts in `<head>` block HTML parsing until they download and execute, delaying First Contentful Paint (FCP).

### Solution 1: Lazy Loading Third-Party Scripts

```typescript
// Before (in <head>)
<script src="https://w.soundcloud.com/player/api.js" async />

// After (in <body> with Next.js Script component)
<Script
  src="https://w.soundcloud.com/player/api.js"
  strategy="lazyOnload"
  crossOrigin="anonymous"
/>
```

**Script Loading Strategies:**

1. **`async` (previous approach):**

   - Downloads in parallel with HTML parsing
   - Executes immediately when downloaded
   - Can execute out of order
   - Still blocks rendering if script executes before parsing completes

2. **`defer`:**

   - Downloads in parallel
   - Executes after HTML parsing completes
   - Maintains execution order
   - Doesn't block rendering

3. **`lazyOnload` (Next.js specific):**
   - Doesn't download until `window.load` event fires
   - `window.load` fires after all critical resources loaded
   - Perfect for non-critical third-party scripts

**Browser parsing timeline:**

```
HTML Parse Start
  ↓
Critical CSS loaded
  ↓
Render blocking scripts execute
  ↓
FCP (First Contentful Paint) ← We want this ASAP
  ↓
window.load event fires
  ↓
Lazy scripts start downloading ← Non-critical scripts here
```

**Impact on metrics:**

- FCP: Improves by not blocking initial render
- TBT (Total Blocking Time): Reduces by deferring non-critical JS execution
- LCP: Better because critical resources aren't competing for bandwidth

### Solution 2: Resource Hints (Preconnect, DNS-Prefetch)

```typescript
<link rel="preconnect" href="https://api-widget.soundcloud.com" />
<link rel="dns-prefetch" href="https://w.soundcloud.com" />
```

**Problem:** When browser encounters third-party domain for first time:

1. DNS lookup (~20-120ms)
2. TCP handshake (~100-200ms)
3. TLS negotiation (~100-200ms)
4. Total: ~220-520ms before first byte

**How preconnect works:**

```
Browser encounters preconnect hint
  ↓
Immediately starts:
  - DNS lookup
  - TCP handshake
  - TLS negotiation
  ↓
Connection ready and warm
  ↓
When script actually needs to load → instant connection
```

**DNS-prefetch vs preconnect:**

- **DNS-prefetch**: Only resolves DNS (faster, but less benefit)
- **Preconnect**: Full connection setup (more bandwidth upfront, but eliminates latency)

**Network stack layers:**

```
Application Layer (HTTP)
  ↓
TLS Layer (HTTPS)
  ↓
Transport Layer (TCP)
  ↓
Network Layer (IP)
  ↓
Link Layer (DNS resolution)
```

Preconnect warms all layers above DNS.

### Solution 3: Cross-Origin Anonymous

```typescript
crossOrigin = "anonymous";
```

**CORS and caching:**

- Without `crossorigin`: Browser uses "no-cors" mode
- With `crossorigin="anonymous"`: Browser validates CORS headers
- Validated responses are cacheable in HTTP cache
- Without validation, browser may not cache cross-origin resources

**Impact:** Allows HTTP cache to store third-party scripts, reducing repeat downloads.

## 4. Font Optimization: Display Swap and Preloading

### Problem: Flash of Invisible Text (FOIT)

Default font loading behavior:

1. Browser discovers font in CSS
2. Waits up to 3 seconds for font to download
3. Text is invisible during this time
4. Falls back to system font if timeout

This creates poor user experience and delays FCP/LCP.

### Solution 1: Font Display Swap

```typescript
const inter = Inter({
  display: "swap",
  // ...
});
```

**How `font-display: swap` works:**

```
Font request sent
  ↓
Browser immediately renders text with fallback font
  ↓
When custom font loads → swaps in seamlessly
```

**Font display strategies:**

- `block`: Text invisible up to 3s (bad for performance)
- `swap`: Immediate fallback, swap when ready (good for performance)
- `fallback`: 100ms block, then swap (balanced)
- `optional`: Only use if already cached (prevents layout shift)

**Impact on metrics:**

- **FCP**: Text appears immediately instead of after font loads
- **LCP**: Hero text renders faster
- **CLS**: With proper font metrics, no layout shift on swap

### Solution 2: Font Preloading

```typescript
preload: true; // Next.js automatically generates preload link
```

**How it works:**
Next.js generates:

```html
<link
  rel="preload"
  href="/_next/static/media/inter.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
```

**Why preload fonts:**

- Fonts are discoverable in CSS, but CSS loads after HTML
- Preload hints browser to fetch font early
- Font download starts parallel to CSS download
- Font ready when CSS needs it

**Browser font loading timeline:**

```
HTML Parse
  ↓
Preload link discovered → Font download starts
  ↓
CSS loaded → Font already downloading/downloaded
  ↓
No waiting for font → Immediate render
```

## 5. Caching Strategy: HTTP Headers and Cache-Control

### Problem: Repeat Visitors Re-download Unchanged Assets

Without proper cache headers, browsers re-download assets on every visit, wasting bandwidth and increasing load times.

### Solution: Cache-Control Headers

```typescript
async headers() {
  return [
    {
      source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|mp3|mp4)",
      headers: [{
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      }],
    },
  ];
}
```

**Cache-Control directives explained:**

1. **`public`**: Response can be cached by any cache (CDN, browser, proxy)

   - vs `private`: Only browser can cache
   - Necessary for CDN caching

2. **`max-age=31536000`**: Cache for 1 year (in seconds)

   - After this time, browser revalidates with server
   - For static assets with content hashing, this is safe

3. **`immutable`**: Tells browser asset will never change
   - Browser skips revalidation requests
   - Next.js adds content hashes to filenames: `/image.abc123.jpg`
   - If hash changes, it's a different file → cache miss is correct

**HTTP caching flow:**

```
Browser Request
  ↓
Check cache
  ↓
Cache hit? (and not expired)
  ↓ YES → Serve from cache (0ms latency)
  ↓ NO
  ↓
Request from server
  ↓
Receive response with Cache-Control
  ↓
Store in cache with expiration
```

**Cache validation (when expired):**

```
Cache expired
  ↓
Browser sends: If-None-Match: "abc123"
  ↓
Server checks: ETag matches?
  ↓ YES → 304 Not Modified (small response, no body)
  ↓ NO → 200 OK with new content
```

**Impact:**

- **First visit**: No change (still downloads)
- **Repeat visits**: Instant load from cache (0ms network time)
- **Bandwidth savings**: Massive reduction in data transfer
- **Server load**: Reduced requests for static assets

## 6. Resource Preloading: Critical Assets

### Solution: Preload Critical Background Image

```typescript
<link
  rel="preload"
  href="/seabirds-background.jpg"
  as="image"
  type="image/jpeg"
/>
```

**Problem:** Background image loaded via CSS:

```css
.textured-background::before {
  background-image: url("/seabirds-background.jpg");
}
```

CSS is discovered after HTML, so image download starts late.

**How preload works:**

- Browser discovers preload hint during HTML parse
- Immediately initiates high-priority fetch
- Image downloads parallel to HTML/CSS parsing
- When CSS needs it → image already in cache

**Priority hints:**
Browsers assign fetch priorities:

1. **Highest**: Critical CSS, blocking scripts
2. **High**: Images in viewport, preloaded resources
3. **Medium**: Images below fold, fonts
4. **Low**: Lazy-loaded images, async scripts

Preload elevates image to "high" priority.

**Network waterfall visualization:**

```
Without preload:
HTML → CSS → Discover image URL → Download image

With preload:
HTML → [CSS + Image download in parallel]
```

## 7. Animation Performance: will-change and RequestAnimationFrame

### Problem: Long Main-Thread Tasks

Heavy animations can block the main thread, causing jank and increasing Total Blocking Time (TBT).

### Solution: will-change CSS Hint

```typescript
cursorRef.current.style.willChange = "transform";
```

**What `will-change` does:**

- Hints browser that element will be transformed
- Browser optimizes by:
  1. **Promoting to compositor layer**: Creates separate layer
  2. **GPU acceleration**: Uses GPU for transforms (faster)
  3. **Pre-allocating resources**: Prepares for animation

**Browser rendering layers:**

```
Main Thread (CPU)
  - Layout calculations
  - Paint operations
  ↓
Compositor Thread (GPU)
  - Layer composition
  - Transform/opacity animations (60fps)
```

**Layer promotion:**

```javascript
// Without will-change
element.style.transform = "translateX(100px)";
// Browser: "Hmm, might animate, let me recalculate layout"
// → Reflows layout → Repaints → Composites (slow)

// With will-change
element.style.willChange = "transform";
element.style.transform = "translateX(100px)";
// Browser: "This will animate, promote to GPU layer"
// → Skips layout → Skips paint → Direct composite (fast)
```

**When to use:**

- ✅ Animating transforms (translate, scale, rotate)
- ✅ Animating opacity
- ❌ Don't use for static elements (wastes memory)
- ❌ Remove after animation completes

### RequestAnimationFrame Optimization

The custom cursor uses `requestAnimationFrame` for smooth 60fps animation.

**How RAF works:**

```javascript
function animate() {
  // Update animation state
  updateCursorPosition();

  // Schedule next frame
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
```

**RAF vs setInterval:**

- **setInterval**: Runs at fixed intervals, even if tab is hidden
- **RAF**: Syncs with display refresh rate (60Hz = 16.67ms)
- **RAF pauses**: When tab hidden, saves CPU
- **RAF timing**: Browser optimizes to avoid dropped frames

**Performance benefits:**

- Matches display refresh rate (smooth animation)
- Browser batches DOM updates
- Automatic pause when tab inactive
- Better battery life on mobile

## 8. Build Optimizations: Source Maps and Compression

### Solution 1: Disable Production Source Maps

```typescript
productionBrowserSourceMaps: false,
```

**What source maps are:**

- Maps minified code back to original source
- Used by browser DevTools for debugging
- Large files (often 2-5x the bundle size)

**Trade-off:**

- ✅ Smaller bundle size
- ✅ Faster download
- ❌ Harder to debug production issues

**When to enable:**

- Only if you need to debug production
- Consider separate error tracking (Sentry, etc.)

### Solution 2: Response Compression

```typescript
compress: true,
```

**How compression works:**

- Server compresses response body (gzip/brotli)
- Browser decompresses automatically
- Text-based formats compress well (HTML, CSS, JS)

**Compression ratios:**

- HTML: 70-80% reduction
- CSS: 60-70% reduction
- JavaScript: 60-70% reduction
- Images: Already compressed (minimal benefit)

**Algorithm comparison:**

- **gzip**: Widely supported, good compression
- **brotli**: Better compression (15-20% smaller), modern browsers

**Network impact:**

```
Uncompressed: 500KB → 500KB transfer
Compressed:   500KB → 150KB transfer (70% savings)
```

## Performance Metrics Impact

### Core Web Vitals

1. **LCP (Largest Contentful Paint)**

   - ✅ Image optimization → faster image delivery
   - ✅ Font display swap → text renders immediately
   - ✅ Resource preloading → critical assets ready early

2. **FID/INP (Interaction to Next Paint)**

   - ✅ Lazy-loaded scripts → less main thread blocking
   - ✅ Optimized animations → smoother interactions

3. **CLS (Cumulative Layout Shift)**

   - ✅ Font display swap → no text layout shift
   - ✅ Proper image dimensions → no image layout shift

4. **FCP (First Contentful Paint)**

   - ✅ Non-blocking scripts → faster initial render
   - ✅ Optimized fonts → text appears immediately

5. **TBT (Total Blocking Time)**
   - ✅ Deferred JavaScript → less blocking time
   - ✅ Optimized animations → smoother main thread

## Summary: The Performance Optimization Pipeline

```
User Request
  ↓
HTML Parse (with preload hints)
  ↓
Parallel Downloads:
  - Critical CSS (high priority)
  - Preloaded images (high priority)
  - Preloaded fonts (high priority)
  - HTML continues parsing
  ↓
First Paint (text visible with fallback font)
  ↓
Critical Resources Loaded → FCP
  ↓
Custom Font Swaps In (no layout shift)
  ↓
Images Load (lazy for below-fold)
  ↓
LCP (Largest Contentful Paint)
  ↓
window.load Event
  ↓
Non-Critical Scripts Load (lazy)
  ↓
Page Fully Interactive
```

Each optimization removes a bottleneck in this pipeline, resulting in faster, smoother user experience and improved Core Web Vitals scores.
