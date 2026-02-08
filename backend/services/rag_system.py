
import chromadb
import os
import logging
import google.generativeai as genai
from typing import List, Dict, Any
from ..config import settings

logger = logging.getLogger("venturescout.rag")

class RAGSystem:
    """
    Knowledge Retrieval system using Gemini's native embedding model and ChromaDB.
    """
    def __init__(self):
        self.db_path = os.path.join(settings.CHROMA_PATH, "chroma_db")
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        
        self.client = chromadb.PersistentClient(path=self.db_path)
        
        # Configure Google GenAI for Embeddings
        if not settings.API_KEY:
            raise ValueError("API_KEY is missing for RAG Embedding Service")
        genai.configure(api_key=settings.API_KEY)
        
        # Create or fetch the collection
        self.collection = self.client.get_or_create_collection(
            name="startup_knowledge_base",
            metadata={"hnsw:space": "cosine"}
        )

    def _get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Utility to get embeddings from Google GenAI."""
        try:
            result = genai.embed_content(
                model=settings.EMBEDDING_MODEL,
                content=texts,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            logger.error(f"Embedding failed: {e}")
            return [[0.0] * 768 for _ in texts]

    def add_documents(self, extracted_data: Dict[str, Any], startup_id: str):
        """Indexes processed chunks using Gemini Embeddings into ChromaDB."""
        all_chunks = []
        metadatas = []
        ids = []

        # Process categories: pitch_deck, transcripts, emails, founder_emails, updates
        if extracted_data.get("pitch_deck"):
            deck = extracted_data["pitch_deck"]
            for i, chunk in enumerate(deck.get("chunks", [])):
                all_chunks.append(chunk)
                metadatas.append({"startup_id": startup_id, "type": "pitch_deck", "file": deck["filename"]})
                ids.append(f"{startup_id}_deck_{i}")

        for cat in ["transcripts", "emails", "founder_emails", "updates"]:
            docs = extracted_data.get(cat, [])
            for doc_idx, doc in enumerate(docs):
                for i, chunk in enumerate(doc.get("chunks", [])):
                    all_chunks.append(chunk)
                    metadatas.append({"startup_id": startup_id, "type": cat, "file": doc["filename"]})
                    ids.append(f"{startup_id}_{cat}_{doc_idx}_{i}")

        if all_chunks:
            embeddings = self._get_embeddings(all_chunks)
            self.collection.add(
                documents=all_chunks,
                embeddings=embeddings,
                metadatas=metadatas,
                ids=ids
            )
            logger.info(f"RAG: Indexed {len(all_chunks)} semantic chunks for startup {startup_id}")

    def query(self, query_text: str, startup_id: str, n_results: int = 5) -> str:
        """Retrieves semantically relevant context for a specific agent query."""
        try:
            # Get query embedding
            query_res = genai.embed_content(
                model=settings.EMBEDDING_MODEL,
                content=query_text,
                task_type="retrieval_query"
            )
            
            results = self.collection.query(
                query_embeddings=[query_res['embedding']],
                n_results=n_results,
                where={"startup_id": startup_id}
            )
            
            if results['documents'] and results['documents'][0]:
                return "\n\n---\n\n".join(results['documents'][0])
            return "No relevant data room context found for this query."
        except Exception as e:
            logger.error(f"RAG Query Failed: {e}")
            return ""

rag_system = RAGSystem()
