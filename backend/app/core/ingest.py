import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.vectorstore import store_chunks


def ingest_syllabus(folder_path: str, department: str, batch_year: str, semester_level: str):

    all_docs = []

    # 1. Load PDFs
    for file in os.listdir(folder_path):
        if file.endswith(".pdf"):

            file_path = os.path.join(folder_path, file)

            loader = PyPDFLoader(file_path)
            docs = loader.load()

            # 2. Attach metadata to each page
            for doc in docs:
                doc.metadata["file_name"] = file
                doc.metadata["department"] = department
                doc.metadata["batch_year"] = batch_year
                doc.metadata["semester_level"] = semester_level

            all_docs.extend(docs)

    # 3. Chunking
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.split_documents(all_docs)

    # 4. Store in vector DB
    store_chunks(chunks)

    return chunks