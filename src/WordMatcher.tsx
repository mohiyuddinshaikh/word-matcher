import React, { useEffect, useRef, useState } from "react";
import "./WordMatcher.scss";
import { generate } from "random-words";

type Props = {};

var boardVar: string[] = drawInitialBoard();

function drawInitialBoard() {
  return Array(9).fill("");
}

export default function WordMatcher({}: Props) {
  const [board, setBoard] = useState<string[]>(drawInitialBoard());
  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      if (isGameOver) {
        clearInterval(wordInterval);
        return;
      }
      generateWordAndAddToBoard();
    }, 1000);

    const timeInterval = setInterval(() => {
      if (isGameOver) {
        clearInterval(timeInterval);
        return;
      }
      setTime((old) => old + 1);
    }, 1000);

    return () => {
      clearInterval(wordInterval);
      clearInterval(timeInterval);
    };
  }, [isGameOver]);

  function generateWordAndAddToBoard() {
    const word: string = generateRandomWord();
    addWordToBoard(word);
  }

  function generateRandomWord() {
    const randomWord = generate(1);
    return randomWord[0];
  }

  function addWordToBoard(word: string) {
    if (boardVar.includes(word)) {
      return;
    }
    const pushOnIndex = generateRandomNumber();
    if (pushOnIndex === undefined) {
      return;
    }
    if (!board.includes(word)) {
      setBoard((prev) => {
        const updatedWords = [...prev];
        updatedWords[pushOnIndex] = word;
        boardVar = [...updatedWords];
        checkIfGameOver(boardVar);
        return updatedWords;
      });
    }
  }

  function checkIfGameOver(board: string[]) {
    if (!board.includes("")) {
      endGame();
    }
  }

  function endGame() {
    setIsGameOver(true);
  }

  function generateRandomNumber() {
    if (!boardVar?.includes("")) {
      return;
    }
    const emptyIndices: number[] = [];
    boardVar.forEach((value, index) => {
      if (!!!value) {
        emptyIndices.push(index);
      }
    });
    const randomNumber =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    if (!!boardVar[randomNumber]) {
      return;
    }
    return randomNumber;
  }

  function matchWord() {
    if (!currentWord) {
      return;
    }
    if (boardVar.includes(currentWord)) {
      setBoard((oldBoard) => {
        const removeIndex = oldBoard.findIndex((item) => item === currentWord);
        const updatedBoard = [...oldBoard];
        updatedBoard[removeIndex] = "";
        boardVar = [...updatedBoard];
        return updatedBoard;
      });
      setCurrentWord("");
      setScore((old) => old + 1);
    }
  }

  function handleAddWord(e: React.ChangeEvent<HTMLInputElement>) {
    const word = e.target.value;
    setCurrentWord(word);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      matchWord();
    }
  };

  function resetGame() {
    setBoard(drawInitialBoard());
    boardVar = drawInitialBoard();
    setScore(0);
    setTime(0);
    setCurrentWord("");
    setIsGameOver(false);
  }

  return (
    <div className="wordMatchContainer">
      <div className="scoreboard">
        <div className="score">Score: {score}</div>
        <div className="time">Time: {time}</div>
      </div>
      {isGameOver ? (
        <>
          <div className="gameOver">Game Over! Your score is {score}</div>
          <button type="reset" onClick={resetGame}>
            Reset
          </button>
        </>
      ) : null}
      <div className="board">
        {board?.map((boardCell, index) => {
          return <div className="boardCell">{boardCell}</div>;
        })}
      </div>
      <div className="textBox">
        <input
          type="text"
          name="newword"
          onChange={handleAddWord}
          onKeyDown={handleKeyDown}
          value={currentWord}
          disabled={isGameOver}
          placeholder="Press Enter to Send"
        />
      </div>
    </div>
  );
}
