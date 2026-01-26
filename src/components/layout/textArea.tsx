
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
type DraftState = Record<string, Record<string, string> | null>;
type SetDraft = React.Dispatch<React.SetStateAction<DraftState>>;

interface CodeTextArea {
  className: string;
  value: string;
  bind: string;
  state: DraftState;
  setDraft: SetDraft;
  label?: string;
  disabled?: boolean;
}

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

export const CodeTextarea = ({ className, value, bind, state, setDraft, label, disabled }: CodeTextArea) => {
  const [raw, setRaw] = useState(() => JSON.stringify(value, null, 2));
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRaw(text);
    try {
      const parsed = JSON.parse(text) as Record<string, string> | null;
      setDraft({ ...state, [bind]: parsed })
    } catch (_) {
      //
    }
  };

  return (
    <div data-testid="code-textarea" className="flex min-h-[100%] flex-col">
      {label && <Label className="text-xs font-bold py-4">{label}</Label>}

      <ScrollArea>
        <Textarea
          wrap="soft"
          className={cn(
            "min-h-[300px]",
            "font-mono resize-y leading-5 tab-size-[2]",
            "whitespace-pre resize-y tab-size-[2] leading-5",
            "focus-visible:ring-2 focus-visible:ring-blue-500",
          )}
          disabled={disabled}
          spellCheck={false}
          value={raw}
          onChange={handleChange}
        />
      </ScrollArea>
    </div>
  );
}

export const LabeledTextArea = ({ label, className, value, bind, state, setDraft }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setDraft({ ...state, [bind]: text })
  };

  return (
    <div key={label}>
      <Label className="text-xs">{label}</Label>
      <Textarea
        onKeyDown={handleKeyDown}
        className={cn(
          "min-h-[300px]",
          "font-mono whitespace-pre resize-y tab-size-[2] leading-5",
          "focus-visible:ring-2 focus-visible:ring-blue-500", 
          className
        )}
        spellCheck={false}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
LabeledTextArea.displayName = "LabeledTextArea"
CodeTextarea.displayName = "CodeTextarea";
