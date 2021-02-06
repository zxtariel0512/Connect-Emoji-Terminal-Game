// implement your functions here
// ...don't forget to export functions!

function generateBoard(rows, cols, fill = null){
    let board = {
        data: new Array(rows * cols).fill(fill),
        rows: rows,
        cols: cols
    };
    return board;
};

function rowColToIndex(board, row, col){
    const colNum = board.cols;
    let index = col + row * colNum;
    return index;
};







module.exports = {
    generateBoard: generateBoard,
    rowColToIndex: rowColToIndex
}
