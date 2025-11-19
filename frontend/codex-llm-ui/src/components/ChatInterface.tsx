import ResponseMessageComponent from './ResponseMessage';
import RequestMessageComponent from './RequestMessage';
import type { RequestResponse, ResponseMessage, RequestMessage } from '../types/types';
import { useState, useEffect } from 'react';

function ChatInterface() {

  const [messages, setMessages] = useState<RequestResponse[]>([])

  const [requestText, setRequestText] = useState<string>('')

  const [lockSendButton, setLockSendButton] = useState<boolean>(false)


  function newMessage(message: RequestMessage) {
    const newMsg: RequestResponse = {
      id: messages.length + 1,
      request: message,
      response: {
        responseText: 'RESPONSE',
      } as ResponseMessage,
    }

    const test = [...messages]
    
    setMessages([...test, newMsg])
  }

  const handleSend = () => {
    if (!requestText.trim()) return

    const messagePayload: RequestMessage = {
      requestText: requestText,
    }

    newMessage(messagePayload)

    setRequestText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-column">
        {/* Here requests and responses */}
        {messages.map((message, index) => (
          <div key={message.id || index}>
            <RequestMessageComponent requestText={message.request.requestText} />
            {message.response && (
            <ResponseMessageComponent responseText={message.response.responseText} />
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