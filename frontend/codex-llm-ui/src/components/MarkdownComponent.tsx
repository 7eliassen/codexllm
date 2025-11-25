import Markdown from 'react-markdown'
import type { MarkdownProps } from "../types/types";
import remarkGfm from 'remark-gfm'

function MarkdownComponent({markdownText}: MarkdownProps) {
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

  const markDownClean = cleanServerMarkdown(markdownText)

  // TODO: Need to finish md rendering
  return (
    <section>
        <Markdown remarkPlugins={[remarkGfm]}>{markDownClean}</Markdown>
    </section>
  )
}

export default MarkdownComponent;