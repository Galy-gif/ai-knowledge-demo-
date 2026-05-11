// Renders a markdown-inline string (**bold** markers) with optional yellow highlight spans.

type Segment = { text: string; bold: boolean; highlighted: boolean }

function buildSegments(raw: string, highlights: string[]): Segment[] {
  // Step 1: split by ** to get bold/non-bold regions
  const boldParts = raw.split(/\*\*/)

  const segments: Segment[] = []

  boldParts.forEach((part, i) => {
    const isBold = i % 2 === 1

    if (highlights.length === 0) {
      if (part) segments.push({ text: part, bold: isBold, highlighted: false })
      return
    }

    // Step 2: within each bold/non-bold part, split by highlight texts
    const escaped = highlights
      .filter(h => h.length > 0)
      .map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

    if (escaped.length === 0) {
      if (part) segments.push({ text: part, bold: isBold, highlighted: false })
      return
    }

    const regex = new RegExp(`(${escaped.join('|')})`, 'g')
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = regex.exec(part)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ text: part.slice(lastIndex, match.index), bold: isBold, highlighted: false })
      }
      segments.push({ text: match[0], bold: isBold, highlighted: true })
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < part.length) {
      segments.push({ text: part.slice(lastIndex), bold: isBold, highlighted: false })
    }
  })

  return segments
}

interface Props {
  text: string
  highlights?: string[]
  colorMap?: Map<string, string>
}

export default function HighlightedText({ text, highlights = [], colorMap }: Props) {
  const segments = buildSegments(text, highlights)

  return (
    <>
      {segments.map((seg, i) => {
        const inner = seg.highlighted
          ? (() => {
              const color = colorMap?.get(seg.text) ?? 'yellow'
              const bgClass = color === 'green' ? 'bg-green-100' : color === 'blue' ? 'bg-blue-100' : 'bg-yellow-100'
              return <mark key={i} className={`${bgClass} rounded-sm px-0.5 not-italic`}>{seg.text}</mark>
            })()
          : seg.text

        return seg.bold
          ? <strong key={i} className="font-semibold text-ink-primary">{inner}</strong>
          : <span key={i}>{inner}</span>
      })}
    </>
  )
}
