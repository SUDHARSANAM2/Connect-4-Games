// Game state
let currentPlayer = 1;
let gameBoard = Array(6).fill().map(() => Array(7).fill(0));
let gameOver = false;
let moveCount = 0;

// Initialize the game
function initGame() {
    createBoard();
    createColumnIndicators();
    updatePlayerDisplay();
}

// Create the visual board
function createBoard() {
    const boardGrid = document.getElementById('board-grid');
    boardGrid.innerHTML = '';

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => handleCellClick(col));
            boardGrid.appendChild(cell);
        }
    }
}

// Create column indicator buttons
function createColumnIndicators() {
    const columnIndicator = document.getElementById('column-indicator');
    columnIndicator.innerHTML = '';

    for (let col = 0; col < 7; col++) {
        const btn = document.createElement('button');
        btn.className = 'column-btn';
        btn.textContent = '↓';
        btn.onclick = () => handleCellClick(col);
        btn.id = `col-btn-${col}`;
        columnIndicator.appendChild(btn);
    }
}

// Handle cell/column click
function handleCellClick(col) {
    if (gameOver) return;

    const row = getLowestEmptyRow(col);
    if (row === -1) return; // Column is full

    // Place piece
    gameBoard[row][col] = currentPlayer;
    animatePieceDrop(row, col);

    moveCount++;

    // Check for win
    if (checkWin(row, col)) {
        gameOver = true;
        document.getElementById('game-status').innerHTML =
            `<span class="winner">Player ${currentPlayer} Wins! 🎉</span>`;
        disableAllColumns();
        return;
    }

    // Check for draw
    if (moveCount === 42) {
        gameOver = true;
        document.getElementById('game-status').innerHTML =
            `<span class="draw">It's a Draw! 🤝</span>`;
        return;
    }

    // Switch player
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updatePlayerDisplay();
}

// Get the lowest empty row in a column
function getLowestEmptyRow(col) {
    for (let row = 5; row >= 0; row--) {
        if (gameBoard[row][col] === 0) {
            return row;
        }
    }
    return -1;
}

// Animate piece drop
function animatePieceDrop(row, col) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const piece = document.createElement('div');
    piece.className = `piece player${currentPlayer}`;

    cell.appendChild(piece);
    cell.classList.add('filled');

    // Update column button state
    if (getLowestEmptyRow(col) === -1) {
        document.getElementById(`col-btn-${col}`).disabled = true;
    }
}

// Check for win condition
function checkWin(row, col) {
    const directions = [
        [0, 1],   // horizontal
        [1, 0],   // vertical
        [1, 1],   // diagonal /
        [1, -1]   // diagonal \
    ];

    for (let [dRow, dCol] of directions) {
        let count = 1;
        let winningCells = [[row, col]];

        // Check in positive direction
        let r = row + dRow;
        let c = col + dCol;
        while (r >= 0 && r < 6 && c >= 0 && c < 7 && gameBoard[r][c] === currentPlayer) {
            winningCells.push([r, c]);
            count++;
            r += dRow;
            c += dCol;
        }

        // Check in negative direction
        r = row - dRow;
        c = col - dCol;
        while (r >= 0 && r < 6 && c >= 0 && c < 7 && gameBoard[r][c] === currentPlayer) {
            winningCells.push([r, c]);
            count++;
            r -= dRow;
            c -= dCol;
        }

        if (count >= 4) {
            highlightWinningCells(winningCells);
            return true;
        }
    }

    return false;
}

// Highlight winning cells
function highlightWinningCells(cells) {
    cells.forEach(([row, col]) => {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add('winning-line');
    });
}

// Update player display
function updatePlayerDisplay() {
    document.getElementById('current-player-text').textContent = `Player ${currentPlayer}`;
    const indicator = document.getElementById('player-indicator');
    indicator.className = `player-indicator player${currentPlayer}`;
}

// Disable all column buttons
function disableAllColumns() {
    for (let col = 0; col < 7; col++) {
        document.getElementById(`col-btn-${col}`).disabled = true;
    }
}

// Reset game
function resetGame() {
    currentPlayer = 1;
    gameBoard = Array(6).fill().map(() => Array(7).fill(0));
    gameOver = false;
    moveCount = 0;

    document.getElementById('game-status').innerHTML = '';

    // Clear board
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('filled', 'winning-line');
    });

    // Re-enable column buttons
    for (let col = 0; col < 7; col++) {
        document.getElementById(`col-btn-${col}`).disabled = false;
    }

    updatePlayerDisplay();
}

// Initialize game when page loads
window.addEventListener('load', initGame);
