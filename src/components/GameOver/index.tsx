import React from "react";

type Props = {
  score: number;
  resetGame: () => void;
};

export default function GameOver({ score, resetGame }: Props) {
  return (
    <div className="gameOverContainer">
      <div className="gameOver">Game Over! Your score is {score}</div>
      <button className="resetButton" type="reset" onClick={resetGame}>
        Reset
      </button>
    </div>
  );
}
