import re
from typing import Dict, List, Set, Tuple

class SkillTaxonomy:
    """
    Standardized Skill Taxonomy and Normalization Engine for Career Intelligence.
    Normalizes raw text tokens to canonical skill keys and assigns categories.
    """

    CATEGORIES = [
        "Programming",
        "Data Analysis & Processing",
        "Databases",
        "Machine Learning",
        "Deep Learning",
        "Generative AI & LLMs",
        "Web Development",
        "Cloud Computing",
        "DevOps & Systems",
        "Data Engineering",
        "Visualization & BI",
        "Statistics & Mathematics",
        "MLOps",
        "Security",
        "Tools & Productivity"
    ]

    # Mapping of raw aliases to canonical skill keys
    ALIAS_MAP: Dict[str, str] = {
        # Programming
        "python": "PYTHON",
        "python3": "PYTHON",
        "py": "PYTHON",
        "r": "R_LANG",
        "r-language": "R_LANG",
        "r language": "R_LANG",
        "java": "JAVA",
        "c++": "CPP",
        "cpp": "CPP",
        "c#": "CSHARP",
        "csharp": "CSHARP",
        "scala": "SCALA",
        "julia": "JULIA",
        "go": "GOLANG",
        "golang": "GOLANG",
        "javascript": "JAVASCRIPT",
        "js": "JAVASCRIPT",
        "typescript": "TYPESCRIPT",
        "ts": "TYPESCRIPT",

        # Data Analysis & Processing
        "pandas": "PANDAS",
        "numpy": "NUMPY",
        "scipy": "SCIPY",
        "polars": "POLARS",
        "data analysis": "DATA_ANALYSIS",
        "data analytics": "DATA_ANALYSIS",
        "exploratory data analysis": "EDA",
        "eda": "EDA",
        "data cleaning": "DATA_CLEANING",
        "data wrangling": "DATA_WRANGLING",
        "excel": "EXCEL",
        "ms excel": "EXCEL",
        "advanced excel": "EXCEL",

        # Databases & SQL
        "sql": "SQL",
        "structured query language": "SQL",
        "postgresql": "POSTGRESQL",
        "postgres": "POSTGRESQL",
        "mysql": "MYSQL",
        "sqlite": "SQLITE",
        "mongodb": "MONGODB",
        "mongo": "MONGODB",
        "nosql": "NOSQL",
        "redis": "REDIS",
        "oracle": "ORACLE",
        "sql server": "MS_SQL_SERVER",
        "mssql": "MS_SQL_SERVER",
        "snowflake": "SNOWFLAKE",
        "bigquery": "BIGQUERY",
        "redshift": "REDSHIFT",

        # Machine Learning
        "machine learning": "MACHINE_LEARNING",
        "ml": "MACHINE_LEARNING",
        "scikit-learn": "SCIKIT_LEARN",
        "sklearn": "SCIKIT_LEARN",
        "xgboost": "XGBOOST",
        "lightgbm": "LIGHTGBM",
        "catboost": "CATBOOST",
        "supervised learning": "SUPERVISED_LEARNING",
        "unsupervised learning": "UNSUPERVISED_LEARNING",
        "random forest": "RANDOM_FOREST",
        "decision trees": "DECISION_TREES",
        "logistic regression": "LOGISTIC_REGRESSION",
        "linear regression": "LINEAR_REGRESSION",
        "clustering": "CLUSTERING",
        "time series": "TIME_SERIES",

        # Deep Learning
        "deep learning": "DEEP_LEARNING",
        "dl": "DEEP_LEARNING",
        "pytorch": "PYTORCH",
        "tensorflow": "TENSORFLOW",
        "tf": "TENSORFLOW",
        "keras": "KERAS",
        "neural networks": "NEURAL_NETWORKS",
        "cnn": "CNN",
        "convolutional neural networks": "CNN",
        "rnn": "RNN",
        "lstm": "LSTM",
        "transformers": "TRANSFORMERS",

        # Generative AI & LLMs
        "generative ai": "GENERATIVE_AI",
        "genai": "GENERATIVE_AI",
        "gen ai": "GENERATIVE_AI",
        "llm": "LARGE_LANGUAGE_MODELS",
        "large language models": "LARGE_LANGUAGE_MODELS",
        "llms": "LARGE_LANGUAGE_MODELS",
        "langchain": "LANGCHAIN",
        "llama-index": "LLAMAINDEX",
        "llamaindex": "LLAMAINDEX",
        "rag": "RAG",
        "retrieval-augmented generation": "RAG",
        "retrieval augmented generation": "RAG",
        "prompt engineering": "PROMPT_ENGINEERING",
        "fine-tuning": "FINE_TUNING",
        "huggingface": "HUGGINGFACE",
        "hugging face": "HUGGINGFACE",
        "openai api": "OPENAI_API",
        "vector database": "VECTOR_DATABASES",
        "chromadb": "VECTOR_DATABASES",
        "pinecone": "VECTOR_DATABASES",

        # Web Development
        "react": "REACT",
        "react.js": "REACT",
        "reactjs": "REACT",
        "node": "NODEJS",
        "node.js": "NODEJS",
        "nodejs": "NODEJS",
        "fastapi": "FASTAPI",
        "flask": "FLASK",
        "django": "DJANGO",
        "html": "HTML_CSS",
        "css": "HTML_CSS",
        "html5": "HTML_CSS",
        "css3": "HTML_CSS",
        "tailwindcss": "TAILWIND_CSS",

        # Cloud Computing
        "aws": "AWS",
        "amazon web services": "AWS",
        "azure": "AZURE",
        "microsoft azure": "AZURE",
        "gcp": "GCP",
        "google cloud": "GCP",
        "google cloud platform": "GCP",
        "cloud computing": "CLOUD_COMPUTING",

        # DevOps & Systems
        "docker": "DOCKER",
        "kubernetes": "KUBERNETES",
        "k8s": "KUBERNETES",
        "git": "GIT",
        "github": "GIT",
        "gitlab": "GIT",
        "ci/cd": "CI_CD",
        "cicd": "CI_CD",
        "linux": "LINUX",
        "bash": "BASH",
        "shell": "BASH",

        # Data Engineering
        "apache spark": "SPARK",
        "spark": "SPARK",
        "pyspark": "PYSPARK",
        "hadoop": "HADOOP",
        "airflow": "AIRFLOW",
        "apache airflow": "AIRFLOW",
        "etl": "ETL",
        "elt": "ETL",
        "data pipelines": "DATA_PIPELINES",
        "kafka": "KAFKA",
        "dbt": "DBT",

        # Visualization & BI
        "tableau": "TABLEAU",
        "power bi": "POWER_BI",
        "powerbi": "POWER_BI",
        "matplotlib": "MATPLOTLIB",
        "seaborn": "SEABORN",
        "plotly": "PLOTLY",
        "dash": "DASH",
        "looker": "LOOKER",

        # Statistics & Math
        "statistics": "STATISTICS",
        "statistical analysis": "STATISTICS",
        "probability": "PROBABILITY",
        "hypothesis testing": "HYPOTHESIS_TESTING",
        "linear algebra": "LINEAR_ALGEBRA",
        "calculus": "CALCULUS",
        "ab testing": "AB_TESTING",
        "a/b testing": "AB_TESTING",

        # MLOps
        "mlops": "MLOPS",
        "mlflow": "MLFLOW",
        "wandb": "WANDB",
        "model monitoring": "MODEL_MONITORING",
        "model deployment": "MODEL_DEPLOYMENT",
        "dvc": "DVC",

        # Tools & Soft Skills
        "jira": "JIRA",
        "confluence": "CONFLUENCE",
        "communication": "COMMUNICATION",
        "storytelling": "DATA_STORYTELLING",
        "data storytelling": "DATA_STORYTELLING",
        "problem solving": "PROBLEM_SOLVING",
        "agile": "AGILE",
        "scrum": "SCRUM"
    }

    # Skill display names and categories
    SKILL_METADATA: Dict[str, Dict[str, str]] = {
        "PYTHON": {"display": "Python", "category": "Programming"},
        "R_LANG": {"display": "R Programming", "category": "Programming"},
        "JAVA": {"display": "Java", "category": "Programming"},
        "CPP": {"display": "C++", "category": "Programming"},
        "CSHARP": {"display": "C#", "category": "Programming"},
        "SCALA": {"display": "Scala", "category": "Programming"},
        "JULIA": {"display": "Julia", "category": "Programming"},
        "GOLANG": {"display": "Go (Golang)", "category": "Programming"},
        "JAVASCRIPT": {"display": "JavaScript", "category": "Programming"},
        "TYPESCRIPT": {"display": "TypeScript", "category": "Programming"},

        "PANDAS": {"display": "Pandas", "category": "Data Analysis & Processing"},
        "NUMPY": {"display": "NumPy", "category": "Data Analysis & Processing"},
        "SCIPY": {"display": "SciPy", "category": "Data Analysis & Processing"},
        "POLARS": {"display": "Polars", "category": "Data Analysis & Processing"},
        "DATA_ANALYSIS": {"display": "Data Analysis", "category": "Data Analysis & Processing"},
        "EDA": {"display": "Exploratory Data Analysis (EDA)", "category": "Data Analysis & Processing"},
        "DATA_CLEANING": {"display": "Data Cleaning", "category": "Data Analysis & Processing"},
        "DATA_WRANGLING": {"display": "Data Wrangling", "category": "Data Analysis & Processing"},
        "EXCEL": {"display": "Advanced Excel", "category": "Data Analysis & Processing"},

        "SQL": {"display": "SQL", "category": "Databases"},
        "POSTGRESQL": {"display": "PostgreSQL", "category": "Databases"},
        "MYSQL": {"display": "MySQL", "category": "Databases"},
        "SQLITE": {"display": "SQLite", "category": "Databases"},
        "MONGODB": {"display": "MongoDB", "category": "Databases"},
        "NOSQL": {"display": "NoSQL Databases", "category": "Databases"},
        "REDIS": {"display": "Redis", "category": "Databases"},
        "ORACLE": {"display": "Oracle DB", "category": "Databases"},
        "MS_SQL_SERVER": {"display": "MS SQL Server", "category": "Databases"},
        "SNOWFLAKE": {"display": "Snowflake", "category": "Databases"},
        "BIGQUERY": {"display": "Google BigQuery", "category": "Databases"},
        "REDSHIFT": {"display": "AWS Redshift", "category": "Databases"},

        "MACHINE_LEARNING": {"display": "Machine Learning", "category": "Machine Learning"},
        "SCIKIT_LEARN": {"display": "Scikit-Learn", "category": "Machine Learning"},
        "XGBOOST": {"display": "XGBoost", "category": "Machine Learning"},
        "LIGHTGBM": {"display": "LightGBM", "category": "Machine Learning"},
        "CATBOOST": {"display": "CatBoost", "category": "Machine Learning"},
        "SUPERVISED_LEARNING": {"display": "Supervised Learning", "category": "Machine Learning"},
        "UNSUPERVISED_LEARNING": {"display": "Unsupervised Learning", "category": "Machine Learning"},
        "RANDOM_FOREST": {"display": "Random Forest", "category": "Machine Learning"},
        "DECISION_TREES": {"display": "Decision Trees", "category": "Machine Learning"},
        "LOGISTIC_REGRESSION": {"display": "Logistic Regression", "category": "Machine Learning"},
        "LINEAR_REGRESSION": {"display": "Linear Regression", "category": "Machine Learning"},
        "CLUSTERING": {"display": "Clustering Algorithms", "category": "Machine Learning"},
        "TIME_SERIES": {"display": "Time Series Forecasting", "category": "Machine Learning"},

        "DEEP_LEARNING": {"display": "Deep Learning", "category": "Deep Learning"},
        "PYTORCH": {"display": "PyTorch", "category": "Deep Learning"},
        "TENSORFLOW": {"display": "TensorFlow", "category": "Deep Learning"},
        "KERAS": {"display": "Keras", "category": "Deep Learning"},
        "NEURAL_NETWORKS": {"display": "Neural Networks", "category": "Deep Learning"},
        "CNN": {"display": "CNN (Computer Vision)", "category": "Deep Learning"},
        "RNN": {"display": "RNN & LSTM", "category": "Deep Learning"},
        "TRANSFORMERS": {"display": "Transformers Architecture", "category": "Deep Learning"},

        "GENERATIVE_AI": {"display": "Generative AI", "category": "Generative AI & LLMs"},
        "LARGE_LANGUAGE_MODELS": {"display": "Large Language Models (LLMs)", "category": "Generative AI & LLMs"},
        "LANGCHAIN": {"display": "LangChain", "category": "Generative AI & LLMs"},
        "LLAMAINDEX": {"display": "LlamaIndex", "category": "Generative AI & LLMs"},
        "RAG": {"display": "Retrieval-Augmented Generation (RAG)", "category": "Generative AI & LLMs"},
        "PROMPT_ENGINEERING": {"display": "Prompt Engineering", "category": "Generative AI & LLMs"},
        "FINE_TUNING": {"display": "LLM Fine-Tuning", "category": "Generative AI & LLMs"},
        "HUGGINGFACE": {"display": "Hugging Face Transformers", "category": "Generative AI & LLMs"},
        "OPENAI_API": {"display": "OpenAI / Claude APIs", "category": "Generative AI & LLMs"},
        "VECTOR_DATABASES": {"display": "Vector DBs (Chroma/Pinecone)", "category": "Generative AI & LLMs"},

        "REACT": {"display": "React.js", "category": "Web Development"},
        "NODEJS": {"display": "Node.js", "category": "Web Development"},
        "FASTAPI": {"display": "FastAPI", "category": "Web Development"},
        "FLASK": {"display": "Flask", "category": "Web Development"},
        "DJANGO": {"display": "Django", "category": "Web Development"},
        "HTML_CSS": {"display": "HTML5 & CSS3", "category": "Web Development"},
        "TAILWIND_CSS": {"display": "TailwindCSS", "category": "Web Development"},

        "AWS": {"display": "Amazon Web Services (AWS)", "category": "Cloud Computing"},
        "AZURE": {"display": "Microsoft Azure", "category": "Cloud Computing"},
        "GCP": {"display": "Google Cloud Platform (GCP)", "category": "Cloud Computing"},
        "CLOUD_COMPUTING": {"display": "Cloud Architecture", "category": "Cloud Computing"},

        "DOCKER": {"display": "Docker", "category": "DevOps & Systems"},
        "KUBERNETES": {"display": "Kubernetes", "category": "DevOps & Systems"},
        "GIT": {"display": "Git & GitHub", "category": "DevOps & Systems"},
        "CI_CD": {"display": "CI/CD Pipelines", "category": "DevOps & Systems"},
        "LINUX": {"display": "Linux Administration", "category": "DevOps & Systems"},
        "BASH": {"display": "Bash / Shell Scripting", "category": "DevOps & Systems"},

        "SPARK": {"display": "Apache Spark", "category": "Data Engineering"},
        "PYSPARK": {"display": "PySpark", "category": "Data Engineering"},
        "HADOOP": {"display": "Hadoop", "category": "Data Engineering"},
        "AIRFLOW": {"display": "Apache Airflow", "category": "Data Engineering"},
        "ETL": {"display": "ETL / ELT Pipelines", "category": "Data Engineering"},
        "DATA_PIPELINES": {"display": "Data Pipeline Architecture", "category": "Data Engineering"},
        "KAFKA": {"display": "Apache Kafka", "category": "Data Engineering"},
        "DBT": {"display": "dbt (Data Build Tool)", "category": "Data Engineering"},

        "TABLEAU": {"display": "Tableau", "category": "Visualization & BI"},
        "POWER_BI": {"display": "Power BI", "category": "Visualization & BI"},
        "MATPLOTLIB": {"display": "Matplotlib", "category": "Visualization & BI"},
        "SEABORN": {"display": "Seaborn", "category": "Visualization & BI"},
        "PLOTLY": {"display": "Plotly", "category": "Visualization & BI"},
        "DASH": {"display": "Dash / Streamlit", "category": "Visualization & BI"},
        "LOOKER": {"display": "Looker", "category": "Visualization & BI"},

        "STATISTICS": {"display": "Statistical Inference", "category": "Statistics & Mathematics"},
        "PROBABILITY": {"display": "Probability & Distributions", "category": "Statistics & Mathematics"},
        "HYPOTHESIS_TESTING": {"display": "Hypothesis Testing (p-values)", "category": "Statistics & Mathematics"},
        "LINEAR_ALGEBRA": {"display": "Linear Algebra", "category": "Statistics & Mathematics"},
        "CALCULUS": {"display": "Multivariate Calculus", "category": "Statistics & Mathematics"},
        "AB_TESTING": {"display": "A/B Testing", "category": "Statistics & Mathematics"},

        "MLOPS": {"display": "MLOps", "category": "MLOps"},
        "MLFLOW": {"display": "MLflow", "category": "MLOps"},
        "WANDB": {"display": "Weights & Biases", "category": "MLOps"},
        "MODEL_MONITORING": {"display": "Model Monitoring & Drift", "category": "MLOps"},
        "MODEL_DEPLOYMENT": {"display": "Model Serving & Deployment", "category": "MLOps"},
        "DVC": {"display": "Data Version Control (DVC)", "category": "MLOps"},

        "JIRA": {"display": "Jira / Agile Tracking", "category": "Tools & Productivity"},
        "CONFLUENCE": {"display": "Confluence Documentation", "category": "Tools & Productivity"},
        "COMMUNICATION": {"display": "Technical Communication", "category": "Tools & Productivity"},
        "DATA_STORYTELLING": {"display": "Data Storytelling", "category": "Tools & Productivity"},
        "PROBLEM_SOLVING": {"display": "Analytical Problem Solving", "category": "Tools & Productivity"},
        "AGILE": {"display": "Agile Methodology", "category": "Tools & Productivity"},
        "SCRUM": {"display": "Scrum Framework", "category": "Tools & Productivity"}
    }

    @classmethod
    def normalize_skill(cls, raw_skill: str) -> str:
        """Normalizes a raw skill string to canonical key."""
        clean = raw_skill.strip().lower()
        if clean in cls.ALIAS_MAP:
            return cls.ALIAS_MAP[clean]
        
        # Check sub-patterns
        for alias, canonical in cls.ALIAS_MAP.items():
            if len(alias) > 2 and alias in clean:
                return canonical
        
        # Fallback to UPPER_SNAKE_CASE
        fallback_key = re.sub(r'[^A-Z0-9]+', '_', clean.upper()).strip('_')
        return fallback_key if fallback_key else "UNKNOWN_SKILL"

    @classmethod
    def get_metadata(cls, canonical_key: str) -> Dict[str, str]:
        """Returns display name and category for canonical key."""
        if canonical_key in cls.SKILL_METADATA:
            return cls.SKILL_METADATA[canonical_key]
        
        # Friendly title case fallback
        display_name = canonical_key.replace('_', ' ').title()
        return {"display": display_name, "category": "Tools & Productivity"}
