'use strict';

// Goal: Given information about several games played between a few people, output a ELO-esque rating for each person.
// Input: CSV file of game history.
//     Each row is 1 match. List of players. Summary of who won (or whether it was a draw).
// Output: {
//     game1: {
//         player1: 1070,
//         player2: 9030
//     }
// }
// Also print in a nice format.

// Use a simple ELO algorithm. Basically redistribute points as appropriate after each match.
// Ideally this should support games with 3+ players.

// Later put this script behind a html UI for simple use.
