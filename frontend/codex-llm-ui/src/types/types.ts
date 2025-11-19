export interface ResponseMessage {
    thinkingText?: string
    thinkingTime?: number
    responseText: string
}

export interface RequestMessage {
    requestText: string
}

export interface RequestResponse {
    id: number
    request: RequestMessage
    response: ResponseMessage
}