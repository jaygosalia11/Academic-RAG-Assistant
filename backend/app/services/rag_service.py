
from app.core.vectorstore import search
from app.core.prompt_templates import get_rag_prompt

# from langchain_community.llms import Ollama
from langchain_ollama import ChatOllama

# llm = Ollama(model="llama3")
llm = ChatOllama(
     model = "llama3.2:3b",
     temperature=0,
     num_predict=300
)


def run_rag(query, history, department=None, batch_year=None, semester_level=None):

    results = search(
        query=query,
        department=department,
        batch_year=batch_year,
        semester_level=semester_level
    )

    contexts = results["documents"][0]

    context_text = "\n\n".join(contexts)

    history_text = ""

    for role, message in history:
        history_text += f"{role}: {message}\n"

    prompt = get_rag_prompt(
        context=context_text,
        history=history_text,
        question=query
    )

    answer = llm.invoke(prompt)

    return {
        "query": query,
        "answer": answer.content,
        "contexts_used": contexts
    }