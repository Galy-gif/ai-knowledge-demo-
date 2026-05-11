import { useEffect, useRef, useState, type ReactNode } from 'react'

interface Props {
  text: string
  speed?: number
  tickMs?: number
  onComplete?: () => void
  render: (displayed: string, streaming: boolean) => ReactNode
}

export default function StreamingText({ text, speed = 3, tickMs = 20, onComplete, render }: Props) {
  const [displayed, setDisplayed] = useState('')
  const [streaming, setStreaming] = useState(true)
  const idxRef = useRef(0)
  const finishedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    idxRef.current = 0
    finishedRef.current = false
    setDisplayed('')
    setStreaming(true)

    const timer = setInterval(() => {
      idxRef.current += speed
      setDisplayed(text.slice(0, idxRef.current))
      if (idxRef.current >= text.length && !finishedRef.current) {
        finishedRef.current = true
        clearInterval(timer)
        setStreaming(false)
        onCompleteRef.current?.()
      }
    }, tickMs)

    return () => clearInterval(timer)
  }, [text, speed, tickMs])

  return <>{render(displayed, streaming)}</>
}
