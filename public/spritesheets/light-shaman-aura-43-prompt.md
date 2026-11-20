# Light shaman aura, skill 43

Generated with the built-in image generation tool using the user's screenshot
as visual reference.

## Exact generation prompt

Use case stylized-concept game VFX. Generate a transparent RGBA spritesheet matching the blue light shaman aura screenshot supplied by user. EXACTLY24 distinct consecutive frames in UNIFORM6 columns x4 rows,1536x1024 canvas, each cell256x256. Aura is a delicate magical BLUE RING of scattered blue crystalline rune shards and thin cyan glints encircling an EMPTY central area where a character/card will appear. Thin elliptical blue ground glow at base, small blue teardrop/feather-like luminous particles slowly orbiting and rising up both sides, a few wispy cobalt flames near top. Screenshot-style classic fantasy MMORPG blue aura. No humanoid, character, card, text, big magic symbols, sphere, or background. Front/isometric view, same camera and anchor every frame. Aura outer extentlocal x32..224 y24..230, clear empty center x85..171 y55..180 to preserve UI readability. Sparse blue particles, subtle local glow, transparent background and transparent center, no broad cloudy fog, no opaque matte, no painted checkerboard, no grid lines, soft antialiased edges. This is a SUSTAINED SEAMLESS LOOP: no ignition or explosion, no disappearance at last frame. First through24th phases are incremental regular orbit and blue shimmer, final frame flows naturally into first. Keep similar number of shards and same intensity all frames, just their positions advance clockwise and drift vertically. Mild deep blue with pale cyan tips, small blue runes are graphical shapes not written text.

## Cleanup edit

Remove the blue background matte and filled centers, preserve every shard,
bottom ellipse, thin ring and upper wisp. Empty centers and margins must
be fully transparent. Keep the 6×4 layout and all 24 loop phases unchanged.

## Runtime

Lossless WebP with alpha. 24 frames at16FPS,1.5seconds per repeated cycle.
The effect lives on the caster card while skill43 is present in activeAuras.
Duration updates preserve the mounted animation. Expiration, deactivation
or reset remove it. The frames represent a sustained loop, not a cast/impact.
