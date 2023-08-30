/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaArrowDownWideShort, FaArrowUpShortWide } from "react-icons/fa6";
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
    console.log("onSquareClick: ", i)
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    onPlay(nextSquares);
  }

  return (
    <>
      <div className="status">{status}</div>
      {squares.map((item, indexRow) => {
        if (indexRow % 3 === 0) {
          return (
            <div key={indexRow} className="board-row">
              {squares.map((element, indexColumn) => {
                if (indexColumn >= indexRow && indexColumn < indexRow + 3) {
                  return (
                    <Square
                      key={indexColumn}
                      value={element}
                      onSquareClick={() => handleClick(indexColumn)}
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
        <p onClick={onJumpTo}>{description}</p>
      )}
    </>
  );
}

function MoveList({initialMoves}) {
  console.log(initialMoves)
  return (
    <>
      <ol>
      {initialMoves}
    </ol>
    </>
  );
}

function OrderMoves({orderMoves, onOrder}) {
  //const [order, setOrder] = useState(initialOrderMoves);
  return (
    <>
      <div>
        <button onClick={onOrder}>
          {orderMoves ? (
            <FaArrowDownWideShort />
          ) : (
            <FaArrowUpShortWide />
          )}
        </button>
      </div>
    </>
  );
}

function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [movesH, setmovesH] = useState(Array(9).fill(null));
  const [currentMove, setCurrentMove] = useState(0);
  const [orderMoves, setOrderMoves] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setmovesH(loopHistory(history))
  }

  function handleOrder() {
    //setmovesH(history)
    console.log("CurrentMove ", currentMove);
    setOrderMoves(!orderMoves);
    const descMoves = movesH.reverse();
    setmovesH(descMoves);
    //console.log("DESC Post moves",movesH);
  }

  function jumpTo(nextMove) {
    console.log("Next: " + nextMove);
    setCurrentMove(nextMove);
    console.log("currentMove", currentMove);
  }

  function loopHistory(historyToLoop){
    const loopMoves = historyToLoop.map((squares, move) => {
      console.log(currentMove, move);
      let description;
      let currentAndNextSame = true;
  
      //if (move > 0) {
        description = "Ir al movimiento #" + move;
      /*} else {
        description = "Ir al inicio del juego";
      }*/
  
      if (currentMove === move) {
        description = `Estás en el movimiento #${move}`;
        currentAndNextSame = false;
      }
      return (
        <li key={move}>
          <Move
            description={description}
            onJumpTo={() => jumpTo(move+1)}
            isButton={currentAndNextSame}
          ></Move>
        </li>
      );
    })
    return loopMoves;
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <OrderMoves orderMoves={orderMoves} onOrder={handleOrder}/>
        <MoveList initialMoves={movesH} />
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
