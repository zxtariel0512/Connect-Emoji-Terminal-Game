# Connectmoji
## Description
An interactive 2-player (computer vs human player) "connection" game.

* the game is played on a vertical grid of cells (imagine a board stood on its side)
* players take alternate turns dropping a piece in a column
* the piece dropped will occupy the lowest unoccupied cell of the grid
* when a player drops a piece that results in an uninterrupted vertical, horizontal or diagonal line of adjacent identical pieces of an agreed upon length, that player wins
* for example, the board below shows that 😎 has won the game by creating a vertical line of four consecutive pieces in column C

## Instructions
* In `src/connectemoji.js` file, there are helper functions that are used to build up this game.
* The construction of this game (i.e., the main code) is in `src/game.js` file.

To run the code, 
1. git clone this repository.
2. In terminal, do `npm install`.
3. In terminal, do `cd src`.
4. In terminal, do `node game.js`.
