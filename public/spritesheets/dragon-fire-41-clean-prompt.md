# Dragon fire 41, edge cleanup

Edited with the built-in image generation tool, using the original skill 41
spritesheet as the edit target.

## Exact edit prompt

Edit only the alpha/background and edge quality of this 24-frame 6 columns x4 rows golden fire dragon pillar spritesheet. Preserve every original flame drawing, cyan ring, upward dragon head, column thickness, pose, frame order, stable anchor and cell positions. REMOVE ALL broad cloudy rectangular halos, smoky beige/gray fog, pixel blocks, squares and speckled fringe beside the dragon. Empty areas and cell margins must be genuinely transparent alpha0. Retain just a subtle narrow smooth anti-aliased glow hugging fire and cyan ring. Keep fine clear flame tongues, smooth outlines, no pixel-art treatment. DO NOT add any background or checkerboard. NO overall fog between cells. The reference has a large unwanted diffuse halo which must be extracted away, not redrawn as a cloud. Output same 1536x1024 canvas, 6x4 uniform 256x256 grid, true transparent RGBA. This is precise cleanup, keep all subject artwork and composition the same.

## Packaging and timing

The selected RGBA sheet is 1536×1024, six columns and four rows of 256×256.
Stored as lossless WebP to avoid introducing block compression artifacts.
Playback duration is 1500ms at normal speed. Frames 9–16 have weight 2,
all remaining frames weight 1. The eight peak frames occupy 750ms.
The original sheet is retained separately.
