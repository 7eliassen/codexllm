import ResponseMessage from './ResponseMessage';
import RequestMessage from './RequestMessage';

function ChatInterface() {

  return (
    <div className="chat-container">
      <div className="chat-column">
        {/* Here requests and responses */}

        {/*Just examples  */}
        <RequestMessage
        requestText='Hello. How are you today?'/>

        <ResponseMessage
        responseText='Hello! I’m doing well, thank you. How about you?'/>

        <RequestMessage
        requestText='Write essay about crime and punishment about 5 words'/>

        <ResponseMessage
        thinkingTime={4}
        thinkingText='Thinking about essay'
        responseText='Crime brings punishment; justice follows.' />
        
      </div>

    {/* Input Area  */}
      <div className="input-wrapper">
        <div className="input-box">
          <textarea placeholder="Ask anything" rows={1}></textarea>

          <div className="input-footer">
            <button className="attach-btn">

            <img src="attach.svg" alt="attach file" />
              Attach
            </button>
            <button className="send-btn">

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
