import { useState } from "react";
import type {ResponseMessage} from "../types/types";
import MarkdownComponent from "./MarkdownComponent"

function ResponseMessageComponent(props: ResponseMessage ) {
    const [isThoughtOpen, setIsThoughtOpen] = useState(false);

    return (
    <div className="ai-message-wrapper">
          
        {/* Thinking Block*/}
        {props.thinkingText?
            <div className="thought-block">
            <div 
                className="thought-header" 
                onClick={() => setIsThoughtOpen(!isThoughtOpen)}>

                <img src="brain.svg" alt="attach file" />

                {/* I don't sure if it good verification*/}
                {props.thinkingTime !== undefined ? 
                <span>{`Thought for ${props.thinkingTime} seconds`}</span>
                : <span>{"Thinking"}</span>}
                

                <img className={`icon-chevron ${isThoughtOpen ? 'expanded' : ''}`} src="chevron.svg" alt="chevron icon" />
            </div>

            {/* When we click 'expand' */}
            {isThoughtOpen && ( 
                <div className="thought-content">
                    {props.thinkingText}
                </div>
            )}

            </div>
        : null}

          {/* Main Content */}
        <div className="response-content">
            <MarkdownComponent markdownText={props.responseText}/>
        </div>
    

    </div>
    )
    
}

export default ResponseMessageComponent