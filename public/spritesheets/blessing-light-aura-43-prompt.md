# Blessing aura, light shaman, skill 43

The built-in image generation tool generated the complete24-frame sheet,
using the user's Metin2 screenshot as the visual reference.

## Exact generation prompt

Use case stylized-concept. Generate a COMPLETE ANIMATION SPRITESHEET, exactly24 different consecutive hand-painted VFX frames, NOT one single aura image. Canvas1536x1024, precisely6 columns and4 rows,256x256 cells. Use supplied Metin2 screenshot ONLY as effect-style reference: the light shaman Blessing aura has SOFT BLUE FLAME FEATHERS / floating cobalt-blue leaflike wisps and tiny pale-cyan sparks surrounding the character, with a faint blue ground shimmer. Adapt those same soft sparse blue flames around an invisible horizontal rounded-rectangle UI card measuring250x66. In EACH CELL arrange aura around a wide rounded rectangle centered128,128, width224 height76, corners12, boundsx16..240,y90..166. About10-14 delicate soft blue flame feather particles follow perimeter including short vertical sides and upper/lower edges; empty transparent center and generous transparent margins so glow never cut. No solid frame, no thick ice border, no large faceted crystal diamonds, no circle/ellipse, no human or terrain. Keep authentic ethereal blue particle effect like screenshot, translucent small cobalt flame petals with subtle cyan tips, no broad background haze. SEQUENCE: all24 frames are one steady seamless forward-only cycle. Keep same particle count, form, layout, size, total intensity. Positions advance only1-2pixels per frame clockwise around frame perimeter in small constant steps. Each feather softly flutters in shape; small glints shimmer at different phases, never all together. Frame24 is just ONE SMALL STEP before frame1 so wrap is same as any neighbouring pair. Do not copy frame1 into frame24; do not reverse frames; do not show ignition, expansion, explosion, vanishing or changing border size. Read left-to-right top-to-bottom. True RGBA alpha0 in empty center and between cells, no painted checkerboard, no blue/gray/black matte, no opaque background, no labels or grid lines. This must visibly contain6 aura frames per row and4 rows,24 total, each aligned exactly to same rectangle anchor. Prioritize tiny frame-to-frame differences and reference-faithful blue feathers rather than a rigid decorative frame.

## Refinements

The complete sheet was refined to keep a stable blue-feather layout and make
the last row approach the first row in small increments. A final extraction
removed the background matte while preserving all24 frame drawings.

## Packaging and checks

1536×1024 RGBA,6 columns by4 rows,256×256 cells.24 distinct drawings in original
order. One common vertical alignment shift was applied to all cells.
No frame reversal, duplicated endpoint or derivation from a single still.
WebP is lossless and preserves alpha.

24FPS,1000ms per repeated loop. First and last frames differ, and the visible
24→1 transition difference is about1.12times the mean transition difference.
The comparison is made after compositing over the dark game background.

The effect is positioned around a250×66 compact card, with24px horizontal
and16px vertical overlay margin and a content-height ratio of76/256.
