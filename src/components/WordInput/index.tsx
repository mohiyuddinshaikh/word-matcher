import React from "react";

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  handleAddWord: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  currentWord: string;
  isGameOver: boolean;
};

export default function WordInput({
  inputRef,
  handleAddWord,
  handleKeyDown,
  currentWord,
  isGameOver,
}: Props) {
  return (
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
  );
}
