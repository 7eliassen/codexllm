import ResponseMessageComponent from './ResponseMessage';
import RequestMessageComponent from './RequestMessage';
import type { RequestResponse, RequestMessage } from '../types/types';
import { useState, useEffect, useRef } from 'react';
import get_stream from "../requests/get_stream"

function ChatInterface() {

  const [messages, setMessages] = useState<RequestResponse[]>([])
  const [isButSendLock, setIsButSendLock] = useState<boolean>(false)
  const [requestText, setRequestText] = useState<string>('')

  async function newMessage(message: RequestMessage) {
    setMessages(prev => {
      const newMsg: RequestResponse = {
        id: prev.length + 1,
        request: message,
        response: {
          responseText: "Wait...",
          errorStatus: false,
        }
      }
      return [...prev, newMsg]
    })
  }

  async function fetchNdjson(prompt: string) {
    setIsButSendLock(true)
    try {
    
      const response = await get_stream(prompt)
      const reader = response.body?.getReader() ?? null;


      const decoder = new TextDecoder()
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

                case "start":
                  updated[lastIndex] = {
                    ...last,
                    response: {
                      ...last.response,
                      responseText: ""
                    }
                  }
                  break

                case "reasoning-start":
                  updated[lastIndex] = {
                    ...last,
                    response: {
                      ...last.response,
                      thinkingText: "",
                      thinkingTimeStart: Date.now()
                    }
                  }
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
                  updated[lastIndex] = {
                    ...last,
                    response: {
                      ...last.response,
                      thinkingTimeDelta: last.response.thinkingTimeStart && 
                                          Math.floor((Date.now() - last.response.thinkingTimeStart) / 1000)
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
      console.log("!!!")
      setMessages(prev => {
              const updated = [...prev]
              const lastIndex = updated.length - 1
              const last = updated[lastIndex]

              if (!last) return prev

              updated[lastIndex] = {
                ...last,
                response: {
                  ...last.response,
                  errorStatus: true
                }
              }
              return updated
      })
    } finally {
      setIsButSendLock(false)
    }
  }


  async function handleSend() {
    if (!requestText.trim()) return

    const prompt = requestText
    setRequestText('')

    const messagePayload: RequestMessage = { requestText: prompt }

    newMessage(messagePayload)

    await fetchNdjson(prompt)

  }


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isButSendLock)
        handleSend()
    }
  }
  

  const chatContainerRef = useRef<HTMLDivElement>(null)


  return (
    <div className="chat-container" ref={chatContainerRef}>
      <div className="chat-column">
        {/* Here requests and responses */}
        {messages.map((message, index) => (
        <div className="message-wrapper" key={message.id || index}>
          <RequestMessageComponent requestText={message.request.requestText} />
          {message.response && (
            <ResponseMessageComponent 
              responseText={message.response.responseText} 
              thinkingText={message.response.thinkingText}
              thinkingTimeDelta={message.response.thinkingTimeDelta}
              thinkingTimeStart={message.response.thinkingTimeStart}
              errorStatus={message.response.errorStatus}
            />
          )}
        </div>
      ))}
      </div>

      <div className="indent-before-gradient"></div>

      {/* Input Area  */}
      <div className="input-wrapper show-gradient">
        <div className="input-box">
          <textarea
            placeholder="Ask anything"
            rows={1}
            value={requestText} 
            onChange={(e) => setRequestText(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
              const target = e.currentTarget;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          ></textarea>

          <div className="input-footer">
            <button className="attach-btn">
              <img src="attach.svg" alt="attach file" />
              Attach
            </button>
            
            <button 
              className={`send-btn ${isButSendLock? "btn-disabled": ""}`}
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