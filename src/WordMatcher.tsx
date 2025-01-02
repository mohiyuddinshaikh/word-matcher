import React, { useEffect, useRef, useState } from "react";
import "./WordMatcher.scss";
import { generate } from "random-words";
import Modal from "./components/Modal";
import Board from "./components/Board";
import Scoreboard from "./components/Scoreboard";
import GameOver from "./components/GameOver";
import WordInput from "./components/WordInput";

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
  const [startGame, setStartGame] = useState<boolean>(false);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] =
    useState<boolean>(true);

  const inputRef = useRef<null | HTMLInputElement>(null);

  const MAX_SPEED = 3;

  useEffect(() => {
    if (!startGame) {
      return;
    }
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
  }, [startGame, isGameOver, speed]);

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
    setStartGame(false);
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
    setSpeed(1);
    setIsInstructionsModalOpen(true);
  }

  const handleStartGame = () => {
    setIsInstructionsModalOpen(false);
    setStartGame(true);
    inputRef.current?.focus();
  };

  return (
    <div className="wordMatchContainer">
      <div className="gameName">Word Match</div>
      <div className="gameContainer">
        <Scoreboard score={score} time={time} speed={speed} board={board} />
        {isGameOver ? <GameOver score={score} resetGame={resetGame} /> : null}
        <Board board={board} currentWord={currentWord} />
        <WordInput
          inputRef={inputRef}
          handleAddWord={handleAddWord}
          handleKeyDown={handleKeyDown}
          currentWord={currentWord}
          isGameOver={isGameOver}
        />
      </div>
      <Modal
        isOpen={isInstructionsModalOpen}
        onClose={() => setIsInstructionsModalOpen(false)}
        title="Word Match"
      >
        <p>Type the displayed words as quickly as you can.</p>
        <p>Number of letters in each word is your score</p>
        <p>The game ends when the word grid fills up.</p>
        <div className="btnContainer">
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      </Modal>
    </div>
  );
}
