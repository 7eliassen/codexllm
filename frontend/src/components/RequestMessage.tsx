import type {RequestMessage } from "../types/types"
function RequestMessageComponent(props: RequestMessage) {
    return (
        <div className="user-message-wrapper">
          <div className="user-message">
            {/* Here will be user message */}
            {props.requestText}
          </div>
        </div>
    )
}

export default RequestMessageComponent