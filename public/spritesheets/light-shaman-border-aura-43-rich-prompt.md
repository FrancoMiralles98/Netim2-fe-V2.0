# Aura 43, rich blue aura with subtle loop phases

Artwork generated using the built-in image generation tool. The user's aura
spritesheet and Metin2 screenshot establish the intended blue flame and crystal
appearance. The24-frame sheet is composed using periodic motion from that
artwork rather than independently redrawing each frame.

## Source artwork prompt

Create a single polished game VFX BLUE SHAMAN AURA BORDER texture, NOT a sprite sheet yet. Actual transparent RGBA, square1024x1024 canvas. Match the user's references: rich cobalt-blue wispy FLAMES and scattered faceted CYAN WHITE crystal feather shards, like classic Metin2 light shaman aura. Compose as a wide LOW rounded RECTANGULAR aura around an empty transparent card area, centered at512,512, outer main outline WIDTH880px and HEIGHT320px. Bounds aroundx72..952,y352..672, corners radius48. Blue flame ribbons and luminous shards follow all four edges and rounded corners, a few small wisps drift just outward, with broken/open gaps along top and bottom. Stronger magical aura presence than just a thin traced line. The middle remains COMPLETELY transparent and unobstructed. Blue wisps can extend60px beyond outline, but generous margins on every canvas edge so no glow is clipped. No circle or ellipse, no ground ring. Icy cyan-white shard tips, cobalt flame tails, narrow soft blue glow. Smooth high quality anti-aliased edges, no pixel blocks. No character, UI card, red marks, text, grid, scenery, background fill, blue matte, fog or painted checkerboard. This is a rectangular blue aura frame source artwork to animate subtly, maintain fine irregular flame filaments and crystals distributed around perimeter.

## Refinement

Fit the whole aura inside transparent margins, reconstruct complete left/right
edges, make flame ribbons40% thinner and crystal shards35% smaller. Use a
rounded rectangular silhouette with open top/bottom center gaps and transparent
interior. Preserve cobalt flames, cyan-white shards and localized glow.

## Animation

24 distinct forward frames,6×4 grid,256×256 cells,24FPS,1000ms per loop.
Small periodic mesh displacements ripple the flames, while locally phased
brightness avoids all particles fading together. A repeating group of small
glints advances clockwise at about1.85 native pixels per frame.

Frame24 is one small movement step before frame1. They are distinct images.
The mathematically predicted phase25 equals phase1. The24→1 image difference
is about0.99times the mean of all frame transitions. There is no reversed
playback or duplicated endpoint.

Runtime asset is lossless WebP. Full cell margins protect the lower glow.
The visible border occupies roughly56/256 of the image height, used by the
card overlay to size the effect around a250×66 card.
