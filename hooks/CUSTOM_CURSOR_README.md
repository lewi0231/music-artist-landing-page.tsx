# Custom Cursor Hook - Configuration Guide

This guide reflects the current implementation of `use-custom-cursor.ts` and highlights the tunable parts of the animation loop.

## Overview

The hook drives a trailing cursor that:

- Smoothly eases toward the mouse position.
- Stretches in the direction of travel and compresses perpendicularly.
- Rotates when movement is fast enough, reducing jitter.
- Scales up on hover when the pointer is above an interactive element (native semantics or anything marked with `data-pointer`).
- Exposes `isPointer` and `isVisible` so consuming components can change styles or hide the cursor when needed.

## Key Parameters and Behaviours

### 1. `SPEED` – Position Smoothing and Easing

**Location:** top of `use-custom-cursor.ts`

Controls how quickly the animated cursor catches the actual pointer **and** how aggressively the scale value interpolates toward its target.

- `0.05 – 0.08`: pronounced lag and trailing (floaty feel).
- `0.1 – 0.18`: balanced (default `0.08`).
- `0.2+`: very responsive, minimal trailing.

```typescript
const SPEED = 0.08;
```

Lower values make the cursor feel dreamy and elastic; higher values tighten both position and scale transitions.

### 2. Velocity-to-Scale Mapping

Inside the animation loop:

```typescript
const scaleValue = Math.min((velocity / 100) * 0.75, 0.8);
scale.current += (scaleValue - scale.current) * SPEED;
```

- `velocity / 100`: normalises distance between smoothed cursor and live pointer.
- `0.75`: intensity multiplier. Increase for more stretch, decrease for subtlety.
- `0.8`: hard cap. Lower it to limit extreme stretching when velocity spikes.

Using a larger multiplier? Consider dropping the cap so that fast flicks do not look distorted.

### 3. Rotation Threshold

```typescript
if (velocity > 20) {
  angle.current = (Math.atan2(dy, dx) * 180) / Math.PI;
}
```

- Threshold `20` gates rotation to higher speeds. Lower for always-on directional alignment, raise to keep slow movement upright.
- Removing the guard causes rotation on every frame (expect jitter on micro-movements).

### 4. Low-Velocity Damping

```typescript
if (velocity < 20) {
  scale.current *= 0.95;
}
```

This nudges the cursor back toward a circle when movement slows. Adjust `0.95`:

- Smaller (e.g. `0.9`): snaps back faster.
- Larger (e.g. `0.98`): lets the stretched state linger.

### 5. Hover Scale

```typescript
const hoverScale = isPointerRef.current ? 1.25 : 1;
```

- `1.25`: default 25% upscale for interactive targets.
- Increase for a stronger callout (`1.4 – 1.6`).
- Decrease toward `1` for subtle hover feedback.

Remember to keep the visual cursor size in sync with CSS variables such as `--circle-size` (see `app/globals.css`).

### 6. Stretch Calculation

```typescript
const stretchAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
const stretchX = Math.cos((stretchAngle * Math.PI) / 180) * scale.current;
const stretchY = Math.sin((stretchAngle * Math.PI) / 180) * scale.current;

cursorRef.current.style.transform = `
  translate(${circlePosition.current.x}px, ${circlePosition.current.y}px)
  scale(${(1 + Math.abs(stretchX)) * hoverScale}, ${
  (1 + Math.abs(stretchY)) * hoverScale
})
  rotate(${angle.current}deg)
`;
```

- `stretchX`/`stretchY` project the scale along the movement vector.
- Multiply either axis before applying `Math.abs` to bias stretching horizontally or vertically.
- Wrap the `Math.abs` calls in `Math.min(..., cap)` if you want different limits per axis.
- Update the transition (`transform .03s ease-in-out`) if you prefer different easing.

### 7. Visibility Handling

- `isVisible` flips to `true` on first mouse move and `false` on `mouseleave`. Use it to conditionally render or fade the custom cursor for a clean initial load and to prevent stale transforms after the pointer exits the viewport.
- The hook never hides the native cursor; that responsibility lives in the consuming component/CSS so you can provide an accessibility toggle if needed.

### 8. Hover Detection

```typescript
const pointerTarget = target?.closest("[data-pointer]");
const nativeClickable = target?.closest(
  'a, button, input, textarea, select, summary, [role="button"]'
);
const isClickable = Boolean(pointerTarget ?? nativeClickable);
```

- `data-pointer` opt-in works on any ancestor.
- Native interactive elements are supported out of the box.
- Extend `isClickable` to cover bespoke components (see Advanced section).

## Customisation Recipes

### Floaty and Expressive

```typescript
const SPEED = 0.06;
const scaleValue = Math.min((velocity / 120) * 0.9, 1.0);
const hoverScale = isPointerRef.current ? 1.35 : 1;
```

### Snappy and Minimal Stretch

```typescript
const SPEED = 0.18;
const scaleValue = Math.min((velocity / 80) * 0.45, 0.5);
const hoverScale = isPointerRef.current ? 1.12 : 1;
```

### Arrow-Like Pointer

```typescript
const SPEED = 0.12;
angle.current = (Math.atan2(dy, dx) * 180) / Math.PI; // remove guard
if (velocity < 20) {
  scale.current *= 0.9;
}
```

## How It Works

1. **Tracking:** `mousePosition` stores the latest pointer location; `circlePosition` eases toward it each frame using `SPEED`.
2. **Velocity:** Differences between those refs (`dx`, `dy`) define `velocity`, which powers stretch intensity and rotation gating.
3. **Stretch and Rotate:** `scale.current` projects along the motion vector, creating anisotropic scaling, then the cursor rotates when velocity exceeds the threshold.
4. **Hover State:** Event targets and ancestors are inspected for native clickability or `data-pointer`, toggling `isPointer` and adjusting `hoverScale`.
5. **Visibility:** `isVisible` provides a simple signal for mounting/unmounting or cross-fading the custom cursor wrapper.

## Performance Notes

- Animation runs inside a single `requestAnimationFrame` loop; refs prevent unnecessary React renders.
- Keep the cursor element lightweight and GPU-friendly (e.g. `will-change: transform; pointer-events: none;`).
- Consider mounting the hook conditionally on pointer-capable devices so touch users avoid the extra work.

## Troubleshooting

- **Too much lag:** increase `SPEED` incrementally (e.g. `0.1`, `0.14`).
- **Stretch too subtle:** raise the `0.75` multiplier or lower the `/ 100` divisor.
- **Stretch too extreme:** lower the multiplier or cap (`0.8` → `0.6`).
- **Hover feedback weak:** raise the hover scale or apply extra styling when `isPointer` is `true`.
- **Cursor jitters on slow movement:** increase the rotation threshold (e.g. `30`).
- **Cursor never hides:** ensure your cursor component reads `isVisible` and toggles visibility appropriately.

## Advanced: Custom Hover Detection

Extend the clickability check with your own selectors:

```typescript
const customInteractive = target?.closest(".interactive-card");
const isClickable = Boolean(
  pointerTarget ?? nativeClickable ?? customInteractive
);
```

Or simply mark elements with `data-pointer`:

```html
<div data-pointer>Hover me to trigger the pointer state</div>
```

Pair this with breakpoint-aware logic (e.g. your `useIsMobile` hook) to disable the custom cursor on touch devices while keeping the documentation accurate for pointer users.
