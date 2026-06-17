# AcademIQ - Academic RAG Assistant

AcademIQ is an AI-powered academic assistant for engineering students. It uses Retrieval-Augmented Generation (RAG) to answer questions based on syllabus documents and academic resources.

The system retrieves relevant information from uploaded documents and generates accurate, context-aware responses using a local Large Language Model (LLM).

## Features

* User registration and login
* Department, batch, and semester-based filtering
* Upload and process syllabus PDFs
* Semantic search using vector embeddings
* Context-aware chat with conversation history
* Session-based chat management
* AI-generated responses using local LLMs
* Persistent chat history

## Technologies Used

### Frontend

* React
* TypeScript
* Material UI (MUI)
* Axios

### Backend

* FastAPI
* Python
* Pydantic
* Psycopg2

### AI & RAG

* Ollama
* Llama 3.2 3B
* LangChain
* ChromaDB
* Sentence Transformers

### Database

* PostgreSQL

## Initial Setup

### Clone the Repository

```bash
git clone <repository-url>
cd Academic-RAG-Assistant
```

### Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

Pull the LLM model:

```bash
ollama pull llama3.2:3b
```

Start the backend server:

```bash
uvicorn app.main:app --reload
```

Backend URL:

```text
http://localhost:8000
```

### Frontend Setup

```bash
cd frontend

npm install

npm start
```

Frontend URL:

```text
http://localhost:3000
```

### Environment Variables

Create a `.env` file inside the `backend` directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=academic_rag
DB_USER=postgres
DB_PASSWORD=your_password
```
