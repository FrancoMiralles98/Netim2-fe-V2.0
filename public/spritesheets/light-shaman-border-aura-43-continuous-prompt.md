# Aura 43, continuous clockwise cycle

Source particle textures were generated with the built-in image generation tool.
The final spritesheet was composed from these textures with calculated positions,
instead of asking for24 independently drawn motion poses.

## Texture prompt

Use case stylized-concept, game VFX source textures. Create four separate isolated magical BLUE aura particles on actual transparent RGBA in a precise2x2 atlas,1024x1024 total, each512x512 cell, huge transparent margins at least90px within every cell. TOP LEFT: a slender flowing cobalt-blue flame wisp pointing to the RIGHT with a small icy cyan-white tip and tapered trailing blue ribbons to LEFT, gently curving, bounding box about250x70px centered. TOP RIGHT: a single slim faceted icy-blue cyan crystal shard/diamond pointing RIGHT, bounding box110x40 centered. BOTTOM LEFT: a small delicate four-point cyan-white glint with thin cobalt glow, centered bounding box70x70. BOTTOM RIGHT: a faint narrow tapered blue energy streak pointing RIGHT, bounding box220x30. Match classic Metin2 shaman blue aura: deep cobalt wisps, cyan accents, restrained white highlights, fine detailed filaments, soft antialiased localized glow. No text, no border, no grid lines, no card, no circular ring or complete aura, no background matte, no cloudy fill or painted checkerboard. Genuine transparent pixels around all four particles, each texture isolated cleanly in its own equal512px cell.

## Motion construction

24 unique RGBA frames in original forward order,6 columns by4 rows,
256×256 cells,1536×1024 lossless WebP. Runtime is24FPS, one second per loop.

Particles follow a rounded rectangular perimeter using constant arc-length
increments. Repeated particle groups travel one quarter of the perimeter per
cycle, so each group smoothly replaces the next at the loop boundary.
Brightness uses periodic functions with different spatial phases. The final
frame is one movement step before the first, not a copy or reversed frame.

Positions are rendered at3× resolution and downsampled for subpixel stability.
The generated aura keeps its full transparent frame and lower glow margin.
The difference across the24→1 boundary was checked against the other frame
transitions and was about1.06times their mean difference.

The active card still owns the effect through activeAuras. Loop duration does
not control aura expiration.
