## Overview

This project was created for the CCA (Creative Coding Amsterdam) Invader code challenge.

My main implementation for the Invader generator was quite simple and took about 2 nights of tinkering.
I then spent many more days working on the presentation, animation, and figuring out how to save the generated data.
I went off on a tangent for a while trying to procedurally generate pixellated ellipses, but ended up removing it from this project. I might revisit it in the future (the ellipses were going to be used for different kind of aliens, but it didn't fit in with the rest of the project).

### /generate

The main part of the project is in the `/generate` folder.

The idea is simple - I add 4 `cells` to a page, and leave them to grow in one of eight directions (up, down, left, right and diagonals). 2 of the `cells` grow randomly, while remainin 2 mirrors the first 2. That is, it grows in the same direction in the `y axis`, but goes the opposite way on `x axis`.

Since there are no collision checks for the `cell` growth, it can overlap. It also means the final size of the invader is also random. The 'grid' is worked out afterwards by checking positions of cells that are in the top left (lowest `y` and `x` positions) and bottom right (highest `y` and `x` positions).

The random growth is recorded in an object, which is eventually encoded into numbers between 1 and 9 (8 directions + 'no growth'). This becomes the `config` which is essentially like a DNA which can be used to reproduce an invader. Invader's cell growth ends once it reaches a randomly predetermined limit - the generated cells are used to create an array of coordinates, which in turn gets used to draw the shape onto HTML canvas elements. These shapes are used to draw 2 additional frames for animation (the animation was originally done without pre-rendering the frames, but this didn't render well on mobile. Also, having the animation frames made it easier to display as thumbnails on `/gallery` page). Canvas is also used to create the PNG image for download.

### /gallery

Generated invaders are saved in localStorage, and mapped out on the `/gallery` page.
I've saved a few pre-generated invaders in `data.js` so you always have a few displayed by default (I selected these out of hundreds that were generated while I was testing the code.)

Random invaders get picked to be animated (animating all of them at once made the page too busy).

Each invaders are given a name, which gets generated based on their config. These were originally added to make the data easier to debug.

### /display

Clicking on each invaders in the `/gallery` page opens the `/display` page which shows them on an interactive card. It has a pixellated holo effect achieved using HTML canvas. The reflection on the card is calculated using mouse / touch position (if you leave the page idle, the interaction animation triggers automatically).

The `/display` renders the image using the `dataUrl` of the invader in the url param. It's done this way so that you can share the page with other people (since invaders are saved in the `localStorage`, no one else has access to invaders you generated). If the invader exists in your `localStorage`, edit button is shown. This will take you to the `/generate` page, with the config pre-filled.

### /config-editor

This page just displays the data saved in the `localStorage`, mostly for debugging - you can edit, download text file or delete the data from here (this is also possible using the inspector tool, but I added the page so it was easier to access this data on mobile).
