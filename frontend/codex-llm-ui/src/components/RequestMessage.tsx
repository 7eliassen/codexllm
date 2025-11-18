import type {RequestMessageProps} from "../types/props"
function RequestMessage(props: RequestMessageProps) {
    return (
        <div className="user-message-wrapper">
          <div className="user-message">
            {/* Here will be user message */}
            {props.requestText}
          </div>
        </div>
    )
}

export default RequestMessage