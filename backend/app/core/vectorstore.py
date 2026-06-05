from sentence_transformers import SentenceTransformer
import chromadb

model = SentenceTransformer("all-MiniLM-L6-v2")

client = chromadb.PersistentClient(path="chroma_db")

collection = client.get_or_create_collection("academic_rag")


# -----------------------------
# STORE CHUNKS
# -----------------------------
def store_chunks(chunks):

    docs = []
    embeddings = []
    metadatas = []
    ids = []

    for i, chunk in enumerate(chunks):

        text = chunk.page_content
        vector = model.encode(text).tolist()

        docs.append(text)
        embeddings.append(vector)
        metadatas.append(chunk.metadata)
        ids.append(f"chunk_{i}")

    collection.add(
        documents=docs,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )


# -----------------------------
# SEARCH FUNCTION 
# -----------------------------


def search(
    query: str,
    k: int = 5,
    department=None,
    batch_year=None,
    semester_level=None
):

    query_vector = model.encode(query).tolist()

    filters = []

    if department:
        filters.append({"department": {"$eq": department}})

    if batch_year:
        filters.append({"batch_year": {"$eq": batch_year}})

    if semester_level:
        filters.append({"semester_level": {"$eq": semester_level}})

    where_filter = None

    if len(filters) == 1:
        where_filter = filters[0]

    elif len(filters) > 1:
        where_filter = {
            "$and": filters
        }

    results = collection.query(
        query_embeddings=[query_vector],
        n_results=k,
        where=where_filter
    )

    return results