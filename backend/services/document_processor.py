
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from fastapi import UploadFile
import os
from .base_service import BaseService
from typing import List, Dict, Any, Tuple

class DocumentProcessor(BaseService):
    """
    Advanced Document Processor using LangChain.
    Extracts text, splits into semantic chunks, and categorizes founder materials.
    """
    def __init__(self):
        super().__init__("document_processor")
        
        # Ensure upload directory exists
        if not os.path.exists(self.settings.UPLOAD_FOLDER):
            os.makedirs(self.settings.UPLOAD_FOLDER)
            
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )

    def load_pdf(self, file_path: str) -> Tuple[str, List[Any]]:
        """Load PDF using LangChain PyPDFLoader"""
        try:
            loader = PyPDFLoader(file_path)
            pages = loader.load()
            text = "\n\n".join([page.page_content for page in pages])
            return text, pages
        except Exception as e:
            self.log_error(f"Error loading PDF: {file_path}", e)
            return "", []

    def load_docx(self, file_path: str) -> Tuple[str, List[Any]]:
        """Load DOCX using LangChain"""
        try:
            loader = Docx2txtLoader(file_path)
            documents = loader.load()
            text = "\n\n".join([doc.page_content for doc in documents])
            return text, documents
        except Exception as e:
            self.log_error(f"Error loading DOCX: {file_path}", e)
            return "", []

    def load_txt(self, file_path: str) -> Tuple[str, List[Any]]:
        """Load TXT file"""
        try:
            loader = TextLoader(file_path)
            documents = loader.load()
            text = "\n\n".join([doc.page_content for doc in documents])
            return text, documents
        except Exception as e:
            self.log_error(f"Error loading TXT: {file_path}", e)
            return "", []

    def chunk_documents(self, text: str) -> List[str]:
        """Split text into chunks using LangChain"""
        if not text:
            return []
        return self.text_splitter.split_text(text)

    def _save_uploaded_file(self, uploaded_file: UploadFile) -> str:
        """Save FastAPI UploadFile to disk for processing"""
        file_path = os.path.join(self.settings.UPLOAD_FOLDER, uploaded_file.filename)
        with open(file_path, "wb") as f:
            f.write(uploaded_file.file.read())
        # Reset pointer for future reads if needed
        uploaded_file.file.seek(0)
        return file_path

    def _load_file_by_extension(self, file_path: str) -> Tuple[str, List[Any]]:
        """Utility to route to the correct LangChain loader"""
        ext = os.path.splitext(file_path)[1].lower()
        if ext == '.pdf':
            return self.load_pdf(file_path)
        elif ext in ['.docx', '.doc']:
            return self.load_docx(file_path)
        else:
            return self.load_txt(file_path)

    async def process_files(self, files: List[UploadFile]) -> Dict[str, Any]:
        """
        Processes all uploaded files and categorizes them based on industry standard.
        Returns a dictionary with extracted text, chunks, and metadata.
        """
        extracted_data = {
            "pitch_deck": {"text": "", "chunks": [], "filename": ""},
            "transcripts": [],
            "emails": [],
            "founder_emails": [],
            "updates": []
        }

        for file in files:
            file_path = self._save_uploaded_file(file)
            text, _ = self._load_file_by_extension(file_path)
            chunks = self.chunk_documents(text)
            
            # Categorization based on frontend-provided prefixes
            if file.filename.startswith("[Transcript]"):
                extracted_data["transcripts"].append({
                    "text": text,
                    "chunks": chunks,
                    "filename": file.filename
                })
            elif file.filename.startswith("[Email]"):
                extracted_data["emails"].append({
                    "text": text,
                    "chunks": chunks,
                    "filename": file.filename
                })
            elif file.filename.startswith("[FounderEmail]"):
                extracted_data["founder_emails"].append({
                    "text": text,
                    "chunks": chunks,
                    "filename": file.filename
                })
            elif file.filename.startswith("[Update]"):
                extracted_data["updates"].append({
                    "text": text,
                    "chunks": chunks,
                    "filename": file.filename
                })
            else:
                # Assume the first non-prefixed PDF is the pitch deck
                if not extracted_data["pitch_deck"]["filename"]:
                    extracted_data["pitch_deck"] = {
                        "text": text,
                        "chunks": chunks,
                        "filename": file.filename
                    }
                else:
                    # General secondary updates
                    extracted_data["updates"].append({
                        "text": text,
                        "chunks": chunks,
                        "filename": file.filename
                    })
            
            # Cleanup temporary file after processing to maintain server hygiene
            try:
                os.remove(file_path)
            except:
                pass

        return extracted_data

document_processor = DocumentProcessor()
