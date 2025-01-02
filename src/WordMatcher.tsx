import React, { useEffect, useRef, useState } from "react";
import "./WordMatcher.scss";
import { generate } from "random-words";

type Props = {};

var boardVar: string[] = drawInitialBoard();

function drawInitialBoard() {
  return Array(9).fill("");
}

/**
 * TODO
 * put logic in a hook
 */

export default function WordMatcher({}: Props) {
  const [board, setBoard] = useState<string[]>(drawInitialBoard());
  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [speed, setSpeed] = useState(1);

  const inputRef = useRef<null | HTMLInputElement>(null);

  const MAX_SPEED = 3;

  useEffect(() => {
    const wordInterval = setInterval(() => {
      if (isGameOver) {
        clearInterval(wordInterval);
        return;
      }
      generateWordAndAddToBoard();
    }, speedOfWords());

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
  }, [isGameOver, speed]);

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  const speedOfWords = () => {
    return (MAX_SPEED + 1 - speed) * 1000;
  };

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
    if (
      boardVar
        .map((word) => word.toLowerCase())
        .includes(currentWord.toLowerCase())
    ) {
      setBoard((oldBoard) => {
        const removeIndex = oldBoard.findIndex(
          (item) => item.toLowerCase() === currentWord.toLowerCase()
        );
        const updatedBoard = [...oldBoard];
        updatedBoard[removeIndex] = "";
        boardVar = [...updatedBoard];
        return updatedBoard;
      });
      setCurrentWord((oldCurrentWord) => {
        setScore((old) => {
          const newScore = old + oldCurrentWord.length;
          calculateSpeed(newScore);
          return newScore;
        });
        return "";
      });
    }
  }

  function calculateSpeed(newScore: number) {
    if (speed === 3) {
      return 3;
    }
    switch (true) {
      case newScore > 70:
        updateSpeed(3);
        break;
      case newScore > 30:
        updateSpeed(2);
        break;
    }
  }

  function updateSpeed(newSpeed: number) {
    setSpeed(newSpeed);
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

  const filledBlocks = () => {
    return board.filter((item) => item != "").length;
  };

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const getHighlightedText = (word: string, input: string) => {
    const sanitizedInput = escapeRegExp(input);
    const regex = new RegExp(`(${sanitizedInput})`, "gi");
    return word.split(regex).map((part, index) => (
      <span
        key={index}
        style={{
          color:
            part.toLowerCase() === sanitizedInput.toLowerCase()
              ? "limegreen"
              : "white",
        }}
      >
        {part}
      </span>
    ));
  };

  return (
    <div className="wordMatchContainer">
      <div className="gameContainer">
        <div className="scoreboard">
          <div className="rowOne">
            <div className="score">Score: {score}</div>
            <div className="time">
              Filled: {filledBlocks()}/{board.length}
            </div>
          </div>
          <div className="rowTwo">
            <div className="time">Time: {time}</div>
            <div className="score">Speed: {speed}x</div>
          </div>
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
            return (
              <div className="boardCell" key={index}>
                {currentWord
                  ? getHighlightedText(boardCell, currentWord)
                  : boardCell}
              </div>
            );
          })}
        </div>
        <div className="textBox">
          <input
            ref={inputRef}
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
    </div>
  );
}
