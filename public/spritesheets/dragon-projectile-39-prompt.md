# Dragon projectile, skill 39

## Active revision v2

The current effect uses `dragon-projectile-39-v2.webp`. It retains 24 frames,
with head formation in frames 1–4 and impact/dissipation in frames 20–24.
The trailing ribbons are fewer and straighter.

Generated with the built-in image tool using the previous sprite as an edit
target. The exact edit prompt follows.

Precise edit of attached horizontal golden dragon spell spritesheet. Preserve the same golden lemon-yellow flame palette, pale white dragon head facing RIGHT, long horizontal tail, transparent RGBA background, exact 24-frame 4-column by 6-row uniform grid, same camera and same head anchor around 90% cell width and 50% cell height. Keep all sprites inside their cells. CHANGE temporal progression: frame1 is a tiny golden ignition at the future head anchor, frame2 a partial energy outline of the head, frame3 head features gathering from light, frame4 nearly formed white-gold dragon head with short tail. Frames5-19 are the same fully formed flying dragon as the reference, but reduce number of trailing wavy flame ribbons by about 40%, use a cleaner straighter concentrated yellow energy trail with just a few wisps. Frames20-24 must clearly depict IMPACT: frame20 head compresses into bright flash at same leading head anchor, frame21 expanding white-hot golden starburst, frame22 peak compact radial flame explosion, frame23 shrinking fading sparks, frame24 nearly transparent last sparks. The final frames should NOT show a continuing intact dragon head. Explosion centered at head anchor and small enough to fit within cell, transparent margins. No scene, text, characters, grid lines, painted checkerboard or opaque matte. Keep brightness and style of the reference. 24 unique temporally consecutive frames read left-to-right top-to-bottom. Output canvas preferably 1536x1536 with cells384x256. Genuine transparent alpha and clean smooth glow.

A second built-in background-extraction edit removed the pale matte while
preserving all 24 drawings, positions, head formation and final explosions.
Frames are packaged in uniform 448×256 transparent cells, 4×6. Extra margins
accommodate the final explosions, whose bright centers are aligned with
the projectile head anchor. WebP uses quality 95 and alpha quality 100.

The launch holds at the caster for the first four frames, travels until 80%
of the sequence, then displays the impact frames at the target.

Generated with the built-in image generation tool. The user-supplied Metin2
screenshot was used as the visual reference.

## Prompt

Use case stylized-concept. Generate a production game VFX transparent RGBA spritesheet matching the attached Metin2 screenshot's horizontal golden dragon attack. EXACTLY 24 distinct frames, grid of 4 columns and 6 rows, canvas 1536x1536, each frame 384x256 pixels. Every cell a horizontally oriented left-to-right flying GOLDEN YELLOW FIRE DRAGON HEAD with a thin pale white dragon profile at the leading RIGHT end and long luminous lemon-yellow/gold energy flame tail trailing LEFT. Similar to classic Metin2 shaman dragon projectile: elongated yellow energy streak, pointed flame tongues behind, slightly ghostly white-gold snout horns and open jaws in front. No body legs wings character ground scenery labels grid or black background. True alpha transparency with soft edges. ALL frames keep head front at local x=305 y=128, flame extends left to x=35, clear transparent gutters 20px. Same camera, same overall scale and stable head anchor. 24 consecutive distinct flowing flame poses over one projectile flight: first 3 form bright projectile, middle 4-20 full flame pulses, last 4 dissipate at impact. Each frame different flame tongues with consistent dragon anatomy. Maintain flat horizontal trajectory, nose points RIGHT in EVERY frame so runtime can rotate to travel angle. Preserve thin long flame silhouette rather than a bulky realistic animal. Pale white-gold head, intense lemon-yellow core and golden flame edges, restrained orange. Precisely uniform 4x6 grid and no overlap of sprites.

## Summary

Transparent RGBA spritesheet with 24 distinct frames in four columns and six
rows. A horizontally oriented left-to-right golden-yellow fire dragon head
with a pale white profile at the leading right end and a long luminous
lemon-yellow energy tail trailing left. Classic fantasy MMORPG appearance.
Pointed flame tongues, subtle horns, open jaws, no body, wings, character,
ground, text or grid lines. Every frame preserves the head anchor and camera
while flame tongues evolve. Formation, sustained flight and dissipation
across the 24 consecutive frames. Actual transparent background with soft glow.

## Packaging

Generated sheet dimensions were 1254×1254. Frames were extracted at rounded
4×6 grid boundaries and centered in uniform transparent 320×216 cells.
Runtime WebP dimensions are 1280×1296, quality 95, alpha quality 100.
The supplied screenshot establishes the style, not an exact recreation.
