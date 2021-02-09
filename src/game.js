// require your module, connectmoji
// require any other modules that you need, like clear and readline-sync
const c = require('./connectmoji.js');
const readlineSync = require('readline-sync');
const clear = require('clear');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// scripted move
const raw = process.argv[2];
if(raw == null){
    console.log("interactive mode");
}
else{
    // get metadata
    const rawArr = [...raw];
    const user = rawArr[0];
    let s = "";
    let rowNum = "";
    let colNum = "";
    let numConsecutive = "";
    let flag = 1;
    for(let i = 2; i < rawArr.length; i++){
        if(rawArr[i] != ","){
            if(flag === 1){
                s += rawArr[i];
            }
            else if(flag === 2){
                rowNum += rawArr[i];
            }
            else if(flag === 3){
                colNum += rawArr[i];
            }
            else{
                numConsecutive += rawArr[i];
            }
        }
        else{
            flag++;
        }
    }
    rowNum = parseInt(rowNum);
    colNum = parseInt(colNum);
    numConsecutive = parseInt(numConsecutive);
    const board = c.generateBoard(rowNum, colNum);
    let result  = c.autoplay(board, s, numConsecutive);
    let computer = "";
    if(result.pieces[0] == user){computer = result.pieces[1];}
    else{computer = result.pieces[0];}
    let newBoard = result.board;
    console.log("press ENTER to continue…");
    let stop = readlineSync.question("");
    console.log(c.boardToString(newBoard));
    if(result.hasOwnProperty("winner")){
        console.log("Winner is " + result.winner + " !");
    }
    else{
        board.data = [...newBoard.data];
        let lastPiece = result.lastPieceMoved;
        while(true){
            // check if has empty col
            const emptyCol = c.getAvailableColumns(board);
            if(emptyCol.length == 0){
                console.log("No winner. So sad :(");
                break;
            }
            // next turn user
            if(lastPiece != user){
                let invalid = true;
                let answer = "";
                let position;
                while(invalid){
                    answer = readlineSync.question("Choose a column letter to drop your piece in...\n");
                    position = c.getEmptyRowCol(board, answer);
                    if(position == null){
                        console.log("Sorry, your chosen column is invalid / does not have valid empty cell. Please choose another one.");
                    }
                    else{
                        invalid = false;
                    }
                }
                console.log("...dropping in column " + answer);
                const afterMoveBoard = c.setCell(board, position.row, position.col, user);
                clear();
                console.log(c.boardToString(afterMoveBoard));
                // check win
                if(c.hasConsecutiveValues(afterMoveBoard, position.row, position.col, numConsecutive)){
                    console.log("Winner is " + user + " !");
                    break;
                }
                lastPiece = user;
                board.data = [...afterMoveBoard.data];
            }
            // next turn computer
            else{
                const randIdx = getRandomInt(emptyCol.length);
                const pos = c.getEmptyRowCol(board, emptyCol[randIdx]);
                const afterMoveBoard = c.setCell(board, pos.row, pos.col, computer);
                clear();
                console.log(c.boardToString(afterMoveBoard));
                // check win
                if(c.hasConsecutiveValues(afterMoveBoard, pos.row, pos.col, numConsecutive)){
                    console.log("Winner is " + computer + " !");
                    break;
                }
                lastPiece = computer;
                board.data = [...afterMoveBoard.data];
            }
        }
    }
}
