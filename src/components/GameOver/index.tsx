type Props = {
  score: number;
  resetGame: () => void;
};

export default function GameOver({ score, resetGame }: Props) {
  return (
    <div className="gameOverContainer">
      <div className="gameOver">
        Game Over! Your score is <span className="finalScore"> {score}</span>
      </div>
      <button className="resetButton" type="reset" onClick={resetGame}>
        Reset
      </button>
    </div>
  );
}
