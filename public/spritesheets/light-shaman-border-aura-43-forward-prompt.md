# Aura 43, forward-only revision

New artwork generated with the built-in image generation tool using the user's
annotated250×66 card as the border-placement reference.

## Exact prompt

Generate a NEW24-frame seamlessly repeating blue shaman BORDER AURA spritesheet. User's screenshot in conversation is geometry reference: aura must hug the complete rounded rectangular250x66 card area, including both upper and LOWER edges. Do NOT draw the red annotation or the card. Same magical cobalt blue flame wisps, cyan pointed crystal shards and small white-cyan glints as previous aura. EXACT6 columns x4 rows,1536x1024 image, square256x256 cells. In every cell aura outline follows rounded rectangle centered exactly at(128,128), outer WIDTH230px and HEIGHT80px, boundsx13..243,y88..168, rounded corners10px. Sparse open/broken blue trails along straight upper/lower edges and vertical sides, leave a gap near top center. NO ellipse/circle or bottom ground ring. Thin local soft glow extends at most10px from outline. Keep generous full transparent vertical margins above and BELOW, never clip glow or bottom sparks with a horizontal cut. Fully transparent center and background, no cloudy blue matte, checkerboard or grid.24 frames are incremental CLOCKWISE forward-only animation phases of several small flowing blue wisps and shards moving around the rectangle. Each next frame advances particles by1/24 of cycle, frame24 is one small forward step before frame1, no reverse or ping-pong. Same size anchor intensity camera all24 frames. Sustained ambient aura no ignition no ending explosion. Polished smooth antialiased blue/cyan effects and narrow bright tips, no pixelated block artifacts. Full native256px square frames retain all bottom glow; no bottom cropping.

## Cleanup

A background-extraction edit removed the black matte while preserving all
24 blue/cyan phase drawings and all soft edge glows.

## Packaging

Full256×256 cells,6 columns by4 rows,1536×1024 lossless WebP. All24 frames
are distinct and remain in their original generated order. No reversed
sequence or ping-pong playback. Shared positional alignment moves the border
to the frame center; the discarded margin has no visible effect pixels.
No tight vertical cropping is used.

Runtime is24FPS and1000ms per loop. Visible border geometry occupies roughly
80/256 of the frame height. The component scales the full image so this band
covers the card height plus8px, leaving full space for the surrounding glow.
