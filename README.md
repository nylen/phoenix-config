## What is this?

This is my config for [jasonm23/phoenix](https://github.com/jasonm23/phoenix),
a window manager for OS X that is scriptable using JavaScript.

## Installation

- Install Phoenix
- `git clone git@github.com:nylen/phoenix-config ~/phoenix`
- `cp -va ~/phoenix/.phoenix.js ~/`

## Features

- Use modifiers + arrow keys to move windows around in a grid and between
  screens.
- If Thunderbolt screen is present:
  - `Alt + Cmd` + arrows uses a 5-square grid (2 on top, 3 on bottom) on my
    Thunderbolt display, and all of my Retina display.
  - `Ctrl + Alt + Cmd` + arrows uses the left and right halves of my Thunderbolt
    display, and all of my Retina display.
- If Thunderbolt screen is not present:
  - `Alt + Cmd` + arrows uses moves windows to left/right/top/bottom half of my
    Retina display.
  - `Ctrl + Alt + Cmd` + `up` maximizes windows.

## Code

- Start in `main.js`
- `Grid.js` figures out how to move left/right/up/down in the grid
- **Unit tests** in `test/`!!
