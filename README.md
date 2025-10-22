# Decoding Seabirds - Portfolio

A music portfolio site showcasing selected tracks from Decoding Seabirds, my hobby music project. It's been a while since I created new music, but this site brings together some of my favorite pieces.

## Inspiration

This site is heavily inspired by the beautiful design work at [wilcock.co](https://wilcock.co). Credit where credit is due – their landing page aesthetic was too good not to recreate.

## Features

### Animations

- **Pull-up text effects** using Framer Motion's `useInView` hook for scroll-triggered animations
- **Staggered word reveals** on the hero title with custom cubic bezier easing
- **AnimatePresence** for smooth page transitions and the music slider
- **Scroll-aware navigation** that fades in/out as you scroll
- **Image pull-up animations** similar to the text effects but for images, only triggered when scrolled into view
- **Overlayed audio players** on images that appear on hover

### Custom Cursor

Built a custom cursor from scratch that:

- Smoothly follows the mouse using `requestAnimationFrame`
- Morphs based on velocity (squash and stretch effect)
- Scales up on hover over clickable elements
- Rotates based on direction of movement

### Music Player

- Interactive slider to browse through tracks
- Embedded SoundCloud players
- Smooth transitions between tracks

## Tech Stack

- **Next.js 15** with App Router
- **React 19**
- **Framer Motion** for all animations
- **Tailwind CSS v4** for styling
- **TypeScript**
- Multiple Google Fonts (Turret Road, Anta, Sarpanch, Quicksand, Inter)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Notes

This is a work in progress. Some features are still being refined, and I might tweak the design as I go. The code is public purely for portfolio purposes – feel free to take a look around!

---

**Decoding Seabirds** – DS-3
