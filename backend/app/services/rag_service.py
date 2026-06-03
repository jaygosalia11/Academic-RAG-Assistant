from app.core.vectorstore import search
from app.core.prompt_templates import get_rag_prompt
from langchain_community.llms import Ollama

llm = Ollama(model="llama3")


def run_rag(query: str, department: str = None, academic_year: str = None):

    results = search(
        query,
        k=5,
        department=department,
        academic_year=academic_year
    )

    contexts = results["documents"][0]
    context_text = "\n\n".join(contexts)

    prompt = get_rag_prompt(context_text, query)

    answer = llm.invoke(prompt)

    return {
        "query": query,
        "answer": answer,
        "contexts_used": contexts
    }