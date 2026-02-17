// make a board 3X3

function gameBoard() {
    const rows = 3
    const colums = 3
    const board = []
    
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < colums; j++) {
            board[i].push(cell());
        }
    }

    const getBoard = ()=> {
        console.log('Request board');
        return board
    }

    const printBoard = ()=> {
        const boardWithValue = board.map((ligne)=> ligne.map((cell) => cell.getValue()))
        return boardWithValue
    }

    const placeMark = function (row, colums, playerMark) {
        const selectedCell = board[row][colums]
        
        if (selectedCell.getValue()) {
            console.log("This cell is not valid");
            return false
        }
        
        selectedCell.changeValue(playerMark)
        return true
    }

    const resetBoard = function () {
        board.map((ligne)=> ligne.map((cell) => cell.resetCell()))
        return board
    }

    return { getBoard, printBoard, placeMark, resetBoard}
}

function cell() {
    let value = ""
    const getValue = ()=> value

    const changeValue = function (playerMark) {
        value = playerMark
        return value
    }

    const resetCell  = function () {
        value = ""
        return value
    }

    return { getValue, changeValue, resetCell}
}

function player(name, mark) {
    let playerName = name
    let playerMark = mark

    const getName = function () {
        return playerName
    }
    const getMark = function () {
        return playerMark
    }
    const updateName = function (newName) {
        playerName = newName
        return playerName
    }

    return { 
        getName, getMark, updateName
    }
}

function gameController() {
    const board = gameBoard()

    const playerOne = player('GuiGui', 'X')
    const playerTwo = player('Josie', 'O')


    let activePlayer = ""

    const getActivePlayer = ()=> activePlayer

    const switchTurn = function () {
        switch (activePlayer) {
            case playerOne:
                activePlayer = playerTwo
                break;
            case playerTwo:
                activePlayer = playerOne
                break;
        
            default:
                activePlayer = playerOne
                break;
        }
        return activePlayer
    }
    switchTurn()

    const playTurn = function (row, colums) {
        console.log(activePlayer);
        
        let mark = activePlayer.getMark()
        const success = board.placeMark(row, colums, mark)
        if (success) {
            console.log(`${activePlayer.getName()} has played,`);
            if (checkWinner()) {
                console.log(`${activePlayer.getName()} win !!!!`);
                return
            }
            if (checkDraw()) {
                console.log(`Its a draw`);
                return
            }
            switchTurn()
        }
        else {
            console.log(`${activePlayer.getName()} picked a bad case`);
        }
    }

    const checkWinner = function() {
        const grid  = board.printBoard()
        for (let i = 0; i < 3; i++) {
            const row = grid[i];
            if ( row[0] === row[2] && row[1] === row[2] && row[0] !== "" ) {
                return true
            }
        }
        for (let j = 0; j < 3; j++) {
            if ( grid[0][j] === grid[1][j] && grid[1][j] === grid[2][j] && grid[0][j] !== "" ) {
                return true
            }
        }
        if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2] && grid[0][0] !== "" ) {
            return true
        }
        if (grid[2][0] === grid[1][1] && grid[1][1] === grid[0][2] && grid[2][0] !== "" ) {
            return true
        }
    }

    const checkDraw = function () {
        const grid  = board.printBoard()
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[j][i] === "") {
                    return false
                }
            }
        }
        return true
    }   

    const resetGame = function () {
        board.resetBoard()
        activePlayer = ""
        switchTurn()
    }

    return {getActivePlayer, switchTurn, playTurn, board, playerOne, playerTwo, checkWinner, checkDraw , resetGame}
}




function screenController() {
    // commencer la partie fonction qui creer la partie
    const game = gameController()

    const getGame = ()=> game

    const boardElement = document.querySelector('#board')


    const renderBoard = function () {
        boardElement.replaceChildren()
        const grid = game.board.printBoard()
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cellValue = grid[i][j]
                const cell = document.createElement('div')
                cell.setAttribute('class', 'cell')

                // addEventListener
                cell.addEventListener('click', function () {
                    if (game.checkWinner() || game.checkDraw()) {
                        return
                    }
                    game.playTurn(i, j)
                    renderBoard()
                    renderPlayerTurn()
                    renderResult()
                })

                cell.textContent = cellValue
                boardElement.appendChild(cell)
            }
        }

    }

    const renderPlayerName = function () {
        const playerOneElement = document.querySelector('#player-one')
        const playerTwoElement = document.querySelector('#player-two')
        playerOneElement.textContent = game.playerOne.getName()
        playerTwoElement.textContent = game.playerTwo.getName()
    }
    renderPlayerName()

    const renderPlayerTurn = function () {
        let nextPlayer =  game.getActivePlayer().getName()
        const nextPlayerElement = document.querySelector('#player-turn')
        nextPlayerElement.textContent = `Next player is: ${nextPlayer}`
    }
    renderPlayerTurn()

    const btnResetGame = document.querySelector('#btn-reset')
    btnResetGame.addEventListener('click', function () {
        game.resetGame()
        renderBoard()  
        renderPlayerTurn()
        renderResult()
    })

    const renderResult = function () {
        const resultElement = document.querySelector('#result')
        if (game.checkWinner()) {
            let winner = game.getActivePlayer().getName()
            resultElement.textContent = `${winner} win`
        }
        else if (game.checkDraw()) {
            resultElement.textContent = `It's a draw!`
        }
        else{
            resultElement.textContent = ""
        }

    }


    const dialog = document.querySelector('#dialog')

    const btnStart = document.querySelector('#btn-start')
    btnStart.addEventListener('click', function (event) {
        dialog.showModal()
    })

    const btnValidateName = document.querySelector('#validate-name')
    btnValidateName.addEventListener('click', function (event) {
        event.preventDefault()
        const playerOneName = document.querySelector('#player-one-name')
        const playerTwoName = document.querySelector('#player-two-name')

        console.log(`${playerOneName.value} et ${playerTwoName.value}`);
        
        game.playerOne.updateName(playerOneName.value)
        game.playerTwo.updateName(playerTwoName.value)
        
        renderPlayerName()

        const form = document.querySelector('form')
        form.reset()
        dialog.close()
        renderPlayerTurn()
    })

    return { getGame , renderBoard, renderPlayerTurn}
}


const screen = screenController()
screen.renderBoard()

