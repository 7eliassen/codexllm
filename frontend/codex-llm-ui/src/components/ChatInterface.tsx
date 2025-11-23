import ResponseMessageComponent from './ResponseMessage';
import RequestMessageComponent from './RequestMessage';
import type { RequestResponse, ResponseMessage, RequestMessage } from '../types/types';
import { useState, useEffect, useRef } from 'react';
import ndjsonStream from "can-ndjson-stream";

function ChatInterface() {

  const [messages, setMessages] = useState<RequestResponse[]>([])

  const [requestText, setRequestText] = useState<string>('')

  const [lockSendButton, setLockSendButton] = useState<boolean>(false)


  async function newMessage(message: RequestMessage) {
    setMessages(prev => {
      const newMsg: RequestResponse = {
        id: prev.length + 1,
        request: message,
        response: {
          responseText: "",
        }
      }

      return [...prev, newMsg]
    })
  }


  async function fetchNdjson(prompt: string) {
    const url = "http://localhost:8000/stream/"
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/x-ndjson'
        },
        body: JSON.stringify({ "prompt": prompt }),
      })

      const reader = response.body?.getReader() ?? null;

      const decoder = new TextDecoder()

      let thinkingTimer: ReturnType<typeof setTimeout>
      let thinkingTime = 0

      while (true) {
        if (reader !== null) {
          const { done, value } = await reader.read()
          if (done) break

          const text = decoder.decode(value, { stream: true })

          for (const line of text.split("\n")) {
            if (!line.trim()) continue
            console.log(line)
            const message = JSON.parse(line)
            console.log("NDJSON:", message)

            setMessages(prev => {
              const updated = [...prev]
              const lastIndex = updated.length - 1
              const last = updated[lastIndex]

              if (!last) return prev

              switch (message.type) {

                case "reasoning-start":
                  updated[lastIndex] = {
                    ...last,
                    response: {
                      ...last.response,
                      thinkingText: ""
                    }
                  }

                  console.log("!!!")
                  thinkingTimer = setInterval(() => {
                    thinkingTime++
                  }, 1000)

                  break
                
                case "reasoning-delta":
                  updated[lastIndex] = {
                    ...last,
                    response: {
                      ...last.response,
                      thinkingText: last.response.thinkingText + message.delta
                    }
                  }
                  break

                case "reasoning-end":
                  clearInterval(thinkingTimer)
                  updated[lastIndex] = {
                    ...last,
                    response: {
                      ...last.response,
                      thinkingTime: thinkingTime
                    }
                  }
                  break

                case "text-delta":
                  updated[lastIndex] = {
                    ...last,
                    response: {
                      ...last.response,
                      responseText: last.response.responseText + message.delta
                    }
                  }
                  break

                
              }

              return updated
          })
        }
      }
      }

    } catch (e) {
      console.error(e)
    }
  }


  async function handleSend() {
    if (!requestText.trim()) return

    const prompt = requestText
    setRequestText('')

    const messagePayload: RequestMessage = { requestText: prompt }

    newMessage(messagePayload)

    await fetchNdjson(prompt)

    console.log("Current messages at this moment:", messages)
  }


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  

  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = chatContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages])

  return (
    <div className="chat-container" ref={chatContainerRef}>
      <div className="chat-column">
        {/* Here requests and responses */}
        {messages.map((message, index) => (
        <div key={message.id || index}>
          <RequestMessageComponent requestText={message.request.requestText} />
          {message.response && (
            <ResponseMessageComponent 
              responseText={message.response.responseText} 
              thinkingText={message.response.thinkingText}
              thinkingTime={message.response.thinkingTime}
            />
          )}
        </div>
      ))}
      </div>

      {/* Input Area  */}
      <div className="input-wrapper">
        <div className="input-box">
          <textarea
            placeholder="Ask anything"
            rows={1}
            value={requestText} 
            onChange={(e) => setRequestText(e.target.value)}
            onKeyDown={handleKeyDown} 
          ></textarea>

          <div className="input-footer">
            <button className="attach-btn">
              <img src="attach.svg" alt="attach file" />
              Attach
            </button>
            
            <button 
              className="send-btn" 
              onClick={handleSend}>
              <img src="send.svg" alt="Send" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface;