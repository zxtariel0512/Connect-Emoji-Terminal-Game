// implement your functions here
// ...don't forget to export functions!
function generateBoard(rows, cols, fill = null){
    let board = {
        data: new Array(rows * cols).fill(fill),
        rows: rows,
        cols: cols
    };
    return board;
}
module.exports = {
    generateBoard: generateBoard
}
