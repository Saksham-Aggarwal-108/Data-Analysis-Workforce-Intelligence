from typing import Dict, Any, List, Optional

class RoleIntelligenceSystem:
    """
    Role Intelligence System containing canonical role definitions, required skills,
    skill importance ratings, and transparent confidence labels.
    """

    ROLES: Dict[str, Dict[str, Any]] = {
        "DATA_ANALYST": {
            "role_id": "DATA_ANALYST",
            "role_name": "Data Analyst",
            "description": "Translates raw operational data into actionable business insights, dashboards, and executive reports.",
            "experience_range": "0-3 Years",
            "confidence_label": "Observed Dataset Evidence",
            "core_skills": [
                {"key": "SQL", "importance": "critical", "required_level": 4},
                {"key": "EXCEL", "importance": "high", "required_level": 4},
                {"key": "DATA_ANALYSIS", "importance": "critical", "required_level": 4},
                {"key": "TABLEAU", "importance": "high", "required_level": 3},
                {"key": "POWER_BI", "importance": "high", "required_level": 3},
                {"key": "PYTHON", "importance": "medium", "required_level": 2},
                {"key": "STATISTICS", "importance": "medium", "required_level": 3},
                {"key": "DATA_STORYTELLING", "importance": "high", "required_level": 4}
            ],
            "preferred_skills": ["PANDAS", "POSTGRESQL", "EDA"],
            "common_deliverables": ["Executive BI Dashboard", "Ad-hoc SQL Query Reports", "Customer Churn Cohort Analysis"]
        },
        "BUSINESS_ANALYST": {
            "role_id": "BUSINESS_ANALYST",
            "role_name": "Business Analyst",
            "description": "Bridges executive strategy and technology teams by analyzing requirements, processes, and KPIs.",
            "experience_range": "1-4 Years",
            "confidence_label": "Derived Industry Benchmark",
            "core_skills": [
                {"key": "SQL", "importance": "high", "required_level": 3},
                {"key": "EXCEL", "importance": "critical", "required_level": 4},
                {"key": "DATA_ANALYSIS", "importance": "critical", "required_level": 4},
                {"key": "POWER_BI", "importance": "high", "required_level": 3},
                {"key": "DATA_STORYTELLING", "importance": "critical", "required_level": 4},
                {"key": "JIRA", "importance": "medium", "required_level": 3},
                {"key": "COMMUNICATION", "importance": "critical", "required_level": 5}
            ],
            "preferred_skills": ["TABLEAU", "AGILE", "SCRUM"],
            "common_deliverables": ["Business Requirement Document (BRD)", "Process Flow Map", "Executive KPI Scorecard"]
        },
        "DATA_SCIENTIST": {
            "role_id": "DATA_SCIENTIST",
            "role_name": "Data Scientist",
            "description": "Develops predictive machine learning models and statistical frameworks to solve complex enterprise problems.",
            "experience_range": "2-6 Years",
            "confidence_label": "Observed Dataset Evidence",
            "core_skills": [
                {"key": "PYTHON", "importance": "critical", "required_level": 5},
                {"key": "SQL", "importance": "critical", "required_level": 4},
                {"key": "PANDAS", "importance": "high", "required_level": 4},
                {"key": "NUMPY", "importance": "high", "required_level": 4},
                {"key": "MACHINE_LEARNING", "importance": "critical", "required_level": 4},
                {"key": "SCIKIT_LEARN", "importance": "critical", "required_level": 4},
                {"key": "STATISTICS", "importance": "critical", "required_level": 4},
                {"key": "HYPOTHESIS_TESTING", "importance": "high", "required_level": 3},
                {"key": "RANDOM_FOREST", "importance": "high", "required_level": 4},
                {"key": "EDA", "importance": "high", "required_level": 4}
            ],
            "preferred_skills": ["XGBOOST", "PYTORCH", "FASTAPI", "DOCKER", "POWER_BI"],
            "common_deliverables": ["Customer Churn Prediction Engine", "A/B Testing Framework", "Cross-Validated ML Pipeline"]
        },
        "MACHINE_LEARNING_ENGINEER": {
            "role_id": "MACHINE_LEARNING_ENGINEER",
            "role_name": "Machine Learning Engineer",
            "description": "Engineers scalable production ML pipelines, model serving APIs, and automated training systems.",
            "experience_range": "3-7 Years",
            "confidence_label": "Observed Dataset Evidence",
            "core_skills": [
                {"key": "PYTHON", "importance": "critical", "required_level": 5},
                {"key": "MACHINE_LEARNING", "importance": "critical", "required_level": 4},
                {"key": "SCIKIT_LEARN", "importance": "high", "required_level": 4},
                {"key": "XGBOOST", "importance": "high", "required_level": 4},
                {"key": "FASTAPI", "importance": "high", "required_level": 4},
                {"key": "DOCKER", "importance": "critical", "required_level": 4},
                {"key": "MLOPS", "importance": "critical", "required_level": 4},
                {"key": "GIT", "importance": "high", "required_level": 4},
                {"key": "SQL", "importance": "high", "required_level": 3}
            ],
            "preferred_skills": ["PYTORCH", "KUBERNETES", "MLFLOW", "AWS", "CI_CD"],
            "common_deliverables": ["Containerized Prediction Service", "Automated Model Training Pipeline", "Model Monitoring System"]
        },
        "AI_ENGINEER": {
            "role_id": "AI_ENGINEER",
            "role_name": "AI Engineer",
            "description": "Builds intelligent software systems leveraging deep learning, computer vision, and foundation AI models.",
            "experience_range": "2-6 Years",
            "confidence_label": "Derived Industry Benchmark",
            "core_skills": [
                {"key": "PYTHON", "importance": "critical", "required_level": 5},
                {"key": "DEEP_LEARNING", "importance": "critical", "required_level": 4},
                {"key": "PYTORCH", "importance": "critical", "required_level": 4},
                {"key": "TENSORFLOW", "importance": "high", "required_level": 3},
                {"key": "TRANSFORMERS", "importance": "critical", "required_level": 4},
                {"key": "GENERATIVE_AI", "importance": "high", "required_level": 3},
                {"key": "FASTAPI", "importance": "high", "required_level": 3},
                {"key": "DOCKER", "importance": "high", "required_level": 3}
            ],
            "preferred_skills": ["CNN", "HUGGINGFACE", "AWS", "OPENAI_API", "VECTOR_DATABASES"],
            "common_deliverables": ["Computer Vision Classification Engine", "Custom Transformer Fine-Tuning Service", "Multi-Modal AI Pipeline"]
        },
        "GENERATIVE_AI_ENGINEER": {
            "role_id": "GENERATIVE_AI_ENGINEER",
            "role_name": "Generative AI Engineer",
            "description": "Architects enterprise RAG systems, LLM agents, vector search databases, and fine-tuned generative AI applications.",
            "experience_range": "2-6 Years",
            "confidence_label": "External Industry Trend",
            "core_skills": [
                {"key": "PYTHON", "importance": "critical", "required_level": 5},
                {"key": "GENERATIVE_AI", "importance": "critical", "required_level": 5},
                {"key": "LARGE_LANGUAGE_MODELS", "importance": "critical", "required_level": 5},
                {"key": "LANGCHAIN", "importance": "critical", "required_level": 4},
                {"key": "RAG", "importance": "critical", "required_level": 5},
                {"key": "VECTOR_DATABASES", "importance": "critical", "required_level": 4},
                {"key": "PROMPT_ENGINEERING", "importance": "high", "required_level": 4},
                {"key": "FASTAPI", "importance": "high", "required_level": 4},
                {"key": "OPENAI_API", "importance": "high", "required_level": 4}
            ],
            "preferred_skills": ["LLAMAINDEX", "FINE_TUNING", "HUGGINGFACE", "DOCKER", "PYTORCH"],
            "common_deliverables": ["Enterprise Document RAG Assistant", "Autonomous Agent System", "Vector Search Knowledge Engine"]
        },
        "DATA_ENGINEER": {
            "role_id": "DATA_ENGINEER",
            "role_name": "Data Engineer",
            "description": "Builds robust data infrastructure, streaming pipelines, data warehouses, and automated ETL workflows.",
            "experience_range": "2-6 Years",
            "confidence_label": "Observed Dataset Evidence",
            "core_skills": [
                {"key": "PYTHON", "importance": "critical", "required_level": 4},
                {"key": "SQL", "importance": "critical", "required_level": 5},
                {"key": "POSTGRESQL", "importance": "high", "required_level": 4},
                {"key": "SPARK", "importance": "critical", "required_level": 4},
                {"key": "AIRFLOW", "importance": "critical", "required_level": 4},
                {"key": "ETL", "importance": "critical", "required_level": 5},
                {"key": "DATA_PIPELINES", "importance": "critical", "required_level": 5},
                {"key": "SNOWFLAKE", "importance": "high", "required_level": 3},
                {"key": "DOCKER", "importance": "high", "required_level": 3}
            ],
            "preferred_skills": ["PYSPARK", "KAFKA", "BIGQUERY", "AWS", "DBT"],
            "common_deliverables": ["Automated Airflow ETL Pipeline", "Spark Big Data Processing Job", "Cloud Data Warehouse Architecture"]
        },
        "MLOPS_ENGINEER": {
            "role_id": "MLOPS_ENGINEER",
            "role_name": "MLOps Engineer",
            "description": "Automates machine learning CI/CD, feature stores, model registry, monitoring, and infrastructure governance.",
            "experience_range": "3-7 Years",
            "confidence_label": "Derived Industry Benchmark",
            "core_skills": [
                {"key": "PYTHON", "importance": "critical", "required_level": 4},
                {"key": "MLOPS", "importance": "critical", "required_level": 5},
                {"key": "DOCKER", "importance": "critical", "required_level": 5},
                {"key": "KUBERNETES", "importance": "critical", "required_level": 4},
                {"key": "CI_CD", "importance": "critical", "required_level": 4},
                {"key": "MLFLOW", "importance": "high", "required_level": 4},
                {"key": "MODEL_MONITORING", "importance": "high", "required_level": 4},
                {"key": "AWS", "importance": "high", "required_level": 4}
            ],
            "preferred_skills": ["GCP", "AZURE", "DVC", "WANDB", "TERRAFORM"],
            "common_deliverables": ["Kubernetes Model Serving Cluster", "Automated Drift Monitoring Alerting System", "MLOps CI/CD Deployment Pipeline"]
        },
        "BACKEND_DEVELOPER": {
            "role_id": "BACKEND_DEVELOPER",
            "role_name": "Backend Developer",
            "description": "Constructs high-performance server-side web applications, REST APIs, microservices, and database systems.",
            "experience_range": "1-5 Years",
            "confidence_label": "Derived Industry Benchmark",
            "core_skills": [
                {"key": "PYTHON", "importance": "critical", "required_level": 4},
                {"key": "FASTAPI", "importance": "critical", "required_level": 4},
                {"key": "SQL", "importance": "critical", "required_level": 4},
                {"key": "POSTGRESQL", "importance": "critical", "required_level": 4},
                {"key": "DOCKER", "importance": "high", "required_level": 3},
                {"key": "GIT", "importance": "high", "required_level": 4},
                {"key": "REDIS", "importance": "medium", "required_level": 3}
            ],
            "preferred_skills": ["NODEJS", "FLASK", "JAVASCRIPT", "TYPESCRIPT", "CI_CD"],
            "common_deliverables": ["Asynchronous Microservices REST API", "Database Caching Layer", "Authentication & JWT Authorization Middleware"]
        }
    }

    @classmethod
    def get_all_roles(cls) -> List[Dict[str, Any]]:
        return list(cls.ROLES.values())

    @classmethod
    def get_role(cls, role_id: str) -> Optional[Dict[str, Any]]:
        key = role_id.upper()
        if key in cls.ROLES:
            return cls.ROLES[key]
        
        # Search by display name
        for r_id, r_data in cls.ROLES.items():
            if r_data["role_name"].lower() == role_id.lower():
                return r_data
        
        return None
