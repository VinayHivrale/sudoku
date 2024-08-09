import React, { useState, useEffect } from 'react';

const Board = () => {
    const initialGrid = Array(9).fill().map(() => Array(9).fill(''));

    const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
    const [grid, setGrid] = useState(initialGrid);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [intialGrid, setIntialGrid] = useState(initialGrid);
   

    useEffect(() => {
        let timer;
        if (isTimerRunning) {
            timer = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (!isTimerRunning && elapsedTime !== 0) {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isTimerRunning]);

    const isValid = (grid, row, col, num) => {
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num || grid[x][col] === num ||
                grid[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
                return false;
            }
        }
        return true;
    };

    
   



    const solveSudoku = (grid) => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === '') {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (solveSudoku(grid)) {
                                return true;
                            } else {
                                grid[row][col] = '';
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };

    const removeNumbers = (grid, count) => {
        let attempts = count;
        while (attempts > 0) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (grid[row][col] !== '') {
                grid[row][col] = '';
                attempts--;
            }
        }
    };

    const newGame = () => {
        const newGrid = Array(9).fill().map(() => Array(9).fill(''));
        solveSudoku(newGrid);  // Generate a complete solution
        removeNumbers(newGrid, 1);  // Remove 64 numbers to create the puzzle
        setGrid(newGrid);
        setIntialGrid(newGrid); // Set the grid to the generated puzzle
        setSelectedCell({ row: null, col: null });
        setElapsedTime(0);
        setIsTimerRunning(true);
    };

    const handleCellClick = (row, col) => {
        setSelectedCell({ row, col });
    };

    const handleButtonClick = (value) => {
        if (selectedCell.row !== null && selectedCell.col !== null && intialGrid[selectedCell.row][selectedCell.col] === '') {
            const newGrid = grid.map((row, rowIndex) =>
                row.map((cell, colIndex) =>
                    rowIndex === selectedCell.row && colIndex === selectedCell.col ? String(value) : cell
                )
            );

            setGrid(newGrid);

           
        }
    };

    const handleClear = () => {
        if (selectedCell.row !== null && selectedCell.col !== null && intialGrid[selectedCell.row][selectedCell.col] === '') {
            const newGrid = grid.map((row, rowIndex) =>
                row.map((cell, colIndex) =>
                    rowIndex === selectedCell.row && colIndex === selectedCell.col ? '' : cell
                )
            );
            setGrid(newGrid);
        }
    };

    const createGrid = () => {
        let rows = [];
        for (let i = 0; i < 9; i++) {
            let cells = [];
            for (let j = 0; j < 9; j++) {
                const isBorderRow = i % 3 === 0;
                const isBorderCol = j % 3 === 0;
                cells.push(
                    <input
                        key={`${i}-${j}`}
                        type="text"
                        maxLength="1"
                        value={grid[i][j]}
                        onClick={() => handleCellClick(i, j)}
                        onChange={(e) => {
                            if (e.target.value === '') {
                                handleClear();
                            } else {
                                handleButtonClick(e.target.value);
                            }
                        }}
                        className={`border font-semibold caret-transparent border-blue-700 w-10 h-10 text-center ${
                            selectedCell.row === i && selectedCell.col === j ? '' : ''
                        } ${intialGrid[i][j] !== '' ? 'bg-blue-400 text-black font-semibold' : ''} ${
                            isBorderRow ? 'border-t-4' : ''
                        } ${
                            isBorderCol ? 'border-l-4' : ''
                        }`}
                        readOnly={true}
                    />
                );
            }
            rows.push(
                <div key={i} className="flex">
                    {cells}
                </div>
            );
        }
        return rows;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex bg-gray-800 flex-col items-center h-screen space-y-4">
            <div className="text-4xl font-bold mt-4 text-white border-b-4 border-blue-500 pb-2">
                Sudoku
            </div>
            <div className="flex flex-col shadow-sm">
                {createGrid()}
            </div>
            <div className="text-xl text-white font-semibold">
                Time: {formatTime(elapsedTime)}
            </div>
            <div className="flex flex-col space-y-3 space-x-1">
            <div></div>
                <div className='space-x-2'>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleButtonClick(num)}
                            className="bg-black text-white w-10 h-10 rounded"
                        >
                            {num}
                        </button>
                    ))}
                </div>
                <div className='space-x-2'>
                    {[6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleButtonClick(num)}
                            className="bg-black text-white w-10 h-10 rounded"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={handleClear}
                        className="bg-red-500 text-white w-10 h-10 rounded"
                    >
                        ✘
                    </button>
                </div>
                <button
                    onClick={newGame}
                    className="bg-green-500 text-white w-full h-12 rounded mt-4"
                >
                    New Game
                </button>
            </div>
        </div>
    );
};

export default Board;
