// 1. Collect the money
// 2. Determin how many rows to bet on
// 3. Collect the bet amout
// 4. spin the slot machine
// 5. check if the user won
// 6. give the user their winnning
// 7. play again?

const prompt = require("prompt-sync")()

const ROWS = 3
const COLS = 3

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
}

const SYMBOLS_VALUES = {
    A: 5,
    B: 6,
    C: 3,
    D: 1
}


const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ")
        const numberDepositAmount = parseFloat(depositAmount) //NaN

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            prompt("Invalid deposit. Try again.")
        } else {
            return numberDepositAmount
        }
    }
}

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3) ")
        const numberOfLines = parseFloat(lines) //NaN

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            prompt("Invalid number of lines. Try again.")
        } else {
            return numberOfLines
        }
    }
}

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the bet amount per line: ")
        const numberBet = parseFloat(bet) //NaN

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            prompt("Invalid bet, try again.")
        } else {
            return numberBet
        }
    }
}

const spin = () => {
    const symbols = []
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol)
        }
    }
    const reels = []
    for (let i = 0; i < COLS; i++) {
        reels.push([])
        const reelSymbols = [...symbols]
        for (let j = 0; j < ROWS; j++) {
            const randomindex = Math.floor(Math.random() * reelSymbols.length)
            const selectedSymbol = reelSymbols[randomindex]
            reels[i].push(selectedSymbol)
            reelSymbols.slice(randomindex, 1)
        }
    }
    return reels
}

const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([])
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i])
        }
    }
    return rows
}

const printRows = (spinReel) => {
    for (const row of spinReel) {
        let rowString = ""
        for (const [i, symbol] of row.entries()) {
            rowString += symbol
            if (i != row.length - 1) {
                rowString += "|"
            }
        }
        console.log(rowString)
    }
}

const getWinnings = (spinReel, bet, lines) => {
    let winnings = 0
    for (let row = 0; row < lines; row++) {
        const symbols = spinReel[row]
        let allSame = true
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false
                break
            }
        }
        if (allSame) {
            winnings += bet * SYMBOLS_VALUES[symbols[0]]
        }
    }
    return winnings
}

const game = () => {
    let balance = deposit()
    while (true) {
        const numberOfLines = getNumberOfLines()
        const bet = getBet(balance, numberOfLines)
        balance -= bet * numberOfLines;
        const reels = spin()
        const spinReel = transpose(reels)
        printRows(spinReel)
        const winngings = getWinnings(spinReel, bet, numberOfLines)
        console.log(`You have won $${winngings}`)
        balance += winngings
        if (balance <= 0) {
            console.log("You have run out of money!")
            break
        }
        console.log(`You have balance of $${balance}`)
        const playAgain = prompt("Do you want to continue (y/n)?")
        if (playAgain != 'y') break        
    }
}


game();




