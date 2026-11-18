# Rectangular aura frame, skill 43

## Seamless runtime revision

The active file is `light-shaman-border-aura-43-loop.webp`, a1536×896 sheet
with6 columns and8 rows,48 cells of256×112 pixels. The original24 drawings
are packed forward then backward, preserving all existing artwork.
The loop runs at32FPS and still lasts1.5seconds. First and last decoded
RGBA frames are byte-identical, as are frames24 and25 at the turn-around.
This produces an oscillating shimmer. No new image generation or drawing
was required for the timing/layout revision.

WebP is lossless with exact transparent RGB preservation. The earlier
generation prompt below documents the source artwork.

Edited with the built-in image generation tool using the original blue aura
and the user's annotated 250×66 card as design references.

## Initial redesign prompt

Redesign the attached blue shaman aura into an OPEN RECTANGULAR BORDER AURA for a horizontal game card of250x66 pixels. Preserve the cobalt blue wisps, icy cyan crystal shards and delicate glow of reference. Actual transparent RGBA. Exactly24 unique loop phases in a uniform4 columns x6 rows spritesheet, square canvas1536x1536, cells384x256. Inside each cell the aura surrounds a wide low invisible rounded rectangle centered at(192,128), rectangle width320 height85, corners radius16. Keep all effects in the narrow perimeter band around this rectangle, localx20..364 y65..191. Thin wispy blue traces follow left and right VERTICAL edges and their rounded corners, with broken blue flame segments along the straight top and bottom edges. Important OPEN design with generous gaps near upper middle and lower middle. Do not make an ellipse, oval, circle or complete closed border. Empty rectangular interior must be fully transparent so card contents show through. Few pointed blue/cyan shards drift along the border, same visual weight as existing aura. Do not put flames across interior. All24 frames same rectangle size and position, slight incremental movement and shimmering along perimeter, loopable with no cast/explosion/end. No card artwork, text, character, red strokes, opaque background, blue matte or painted checkerboard. Transparent margins and center with clean anti-aliased edges and narrow local glow. Color palette deep blue flame with bright cyan-white tips. Match user's annotated border reference in conversation, but red drawing is ONLY geometry guidance; actual effect entirely BLUE.

## Final layout refinement

Preserve the open rectangular shard border design and palette. Produce
24 loop phases in six columns and four rows on a1536×1024 canvas,
256×256 cells. Each phase contains a wide low rectangular blue aura with
gaps along top and bottom, no circular ring, and fully transparent center
and margins. Remove the blue matte while preserving localized glow.

## Packaging

Frames were cropped identically to their middle112px to remove unused vertical
space. Runtime WebP is1536×448 with256×112 cells, lossless RGBA.
The preview uses a250×66 card with a282×98 effect container.
The24-frame loop remains1.5seconds and is mounted only while the aura is active.
