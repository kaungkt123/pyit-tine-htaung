# ပစ်တိုင်းထောင် — A 2D Burmese Doll Game

A small interactive web game inspired by ပစ်တိုင်းထောင်, a traditional Burmese doll that gets back upright whenever it is knocked over.

Drag, tilt, and throw the doll, then watch it bounce and wobble back upright.

## Features

- Drag the doll using a mouse or touchscreen.
- Release while moving to throw it.
- Watch it bounce off the floor and side walls.
- Tilt the doll and watch it return upright.
- Use the Reset button to start again.
- Responsive layout for different screen sizes.

## Built With

- HTML — page structure
- CSS — styling and responsive layout
- JavaScript and Canvas API — drawing, animation, and movement

The movement uses a simple custom physics simulation with gravity, bouncing, and a spring-like effect that returns the doll upright.

## How to Play

- **Lift:** Click or touch the doll and drag upwards.
- **Tilt:** Move sideways while holding the doll.
- **Throw:** Release while moving.
- **Drop:** Hold still briefly before releasing.
- **Reset:** Click the Reset button.

## Project Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure, game canvas, and Reset button |
| `style.css` | Page styling and responsive layout |
| `script.js` | Doll drawing, physics, and pointer controls |

## What I Learned

Through this project, I practised drawing with the Canvas API, handling mouse and touch input, animating with `requestAnimationFrame`, and organising JavaScript into smaller functions.

## Future Improvements

- Refine collision detection to match the doll’s body shape.
- Add Movement effects 
- Improve touch controls.
- Create a 3D version with forward and backward tilting.