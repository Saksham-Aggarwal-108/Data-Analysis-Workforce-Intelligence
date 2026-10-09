from typing import Dict, Any, List

class ProjectRecommendationEngine:
    """
    Project Recommendation Engine.
    Maps candidate skill gaps to practical, high-impact portfolio projects.
    """

    PROJECT_CATALOG: Dict[str, Dict[str, Any]] = {
        "MACHINE_LEARNING": {
            "title": "End-to-End Customer Churn Prediction Engine",
            "difficulty": "Intermediate",
            "target_skill": "Machine Learning",
            "why_this_project": "Demonstrates cross-validated classification, feature engineering, and out-of-fold metric evaluation on real enterprise data.",
            "deliverables": ["Jupyter notebook with EDA & SHAP explainability", "Saved model pipeline artifact", "Streamlit/FastAPI web interface"],
            "technologies": ["Python", "Scikit-Learn", "XGBoost", "Pandas", "FastAPI"],
            "portfolio_value": "High — Essential proof of end-to-end ML problem solving for enterprise data roles.",
            "interview_value": "High — Provides strong talking points on handling class imbalance, metric selection, and leak detection."
        },
        "GENERATIVE_AI": {
            "title": "Domain-Specific Document Intelligence RAG Assistant",
            "difficulty": "Advanced",
            "target_skill": "Generative AI & LLMs",
            "why_this_project": "Proves capability in building RAG pipelines, chunking, vector indexing, and grounding LLM responses on proprietary documents.",
            "deliverables": ["Multi-document PDF ingestion pipeline", "Vector database index (Chroma/Pinecone)", "Interactive Q&A Chat UI"],
            "technologies": ["Python", "LangChain", "OpenAI API / Llama-3", "ChromaDB", "FastAPI"],
            "portfolio_value": "Very High — Most in-demand capability for modern GenAI and AI Engineering roles.",
            "interview_value": "Very High — Demonstrates mastery of hallucination mitigation, retrieval accuracy, and token optimization."
        },
        "RAG": {
            "title": "Hybrid Search Retrieval-Augmented Generation System",
            "difficulty": "Advanced",
            "target_skill": "Retrieval-Augmented Generation (RAG)",
            "why_this_project": "Showcases dense vector embeddings combined with sparse BM25 keyword search for maximum retrieval precision.",
            "deliverables": ["Hybrid retrieval pipeline", "RERANKING evaluation notebook", "API endpoint with metadata filtering"],
            "technologies": ["Python", "LangChain / LlamaIndex", "Pinecone", "SentenceTransformers"],
            "portfolio_value": "Very High — Standard production pattern for enterprise AI assistants.",
            "interview_value": "High — Highlights deep understanding of search evaluation metrics (MRR, NDCG)."
        },
        "MLOPS": {
            "title": "Containerized ML Prediction API with Automated Monitoring",
            "difficulty": "Advanced",
            "target_skill": "MLOps & Model Deployment",
            "why_this_project": "Demonstrates productionizing a machine learning model inside Docker with automated health checks and data drift monitoring.",
            "deliverables": ["Dockerfile & docker-compose configuration", "FastAPI inference service", "Evidently AI / MLflow monitoring dashboard"],
            "technologies": ["Docker", "FastAPI", "MLflow", "Evidently AI", "GitHub Actions"],
            "portfolio_value": "Very High — Bridges the gap between experimental data science and software engineering.",
            "interview_value": "Very High — Proves you can deploy models that stay reliable in live environments."
        },
        "SPARK": {
            "title": "Distributed Big Data Processing & Streaming ETL Pipeline",
            "difficulty": "Advanced",
            "target_skill": "Apache Spark & Big Data",
            "why_this_project": "Processes multi-gigabyte event logs using PySpark and writes aggregated analytics to a cloud data lake.",
            "deliverables": ["PySpark batch transformation script", "Spark SQL query suite", "Parquet data lake storage structure"],
            "technologies": ["PySpark", "Apache Spark", "Python", "Parquet", "AWS S3 / GCP Storage"],
            "portfolio_value": "High — Critical proof of big data engineering capability.",
            "interview_value": "High — Shows understanding of Spark partitions, shuffle optimization, and distributed execution."
        },
        "SQL": {
            "title": "Complex E-Commerce Revenue & Retention Analytics Suite",
            "difficulty": "Intermediate",
            "target_skill": "SQL & Relational Databases",
            "why_this_project": "Uses advanced SQL window functions, CTEs, and cohort aggregations to compute LTV, retention, and churn metrics.",
            "deliverables": ["SQL script repository with 15+ complex analytical queries", "Database schema definition", "Executive summary findings report"],
            "technologies": ["PostgreSQL", "SQL", "pgAdmin", "Tableau / Power BI"],
            "portfolio_value": "High — Fundamental requirement for all data analyst and data science roles.",
            "interview_value": "High — Perfect reference for technical SQL live-coding interview rounds."
        },
        "FASTAPI": {
            "title": "Asynchronous REST API Service for Data Analytics",
            "difficulty": "Intermediate",
            "target_skill": "FastAPI & Microservices",
            "why_this_project": "Constructs asynchronous API endpoints with Pydantic request validation, CORS middleware, and structured JSON responses.",
            "deliverables": ["Production-ready FastAPI app codebase", "Swagger/OpenAPI documentation page", "Pytest API endpoint test suite"],
            "technologies": ["FastAPI", "Python", "Pydantic", "Uvicorn", "Pytest"],
            "portfolio_value": "High — Essential software engineering skill for modern data scientists.",
            "interview_value": "High — Demonstrates clean backend architecture and API contract design."
        },
        "DOCKER": {
            "title": "Multi-Container Microservices Stack with Docker Compose",
            "difficulty": "Intermediate",
            "target_skill": "Docker & Containerization",
            "why_this_project": "Containerizes a Python analytics backend and React frontend into isolated, reproducible containers.",
            "deliverables": ["Dockerfile for frontend & backend", "docker-compose.yml orchestration file", "Build script & documentation"],
            "technologies": ["Docker", "Docker Compose", "Linux", "Bash"],
            "portfolio_value": "High — Guarantees 1-click reproducibility across local and cloud environments.",
            "interview_value": "High — Proves environment isolation and DevOps awareness."
        },
        "DEEP_LEARNING": {
            "title": "PyTorch Computer Vision Image Classifier with Transfer Learning",
            "difficulty": "Intermediate",
            "target_skill": "Deep Learning & PyTorch",
            "why_this_project": "Fine-tunes a pre-trained ResNet/EfficientNet model on custom image data with validation metrics and learning rate tuning.",
            "deliverables": ["PyTorch training script", "Loss & accuracy convergence plots", "ONNX model export"],
            "technologies": ["PyTorch", "Python", "Torchvision", "Matplotlib", "ONNX"],
            "portfolio_value": "High — Core requirement for computer vision and AI research roles.",
            "interview_value": "High — Strong discussion points on backpropagation, gradient clipping, and transfer learning."
        },
        "TABLEAU": {
            "title": "Executive Workforce & Compensation Strategy Dashboard",
            "difficulty": "Beginner-Intermediate",
            "target_skill": "Tableau / Business Intelligence",
            "why_this_project": "Builds interactive executive dashboards visualizing salary distributions, skill prevalence, and experience trends.",
            "deliverables": ["Interactive Tableau Public workbook", "Filterable executive KPIs", "User guide"],
            "technologies": ["Tableau", "SQL / Excel", "Data Storytelling"],
            "portfolio_value": "High — Primary visual proof of business communication for data analysts.",
            "interview_value": "High — Demonstrates clear UI/UX principles for enterprise stakeholders."
        }
    }

    @classmethod
    def get_recommendations_for_gaps(cls, gaps: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Generates targeted project recommendations matching candidate's specific skill gaps.
        """
        recommended_projects = []
        seen_titles = set()

        for gap in gaps:
            key = gap["skill_key"]
            if key in cls.PROJECT_CATALOG:
                proj = cls.PROJECT_CATALOG[key]
                if proj["title"] not in seen_titles:
                    seen_titles.add(proj["title"])
                    recommended_projects.append(proj)
            if len(recommended_projects) >= 4:
                break

        # Fallback default project if specific gap match is missing
        if not recommended_projects:
            recommended_projects.append(cls.PROJECT_CATALOG["MACHINE_LEARNING"])
            recommended_projects.append(cls.PROJECT_CATALOG["FASTAPI"])

        return recommended_projects
