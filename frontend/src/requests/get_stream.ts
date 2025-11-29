

async function get_stream(prompt: string, url: string) {

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