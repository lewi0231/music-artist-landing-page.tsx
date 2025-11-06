# Custom Cursor Hook - Configuration Guide

This guide explains how to customize the behavior of the custom cursor by adjusting various parameters in `use-custom-cursor.ts`.

## Overview

The custom cursor provides a smooth, animated cursor that follows the mouse with configurable lag, stretching effects, and hover states. It automatically detects clickable elements and adjusts its appearance accordingly.

## Key Parameters

### 1. `SPEED` - Cursor Lag/Smoothing

**Location:** Line 4 in `use-custom-cursor.ts`

**What it does:** Controls how quickly the cursor catches up to the mouse position. This is the main parameter for adjusting lag.

**Values:**

- `0.05 - 0.08`: Very laggy, smooth, dreamy effect (heavy trailing)
- `0.1 - 0.15`: Moderate lag, balanced feel
- `0.2 - 0.3`: Snappy, responsive, minimal lag
- `0.4+`: Very responsive, almost instant following

**Example:**

```typescript
const SPEED = 0.08; // Heavy lag for smooth trailing effect
```

**Pro Tip:** Lower values create a more dramatic trailing effect but can feel sluggish. Higher values feel more responsive but lose the smooth trailing effect.

---

### 2. Stretch Amount Calculation

**Location:** Line 80 in `use-custom-cursor.ts`

**What it does:** Controls how much the cursor stretches when moving. This creates the "motion blur" effect.

**Current formula:**

```typescript
const stretchAmount = Math.min((velocity / 100) * 0.5, 0.5);
```

**Parameters:**

- `velocity / 100`: Divides velocity to get a normalized value
- `0.5`: Multiplier that controls stretch intensity
- `0.5`: Maximum cap for stretch amount

**Adjustments:**

- **More stretching:** Increase the multiplier (e.g., `0.7` or `0.8`)
- **Less stretching:** Decrease the multiplier (e.g., `0.3` or `0.2`)
- **Higher max stretch:** Increase the cap (e.g., `0.8` or `1.0`)
- **Different velocity scale:** Adjust `/100` to change sensitivity (lower = more sensitive)

**Example - Subtle stretch:**

```typescript
const stretchAmount = Math.min((velocity / 150) * 0.3, 0.4);
```

**Example - Dramatic stretch:**

```typescript
const stretchAmount = Math.min((velocity / 80) * 0.7, 0.9);
```

---

### 3. Compression Factor

**Location:** Lines 108 and 113 in `use-custom-cursor.ts`

**What it does:** When the cursor stretches in one direction, it compresses in the perpendicular direction. This maintains visual area while changing shape.

**Current values:**

- Vertical movement: `finalScaleX = 1 - Math.abs(stretchY) * 0.6`
- Horizontal movement: `finalScaleY = 1 - Math.abs(stretchX) * 0.6`

**Adjustments:**

- `0.6`: Moderate compression (current default)
- `0.9`: More compression (slimmer perpendicular axis)
- `0.3`: Less compression (maintains more circular shape)
- `1.0`: Full compression (maintains exact area, can look too thin)

**Example - More dramatic compression:**

```typescript
finalScaleX = 1 - Math.abs(stretchY) * 0.9;
finalScaleY = 1 - Math.abs(stretchX) * 0.9;
```

**Example - Subtle compression (more circular):**

```typescript
finalScaleX = 1 - Math.abs(stretchY) * 0.3;
finalScaleY = 1 - Math.abs(stretchX) * 0.3;
```

---

### 4. Hover Scale

**Location:** Line 90 in `use-custom-cursor.ts`

**What it does:** Makes the cursor larger when hovering over clickable elements (links, buttons, etc.)

**Current value:**

```typescript
const targetHoverScale = isPointerRef.current ? 1.25 : 1;
```

**Adjustments:**

- `1.25`: 25% larger (current default)
- `1.5`: 50% larger (more noticeable)
- `1.1`: 10% larger (subtle)
- `1.0`: No size change (hover only changes style)

**Example - More dramatic hover:**

```typescript
const targetHoverScale = isPointerRef.current ? 1.5 : 1;
```

---

### 5. Rotation Threshold

**Location:** Line 85 in `use-custom-cursor.ts`

**What it does:** Sets the minimum velocity required for the cursor to rotate to match movement direction.

**Current value:**

```typescript
if (velocity > 20) {
  angle.current = (Math.atan2(dy, dx) * 180) / Math.PI;
}
```

**Adjustments:**

- `10-15`: Rotates more easily (even with slow movement)
- `20`: Current default (rotates with moderate movement)
- `30-40`: Only rotates with fast movement
- Remove condition: Always rotates (can be janky)

**Example - Always rotate:**

```typescript
angle.current = (Math.atan2(dy, dx) * 180) / Math.PI;
```

---

### 6. Base Cursor Size

**Location:** `app/globals.css` line 97

**What it does:** Sets the base size of the cursor circle.

**Current value:**

```css
--circle-size: 50px;
```

**Adjustments:**

- `30px`: Small, subtle cursor
- `50px`: Medium (current default)
- `70px`: Large, prominent cursor
- `100px`: Very large, bold statement

**Note:** Changing this also affects positioning offsets on lines 105-106.

---

## Common Customization Patterns

### Smooth, Dreamy Cursor (Heavy Lag)

```typescript
const SPEED = 0.06;
const stretchAmount = Math.min((velocity / 120) * 0.4, 0.5);
const targetHoverScale = isPointerRef.current ? 1.3 : 1;
```

### Snappy, Responsive Cursor

```typescript
const SPEED = 0.25;
const stretchAmount = Math.min((velocity / 80) * 0.6, 0.7);
const targetHoverScale = isPointerRef.current ? 1.15 : 1;
```

### Dramatic Stretch Effect

```typescript
const SPEED = 0.1;
const stretchAmount = Math.min((velocity / 70) * 0.8, 0.9);
// Compression factor: 0.9
```

### Minimal Stretch (More Circular)

```typescript
const SPEED = 0.15;
const stretchAmount = Math.min((velocity / 150) * 0.2, 0.3);
// Compression factor: 0.3
```

### No Stretch (Pure Circle)

```typescript
const SPEED = 0.15;
const stretchAmount = 0; // Or remove stretch logic entirely
// Compression: N/A
```

---

## How It Works

1. **Position Smoothing:** The cursor position follows the mouse using an exponential smoothing algorithm:

   ```typescript
   circlePosition += (mousePosition - circlePosition) * SPEED;
   ```

   Lower SPEED = slower catch-up = more lag.

2. **Velocity Calculation:** The difference between smoothed position and actual mouse position creates velocity, which drives the stretch effect.

3. **Shape Transformation:** Based on velocity and movement angle, the cursor stretches in the direction of movement and compresses perpendicularly.

4. **Hover Detection:** On each mouse move, the hook checks if the target element is clickable and smoothly transitions the hover scale.

---

## Performance Notes

- The animation loop runs continuously via `requestAnimationFrame` (~60fps)
- Automatically disabled on mobile devices to save performance
- Uses `willChange: transform` for optimal GPU acceleration
- All calculations use refs to avoid unnecessary re-renders

---

## Troubleshooting

**Cursor feels too laggy:**

- Increase `SPEED` value (try 0.12 or 0.15)

**Cursor feels too responsive (no lag):**

- Decrease `SPEED` value (try 0.06 or 0.08)

**Stretching is too subtle:**

- Increase the stretch multiplier (line 80, second parameter)
- Decrease the velocity divisor (line 80, `/100`)

**Stretching is too dramatic:**

- Decrease the stretch multiplier
- Increase the velocity divisor
- Lower the maximum cap

**Hover effect not noticeable:**

- Increase `targetHoverScale` value (line 90)

**Cursor not rotating:**

- Lower the velocity threshold (line 85) or remove the condition

---

## Advanced: Custom Hover Detection

To add custom elements that trigger hover state, modify the `isClickable` check in `handleMouseMove` (lines 139-145):

```typescript
const isClickable =
  target.hasAttribute("data-pointer") ||
  target.tagName === "A" ||
  target.tagName === "BUTTON" ||
  target.tagName === "IFRAME" ||
  target.getAttribute("role") === "button" ||
  target.closest("[data-pointer]") !== null ||
  target.classList.contains("your-custom-class"); // Add your own
```

Or use the `data-pointer` attribute on any element:

```html
<div data-pointer>This will trigger hover state</div>
```
