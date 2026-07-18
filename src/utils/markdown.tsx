import type { JSX, ReactNode } from 'react'

/**
 * Minimal markdown renderer covering what the coach templates actually emit:
 * **bold**, *italic*, `code`, and - bullet lists. Deliberately dependency-free
 * to keep the bundle small; swap for react-markdown if content grows richer.
 */

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    const token = match[0]
    if (token.startsWith('**')) {
      parts.push(<strong key={key++}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('`')) {
      parts.push(
        <code key={key++} className="rounded bg-muted px-1 py-0.5 text-[0.85em]">
          {token.slice(1, -1)}
        </code>,
      )
    } else {
      parts.push(<em key={key++}>{token.slice(1, -1)}</em>)
    }
    lastIndex = match.index + token.length
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}

export function renderMarkdown(text: string): JSX.Element {
  const blocks: ReactNode[] = []
  const lines = text.split('\n')
  let listItems: string[] = []
  let key = 0

  const flushList = () => {
    if (listItems.length === 0) return
    blocks.push(
      <ul key={key++} className="my-1.5 list-disc space-y-1 pl-5">
        {listItems.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ul>,
    )
    listItems = []
  }

  for (const line of lines) {
    const listMatch = line.match(/^\s*[-*]\s+(.*)/)
    if (listMatch) {
      listItems.push(listMatch[1])
      continue
    }
    flushList()
    if (line.trim()) {
      blocks.push(
        <p key={key++} className="my-1.5 first:mt-0 last:mb-0">
          {renderInline(line)}
        </p>,
      )
    }
  }
  flushList()

  return <>{blocks}</>
}
