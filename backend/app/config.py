import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
DATA_DIR = os.path.join(PROJECT_ROOT, "data")

DATASET_FILES = {
    "market": "DataScience Jobs.csv",
    "skills": "Analytics Jobs.csv",
    "junior": "JDS Skill Traits.xlsx",
    "senior": "SDS Personality Traits.xlsx"
}

LAYER_NAMES = {
    "market": "Market Intelligence Layer",
    "skills": "Skill Intelligence Layer",
    "junior": "Junior Career Intelligence Layer",
    "senior": "Senior Success Intelligence Layer",
    "unified": "Unified Workforce Intelligence Layer"
}
