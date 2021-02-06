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

function indexToRowCol(board, i){
    let position = {
        row: parseInt(i / board.cols),
        col: i % board.cols
    };
    return position;
};

function setCell(board, row, col, value){
    let index = rowColToIndex(board, row, col);
    let newData = [...board.data];
    newData[index] = value;
    let newBoard = {
        data: newData,
        rows: board.rows,
        cols: board.cols
    }
    return newBoard;
};

function setCells(board, ...obj){
    const rowNum = board.rows;
    const colNum = board.cols;
    let currBoardData = [...board.data];
    let currBoard = {
        data: currBoardData,
        rows: rowNum,
        cols: colNum
    };
    for(let i = 0; i < obj.length; i++){
        let currObj = obj[i];
        let newBoard = setCell(currBoard, currObj.row, currObj.col, currObj.val);
        currBoard.data = [...newBoard.data];
    };
    return currBoard;
};





module.exports = {
    generateBoard: generateBoard,
    rowColToIndex: rowColToIndex,
    indexToRowCol: indexToRowCol,
    setCell: setCell,
    setCells: setCells
}
