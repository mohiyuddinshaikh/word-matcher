type Props = {
  score: number;
  time: number;
  speed: number;
  board: string[];
};

export default function Scoreboard({ score, time, speed, board }: Props) {
  const filledBlocks = () => {
    return board.filter((item) => item != "").length;
  };
  return (
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
  );
}
