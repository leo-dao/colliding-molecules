# Colliding molecules

Colliding molecules is a Three.js app written in TypeScript. 


## How it works
1. Cubes are initialised within an invisble volume with a random direction and rotation 
2. Each cube has 6 faces of different color and a normal line of the same color perpendicular to the face
3. The cubes move withing the volume and bounce off of walls on collision
4. Two cubes can merge into a larger molecule if a face/normal collides with a face/normal of matching color
5. This new molecule then keeps moving around the volume and can merge with more molecules
6. User can also click in empty space (holding down shift) to insert a new cube or directly merge into another molecule if clicking on a cube

## Modifying settings
The size of the invisible volume, as well as speed and rotation of molecules can be modified at the top of src/lib/geometry.ts

## Running the app
1. Clone the repo
2. Run `npm install`
3. Run `npm run start` 
4. Go to http://localhost:5173/

## Demo
Add Gif here

## Limitations
This app checks collision with bounding boxes, which can sometimes be too sensitive and "overmerge".
