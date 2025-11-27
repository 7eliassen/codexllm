async function get_stream(prompt: string) {
    const url = "http://localhost:8000/stream/"

    const response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/x-ndjson'
    },
    body: JSON.stringify({ "prompt": prompt }),
    })

    return response
}

export default get_stream