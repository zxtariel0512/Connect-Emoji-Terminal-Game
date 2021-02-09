// require your module, connectmoji
// require any other modules that you need, like clear and readline-sync
const c = require('./connectmoji.js');
const readlineSync = require('readline-sync');
const clear = require('clear');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


// user controlled
if(process.argv.length === 2){
    // get meta data
    let answer = readlineSync.question("Enter the number of rows, columns, and consecutive \"pieces\" for win\n(all separated by commas... for example: 6,7,4)\n> ");
    let row = 0;
    let col = 0;
    let numConsecutive = 0;
    if(answer === ""){
        row = 6;
        col = 7;
        numConsecutive = 4;
    }
    else{
        const answerArr = answer.split(',');
        row = answerArr[0];
        col = answerArr[1];
        numConsecutive = answerArr[2];
    }
    console.log("Using row, col and consecutive: " + row + " " + col + " " + numConsecutive);
    answer = readlineSync.question("\nEnter two characters that represent the player and computer\n(separated by a comma... for example: P,C)\n> ");
    let user;
    let computer;
    if(answer === ""){
        user = "😎";
        computer = "💻";
    }
    else{
        const answerArr = [...answer];
        user = answerArr[0];
        computer = answerArr[answerArr.length - 1];
    }
    console.log("Using player and computer characters: " + user + " " + computer);
    answer = readlineSync.question("\nWho goes first, (P)layer or (C)omputer? (Notice: case sensitive!)\n> ");
    let lastPiece;
    if(answer === 'C'){
        console.log("Computer goes first");
        lastPiece = user;
    }
    else{
        console.log("Player goes first");
        lastPiece = computer;
    }
    console.log("\nPress <ENTER> to start game\n");
    answer = readlineSync.question("");
    // start the game
    const board = c.generateBoard(row, col);
    console.log(c.boardToString(board));
    const bigWhile = true;
    while(bigWhile){
        // check if has empty col
        const emptyCol = c.getAvailableColumns(board);
        if(emptyCol.length === 0){
            console.log("No winner. So sad :(");
            break;
        }
        // next turn user
        if(lastPiece !== user){
            let invalid = true;
            let answer = "";
            let position;
            while(invalid){
                answer = readlineSync.question("Choose a column letter to drop your piece in...\n");
                position = c.getEmptyRowCol(board, answer);
                if(position === null){
                    console.log("Sorry, your chosen column is invalid / does not have valid empty cell. Please choose another one.");
                }
                else{
                    invalid = false;
                }
            }
            const afterMoveBoard = c.setCell(board, position.row, position.col, user);
            clear();
            console.log("...dropping in column " + answer);
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
            console.log("Press <ENTER> to see computer move...");
            readlineSync.question("");
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

// scripted move
else{
    const raw = process.argv[2];
    // get metadata
    const rawArr = [...raw];
    const user = rawArr[0];
    let s = "";
    let rowNum = "";
    let colNum = "";
    let numConsecutive = "";
    let flag = 1;
    for(let i = 2; i < rawArr.length; i++){
        if(rawArr[i] !== ","){
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
    const result = c.autoplay(board, s, numConsecutive);
    let computer = "";
    if(result.pieces[0] === user){computer = result.pieces[1];}
    else{computer = result.pieces[0];}
    const newBoard = result.board;
    console.log("press ENTER to continue…");
    readlineSync.question("");
    console.log(c.boardToString(newBoard));
    if("winner" in result){
        console.log("Winner is " + result.winner + " !");
    }
    else{
        board.data = [...newBoard.data];
        let lastPiece = result.lastPieceMoved;
        const bigWhile = true;
        while(bigWhile){
            // check if has empty col
            const emptyCol = c.getAvailableColumns(board);
            if(emptyCol.length === 0){
                console.log("No winner. So sad :(");
                break;
            }
            // next turn user
            if(lastPiece !== user){
                let invalid = true;
                let answer = "";
                let position;
                while(invalid){
                    answer = readlineSync.question("Choose a column letter to drop your piece in...\n> ");
                    position = c.getEmptyRowCol(board, answer);
                    if(position === null){
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
                console.log("Press <ENTER> to see computer move...");
                readlineSync.question("");
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
