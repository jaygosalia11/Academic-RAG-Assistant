from langchain_community.llms import Ollama

llm = Ollama(model="llama3")


def extract_sample_text(file_path: str, max_pages: int = 2):
    """
    Extract small sample from PDF (fast + cheap)
    """
    from PyPDF2 import PdfReader

    reader = PdfReader(file_path)
    text = ""

    for page in reader.pages[:max_pages]:
        page_text = page.extract_text()
        if page_text:
            text += page_text

    return text[:3000]  # limit token size


def ai_classify_document(text_sample: str) -> bool:
    """
    LLM-based classifier (Method 3)
    """

    prompt = f"""
You are a strict document classifier.

Your job is to check whether a document belongs to:

✔ ENGINEERING SYLLABUS / ACADEMIC CONTENT

Allowed:
- syllabus PDFs
- subject notes
- curriculum documents
- semester subjects
- academic course material

NOT allowed:
- resumes
- certificates
- ID cards
- personal documents
- job applications

Return ONLY:
YES or NO

Document:
{text_sample}

Answer:
"""

    response = llm.invoke(prompt)

    return "yes" in response.lower()


def is_valid_document(file_path: str):

    sample = extract_sample_text(file_path)

    result = ai_classify_document(sample)

    if result:
        return True, "Accepted by AI classifier"
    else:
        return False, "Rejected: Not syllabus-related document"