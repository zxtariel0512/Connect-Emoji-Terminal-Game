// implement your functions here
// ...don't forget to export functions!

const wcwidth = require("wcwidth");

function generateBoard(rows, cols, fill = null){
    const board = {
        data: new Array(rows * cols).fill(fill),
        rows: rows,
        cols: cols
    };
    return board;
}

function rowColToIndex(board, row, col){
    const colNum = board.cols;
    const index = col + row * colNum;
    return index;
}

function indexToRowCol(board, i){
    const position = {
        row: parseInt(i / board.cols),
        col: i % board.cols
    };
    return position;
}

function setCell(board, row, col, value){
    const index = rowColToIndex(board, row, col);
    const newData = [...board.data];
    newData[index] = value;
    const newBoard = {
        data: newData,
        rows: board.rows,
        cols: board.cols
    };
    return newBoard;
}

function setCells(board, ...obj){
    const rowNum = board.rows;
    const colNum = board.cols;
    const currBoardData = [...board.data];
    const currBoard = {
        data: currBoardData,
        rows: rowNum,
        cols: colNum
    };
    for(let i = 0; i < obj.length; i++){
        const currObj = obj[i];
        const newBoard = setCell(currBoard, currObj.row, currObj.col, currObj.val);
        currBoard.data = [...newBoard.data];
    }
    return currBoard;
}

function boardToString(board){
    const rowNum = board.rows;
    const colNum = board.cols;
    const values = [...board.data];
    let result = "";
    let maxWid = 0;
    for(let i = 0; i < values.length; i++){
        if(values[i] !== null){
            if(wcwidth(values[i]) > maxWid) {
                maxWid = wcwidth(values[i]);
            }
        }
    }
    if(maxWid === 0) {
        maxWid = 4;
    }
    else {
        maxWid = maxWid + 2;
    }
    for(let i = 0; i < rowNum; i++){
        let rowString = "";
        for(let j = 0; j < colNum; j++){
            const index = rowColToIndex(board, i, j);
            const currVal = values[index];
            if(currVal === null) {
                rowString += "|" + " ".repeat(maxWid);
            }
            else{
                const endSpace = maxWid - 1 - wcwidth(currVal);
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
        const colLabel = String.fromCharCode(i + 65);
        rowString += "| " + colLabel + " ".repeat((maxWid - 2));
    }
    rowString += "|";
    result += rowString + '\n';
    return result.trim();
}

function letterToCol(letter){
    if(letter.length === 1){
        const ascii = letter.charCodeAt(0);
        if(ascii >= 65 && ascii <= 90){
            return ascii - 65;
        }
        else{
            return null;
        }
    }
    else{
        return null;
    }
}

function getEmptyRowCol(board, letter, empty = null){
    const rowNum = board.rows;
    const colNum = board.cols;
    const values = [...board.data];
    const colIdx = letterToCol(letter);
    if(colIdx === null || colIdx > colNum - 1){
        return null;
    }
    let rowIdx = -1;
    for(let i = rowNum - 1; i >= 0; i--){
        const oneIdx = rowColToIndex(board, i, colIdx);
        if(values[oneIdx] === empty){
            if(i > rowIdx){
                rowIdx = i;
            }
        }
        else{
            rowIdx = -1;
        }
    }
    if(rowIdx === -1) {return null;}
    return {row: rowIdx, col: colIdx};
}

function getAvailableColumns(board){
    const result = new Array();
    const rowNum = board.rows;
    const colNum = board.cols;
    const values = [...board.data];
    for(let i = 0; i < colNum; i++){
        let add = false;
        for(let j = 0; j < rowNum; j++){
            if(values[rowColToIndex(board, j, i)] === null){
                add = true;
            }
        }
        if(add === true){
            result.push(String.fromCharCode(i + 65));
        }
    }
    return result;
}

function hasConsecutiveValues(board, row, col, n){
    if(n === 1){
        return true;
    }
    const rowNum = board.rows;
    const colNum = board.cols;
    const values = [...board.data];
    const pattern = values[rowColToIndex(board, row, col)];
    // horizontal check
    let consec = 0;
    for(let i = col; i >= 0; i--){
        if(values[rowColToIndex(board, row, i)] === pattern){
            consec += 1;
        }
        else {break;}
    }
    for(let i = col; i < colNum; i++){
        if(values[rowColToIndex(board, row, i)] === pattern){
            consec += 1;
        }
        else {break;}
    }
    if(consec - 1 >= n){
        return true;
    }
    // vertical check
    consec = 0;
    for(let i = row; i >= 0; i--){
        if(values[rowColToIndex(board, i, col)] === pattern){
            consec += 1;
        }
        else {break;}
    }
    for(let i = row; i < rowNum; i++){
        if(values[rowColToIndex(board, i, col)] === pattern){
            consec += 1;
        }
        else {break;}
    }
    if(consec - 1 >= n){
        return true;
    }
    // \ diagonal check
    consec = 0;
    let i = row; 
    let j = col;
    while(i >= 0 && j >= 0){
        if(values[rowColToIndex(board, i, j)] === pattern) {
            consec += 1;
            i--;
            j--;
        }
        else {break;}
    }
    i = row;
    j = col;
    while(i < rowNum && j < colNum){
        if(values[rowColToIndex(board, i, j)] === pattern) {
            consec += 1;
            i++;
            j++;
        }
        else {break;}
    }
    if(consec - 1 >= n) {return true;}
    // / diagonal check
    consec = 0;
    i = row;
    j = col;
    while(i >= 0 && j < colNum){
        if(values[rowColToIndex(board, i, j)] === pattern) {
            consec += 1;
            i--;
            j++;
        }
        else {break;}
    }
    i = row;
    j = col;
    while(i < rowNum && j >= 0){
        if(values[rowColToIndex(board, i, j)] === pattern) {
            consec += 1;
            i++;
            j--;
        }
        else {break;}
    }
    if(consec - 1 >= n) {return true;}
    return false;
}

function autoplay(board, s, numConsecutive){
    const result = {};
    // const rowNum = board.rows;
    // const colNum = board.cols;
    const sArr = [...s];
    result["pieces"] = [sArr[0], sArr[1]];
    if(sArr.length === 2){
        result["board"] = board;
        return result;
    }
    for(let i = 2; i < sArr.length; i++){
        const empPos = getEmptyRowCol(board, sArr[i]);
        // invalid move, no valid empty cell, etc
        if(empPos === null){
            result["board"] = null;
            result["lastPieceMoved"] = sArr[i % 2];
            const error = {num: i - 1, val: sArr[i % 2], col: sArr[i]};
            result["error"] = error;
            return result;
        }
        // make move
        const empRow = empPos.row;
        const newBoard = setCell(board, empRow, letterToCol(sArr[i]), sArr[i % 2]);
        // check if win
        if(hasConsecutiveValues(newBoard, empRow, letterToCol(sArr[i]), numConsecutive)){
            // check if still has other moves
            if(i < sArr.length - 1){
                result["board"] = null;
                result["lastPieceMoved"] = sArr[(i + 1) % 2];
                const error = {num: i, val: sArr[(i + 1) % 2], col: sArr[i + 1]};
                result["error"] = error;
                return result;
            }
            result["board"] = newBoard;
            result["lastPieceMoved"] = sArr[i % 2];
            result["winner"] = sArr[i % 2];
            return result;
        }
        // update board
        board.data = [...newBoard.data];
    }
    result["board"] = board;
    result["lastPieceMoved"] = sArr[(sArr.length - 1) % 2];
    return result;
}




module.exports = {
    generateBoard: generateBoard,
    rowColToIndex: rowColToIndex,
    indexToRowCol: indexToRowCol,
    setCell: setCell,
    setCells: setCells,
    boardToString: boardToString,
    letterToCol: letterToCol,
    getEmptyRowCol: getEmptyRowCol,
    getAvailableColumns: getAvailableColumns,
    hasConsecutiveValues: hasConsecutiveValues,
    autoplay: autoplay
};
