import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { init } from "emoji-mart";
import type { EmojiData } from "./types";

init({ data });

type EmojiPickerProps = {
  onEmojiSelect?: (emoji: EmojiData) => void;
};

export const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  return (
    <div>
      <Picker
        autoFocus
        // dynamicWidth
        theme="light"
        locale="vi"
        previewPosition="none"
        skinTonePosition="none"
        emojiButtonRadius="6px"
        // emojiSize={10}
        onEmojiSelect={onEmojiSelect}
      />
    </div>
  );
};
export default EmojiPicker;
