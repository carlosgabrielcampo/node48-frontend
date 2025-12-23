
import { Textarea, TextareaProps } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if(e.key === "Tab") {
    e.preventDefault();
    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const value = target.value;
    target.value = value.substring(0, start) + "  " + value.substring(target.selectionEnd);
    target.selectionStart = target.selectionEnd = start + 2;
  }
};

export const CodeTextarea = ({ className, value, bind, state, setDraft }) => {
  console.log({className, value, bind, state, setDraft})
  const [raw, setRaw] = useState(() => JSON.stringify(value || {}, null, 2));

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRaw(text);
    try {
      const parsed = JSON.parse(text);
      setDraft({ ...state, [bind]: parsed })
    } catch (_) {
      //
    }
  };

  return (
    <Textarea
      onKeyDown={handleKeyDown}
      className={cn(
        "min-h-[300px]",
        "font-mono whitespace-pre resize-y tab-size-[2] leading-5",
        "focus-visible:ring-2 focus-visible:ring-blue-500", 
        className
      )}
      spellCheck={false}
      value={raw}
      onChange={handleChange}
    />
  );
}

CodeTextarea.displayName = "CodeTextarea";
