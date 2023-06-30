import { useState } from "react";
import "./App.css";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status = winner
    ? "Ganador: " + winner
    : "Siguiente jugador: " + (xIsNext ? "X" : "O");

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  return (
    <>
      <div className="status">{status}</div>
      {squares.map((item, index) => {
        if (index % 3 === 0) {
          return (
            <div key={index} className="board-row">
              {squares.map((element, iElement) => {
                if (iElement >= index && iElement < index + 3) {
                  return (
                    <Square
                      key={iElement}
                      value={element}
                      onSquareClick={() => handleClick(iElement)}
                    />
                  );
                }
              })}
            </div>
          );
        }
      })}
    </>
  );
}

function Move({ description, onJumpTo, isButton }) {
  return (
    <>
      {isButton ? (
        <button onClick={onJumpTo}>{description}</button>
      ) : (
        <p>{description}</p>
      )}
    </>
  );
}

function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    console.log([currentMove, nextMove]);
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    let currentAndNextSame = true;

    if (move > 0) {
      description = "Ir al movimiento #" + move;
    } else {
      description = "Ir al inicio del juego";
    }

    if (currentMove === move) {
      description = `Estás en el movimiento #${move}`;
      currentAndNextSame = false;
    }
    return (
      <li key={move}>
        <Move
          description={description}
          onJumpTo={() => jumpTo(move)}
          isButton={currentAndNextSame}
        ></Move>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
