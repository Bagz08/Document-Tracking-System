import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
import joblib

DATA_PATH = "data/documents_balanced.csv"
MODEL_PATH = "model/document_classifier.joblib"
MODEL_DIR = "model"
os.makedirs(MODEL_DIR, exist_ok=True)  # make sure the folder exists
MODEL_PATH = os.path.join(MODEL_DIR, "document_classifier.joblib")

df = pd.read_csv(DATA_PATH)

df = df.rename(columns={
    "Title": "title",
    "Description": "description",
    "subcategory": "subcategory"
})

# print(df["subcategory"].value_counts())

df["text"] = (df["title"].fillna("") + " " + df["description"].fillna("")).str.lower()

# Drop classes with fewer than 2 examples
counts = df["subcategory"].value_counts()
df = df[df["subcategory"].isin(counts[counts >= 2].index)]

X_train, X_test, y_train, y_test = train_test_split(
    df["text"],
    df["subcategory"],
    test_size=0.3,          # formerly 0.2
    random_state=42,
    stratify=df["subcategory"]
)

pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=2)),
    ("clf", LogisticRegression(max_iter=1000))
])

pipeline.fit(X_train, y_train)

y_pred = pipeline.predict(X_test)
print(classification_report(y_test, y_pred))

joblib.dump(pipeline, MODEL_PATH)
print(f"Saved model to {MODEL_PATH}")

