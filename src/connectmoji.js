// implement your functions here
// ...don't forget to export functions!

const wcwidth = require("wcwidth");

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

function boardToString(board){
    const rowNum = board.rows;
    const colNum = board.cols;
    const values = [...board.data];
    let result = "";
    let maxWid = 0;
    for(let i = 0; i < values.length; i++){
        if(values[i] != null){
            if(wcwidth(values[i]) > maxWid) {
                maxWid = wcwidth(values[i]);
            }
        }
    };
    if(maxWid == 0) {
        maxWid = 8;
    }
    else {
        maxWid = maxWid + 2;
    }
    for(let i = 0; i < rowNum; i++){
        let rowString = "";
        for(let j = 0; j < colNum; j++){
            let index = rowColToIndex(board, i, j);
            let currVal = values[index];
            if(currVal == null) {
                rowString += "|" + " ".repeat(maxWid);
            }
            else{
                let endSpace = maxWid - 1 - wcwidth(currVal);
                rowString += "| " + currVal + " ".repeat(endSpace);
            }
        }
        rowString += "|";
        result += rowString + '\n';
    }
    let rowString = "|" + "-".repeat(maxWid) + ("+" + "-".repeat(maxWid)).repeat(colNum - 1) + "|";
    result += rowString + '\n';
    rowString = "";
    for(let i = 0; i < colNum; i++){
        let colLabel = String.fromCharCode(i + 65);
        rowString += "| " + colLabel + " ".repeat((maxWid - 2));
    }
    rowString += "|";
    result += rowString + '\n';
    return result.trim();
};





module.exports = {
    generateBoard: generateBoard,
    rowColToIndex: rowColToIndex,
    indexToRowCol: indexToRowCol,
    setCell: setCell,
    setCells: setCells,
    boardToString: boardToString
}
