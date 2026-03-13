# CODEX LLM UI

Introductory assignment for CODEX Team

Tech stack:
- Typescript + React
- FastApi

## Demonstration of work

![Demo](https://raw.githubusercontent.com/7eliassen/codexllm/refs/heads/master/demo.gif)


## How to run

### frontend
```
# for development only
npm install
npm run dev
```

### Backend
```
docker build -t codex-llm .
docker run --env-file .\.env -p 8000:8000 codex-llm
```

Where .env contains `API_KEY=...`
