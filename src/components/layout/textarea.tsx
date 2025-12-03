import * as React from "react";
import { Textarea, TextareaProps } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface CodeTextareaProps extends TextareaProps {}

const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Tab") {
    e.preventDefault();
    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;

    const value = target.value;
    target.value = value.substring(0, start) + "  " + value.substring(end);
    target.selectionStart = target.selectionEnd = start + 2;
  }
};

const CodeTextarea = React.forwardRef<HTMLTextAreaElement, CodeTextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <Textarea
        onKeyDown={handleKeyDown}
        ref={ref}
        className={cn(
          "font-mono whitespace-pre resize-y tab-size-[2] leading-5",
          "focus-visible:ring-2 focus-visible:ring-blue-500",
          className
        )}
        spellCheck={false}
        {...props}
      />
    );
  }
);

CodeTextarea.displayName = "CodeTextarea";

export {
    CodeTextarea
}