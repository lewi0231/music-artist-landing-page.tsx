# Fixing Custom Cursors Over iframes: A Surprisingly Complex Problem

So you've built a slick custom cursor for your site. It works great! Until you add an iframe. Suddenly your cursor disappears when hovering over it, or worse, it lags and stutters. What gives?

## The Problem

Custom cursors work by listening to `window.addEventListener("mousemove")` to track the mouse position. But when you hover over an iframe:

1. The iframe is rendered as a separate document context by the browser
2. Your `window` mousemove listener often doesn't fire over the iframe
3. The `mouseleave` event fires when the cursor enters the iframe, causing your cursor to disappear

You could just hide the cursor when over iframes, but then you lose interactivity.

## The Solution: Overlay + Widget API

The solution is to overlay a transparent div over each iframe that captures mouse events. Then use the SoundCloud Widget API (or similar) to programmatically control playback without exposing the actual widget controls.

### Step 1: Set Up TypeScript Types

```typescript
declare global {
  interface Window {
    SC?: {
      Widget: (iframe: HTMLIFrameElement) => {
        toggle: () => void;
        play: () => void;
        pause: () => void;
        bind: (event: string, callback: () => void) => void;
      };
    };
  }
}
```

**Why this?** TypeScript doesn't know that `window.SC` exists since it's added by an external script. The `declare global` block adds it to the `Window` interface at compile time.

### Step 2: Load the Widget API Dynamically

```typescript
useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://w.soundcloud.com/player/api.js";
  script.async = true;
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);
```

**Why dynamic loading?** We could add the script tag to HTML, but loading it programmatically gives us better control over when it loads and makes cleanup easier. The script adds the `SC` object to `window` when it loads.

### Step 3: Store Refs to All iframes

```typescript
const iframeRefs = useRef<{ [key: number]: HTMLIFrameElement | null }>({});

// Then in your JSX:
<iframe
  ref={(el) => {
    iframeRefs.current[0] = el;
  }}
  src="your-soundcloud-url"
/>;
```

**Why refs?** We need direct DOM access to the iframe elements to pass them to the Widget API.

### Step 4: Create Click Handler

```typescript
const handleTrackClick = (index: number) => {
  const iframe = iframeRefs.current[index];
  if (iframe && window.SC) {
    const widget = window.SC.Widget(iframe);
    widget.toggle();
  }
};
```

**What's happening:** We grab the iframe by index, create a Widget instance, and call `toggle()` to play/pause. The Widget API gives us programmatic control without exposing the embedded player.

### Step 5: Add Overlay Div with Cursor Pointer

```typescript
<div className="block relative rounded-2xl overflow-hidden shadow-2xl">
  <iframe /* ... */ />
  <div
    className="absolute inset-0 cursor-pointer"
    onClick={() => handleTrackClick(0)}
  />
</div>
```

**The magic:**

- `absolute inset-0` positions the div to cover the entire iframe
- `cursor-pointer` triggers your custom cursor hook
- `onClick` handles playback via the Widget API

The overlay div sits on top of the iframe, invisible but interactive. Your custom cursor works because it's hovering over the div, not the iframe!

## Why This Works

1. Mouse events are captured by the overlay div in your parent document
2. Custom cursor displays correctly over the overlay
3. Clicks are handled by your code, which controls the iframe's playback via API
4. The iframe remains functional but invisible behind the overlay

## Bonus: Make Sure Your Custom Cursor Hook Detects Clickable Elements

Update your custom cursor detection logic:

```typescript
const isClickable =
  target.tagName === "A" ||
  target.tagName === "BUTTON" ||
  target.tagName === "IFRAME" || // Important!
  target.getAttribute("role") === "button" ||
  window.getComputedStyle(target).cursor === "pointer";
```

This ensures your cursor morphs appropriately when hovering over iframes (or the overlays covering them).

## The Takeaway

iframes are isolationist jerks that don't play well with parent document features. The workaround? Put a layer on top of them and control their contents via API. JavaScript at its finest.

---

_This pattern works for any embedded content (YouTube, Spotify, etc.) as long as they provide a Widget API for programmatic control._
