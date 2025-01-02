type Props = {
  board: string[];
  currentWord: string;
};

export default function Board({ board, currentWord }: Props) {
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
  );
}
