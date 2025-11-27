export interface ResponseMessage {
    thinkingText?: string
    thinkingTimeDelta?: number
    thinkingTimeStart?: number
    responseText: string
    errorStatus: boolean
}

export interface RequestMessage {
    requestText: string
}

export interface RequestResponse {
    id: number
    request: RequestMessage
    response: ResponseMessage
}

export interface MarkdownProps {
    markdownText: string
}