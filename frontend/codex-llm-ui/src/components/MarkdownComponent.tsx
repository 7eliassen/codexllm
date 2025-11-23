import ReactMarkdown from "react-markdown";
import type { MarkdownProps } from "../types/types";


function MarkdownComponent({markdownText}: MarkdownProps) {
    console.log(markdownText)
    function cleanServerMarkdown(text: string) {
    let clean = text.trim()

    // LLM can wrap text in code block
    if (clean.startsWith("```markdown") && clean.endsWith("```")) {
        clean = clean
        .split("\n")
        .slice(1, -1)
        .join("\n")
    }

    return clean
    }

    const cleanText = cleanServerMarkdown(markdownText)

  return (
    <section>
      <ReactMarkdown>{cleanText}</ReactMarkdown>
    </section>
  )
}

export default MarkdownComponent;