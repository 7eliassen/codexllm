import Markdown from 'react-markdown'
import type { MarkdownProps } from "../types/types";
import remarkGfm from 'remark-gfm'
import type {ReactNode} from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark, docco, dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs'; // или любой другой стиль

interface PreProps {
  node?: any
  children?: ReactNode
  [key: string]: any
}

function MarkdownComponent({ markdownText }: MarkdownProps) {

  function cleanServerMarkdown(text: string): string {
    let clean = text.trim()

    if (clean.startsWith("```markdown") && clean.endsWith("```")) {
      clean = clean
        .split("\n")
        .slice(1, -1)
        .join("\n")
    }

    return clean
  }

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const components = {
    pre: ({ node, children, ...props }: PreProps) => {
      // Если это не код, возвращаем обычный pre
      if (!node?.children?.[0] || node.children[0].type !== 'element' || node.children[0].tagName !== 'code') {
        return <pre {...props}>{children}</pre>
      }

      const codeElement = node.children[0]
      const code = codeElement.children?.[0]?.value || ''
      const languageClass = codeElement.properties?.className?.[0] as string | undefined
      const language = languageClass?.replace('language-', '') || 'text'
      
      return (
        <div className="code-block-wrapper">
          <div className="code-header">
            <span className="code-language">{language}</span>
            <button 
              className="copy-button"
              onClick={() => copyToClipboard(code)}
              type="button"
            >
              Copy
            </button>
          </div>
          <SyntaxHighlighter 
            language={language}
            style={dracula}
            customStyle={{backgroundColor: '#0e0e0e'}}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      )
    }
  }

  const markDownClean = cleanServerMarkdown(markdownText)

  return (
    <section className="md-wrapper">
      <Markdown 
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {markDownClean}
      </Markdown>
    </section>
  )
}

export default MarkdownComponent