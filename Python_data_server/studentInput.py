from typing import List, Dict
from pyspark.sql import DataFrame
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.multioutput import MultiOutputClassifier
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.model_selection import train_test_split
from model_state import ModelState
from pydantic import BaseModel

# --- Pydantic Model for Input Validation ---
class StudentInput(BaseModel):
    student_id: str
    student_name: str
    attendance_rate: float
    gpa: float
    hours_studied_per_week: float
    previous_failures: int
    attendance_percentage: float
    quizzes_completed: int
    assignments_completed: int
    lms_engagement_score: float

# --- Model Training Function ---
def train_model_from_csv(spark_df):
    print("Training model...")

    feature_cols = [
        "attendance_rate",
        "gpa",
        "hours_studied_per_week",
        "previous_failures",
        "attendance_percentage",
        "quizzes_completed",
        "assignments_completed",
        "lms_engagement_score"
    ]
    target_cols = ["dropout_risk", "course_demand", "predicted_performance"]

    pandas_df = spark_df.select(*feature_cols, *target_cols).toPandas()
    pandas_df.dropna(subset=feature_cols + target_cols, inplace=True)

    # --- Encode target columns ---
    ModelState.target_encoders = {}
    for col in target_cols:
        le = LabelEncoder()
        pandas_df[col] = le.fit_transform(pandas_df[col])
        ModelState.target_encoders[col] = le

    X = pandas_df[feature_cols]
    y = pandas_df[target_cols]

    # --- Train/Test Split ---
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y["dropout_risk"]
    )

    base_model = RandomForestClassifier(n_estimators=100, random_state=42)
    ModelState.rf_model = MultiOutputClassifier(base_model)
    ModelState.rf_model.fit(X_train, y_train)

    # --- Training Metrics ---
    y_train_pred = ModelState.rf_model.predict(X_train)
    train_metrics = {}
    for i, label in enumerate(target_cols):
        acc = accuracy_score(y_train[label], y_train_pred[:, i])
        report = classification_report(y_train[label], y_train_pred[:, i], output_dict=True)
        cm = confusion_matrix(y_train[label], y_train_pred[:, i])
        train_metrics[label] = {
            "accuracy": acc,
            "classification_report": report,
            "confusion_matrix": cm.tolist()
        }

    # --- Test Metrics ---
    y_test_pred = ModelState.rf_model.predict(X_test)
    test_metrics = {}
    for i, label in enumerate(target_cols):
        acc = accuracy_score(y_test[label], y_test_pred[:, i])
        report = classification_report(y_test[label], y_test_pred[:, i], output_dict=True)
        cm = confusion_matrix(y_test[label], y_test_pred[:, i])
        test_metrics[label] = {
            "accuracy": acc,
            "classification_report": report,
            "confusion_matrix": cm.tolist()
        }

    ModelState.last_metrics = {
        "train": train_metrics,
        "test": test_metrics
    }

    print("Model trained:", ModelState.rf_model is not None)
    return {
        "message": "Model trained successfully",
        "performance_summary": {
            "train": train_metrics,
            "test": test_metrics
        }
    }

# --- Prediction Function ---
def predict_student_from_input(user_input: dict):
    if ModelState.rf_model is None:
        return {"error": "Model not trained yet"}

    feature_cols = [
        "attendance_rate",
        "gpa",
        "hours_studied_per_week",
        "previous_failures",
        "attendance_percentage",
        "quizzes_completed",
        "assignments_completed",
        "lms_engagement_score"
    ]
    input_data = {col: user_input.get(col, 0) for col in feature_cols}
    input_df = pd.DataFrame([input_data], columns=feature_cols)

    y_pred = ModelState.rf_model.predict(input_df)[0]
    labels = ["dropout_risk", "course_demand", "predicted_performance"]

    # Only prediction fields in result (no student_id, student_name)
    result = {}
    for i, label in enumerate(labels):
        encoder = ModelState.target_encoders.get(label)
        if encoder:
            result[label] = encoder.inverse_transform([y_pred[i]])[0]
        else:
            result[label] = str(y_pred[i])  # fallback

    return result




# from typing import List, Dict
# from pyspark.sql import DataFrame
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.preprocessing import LabelEncoder
# from sklearn.multioutput import MultiOutputClassifier
# import pandas as pd
# from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
# from model_state import ModelState
# from pydantic import BaseModel

# # --- Pydantic Model for Input Validation ---
# class StudentInput(BaseModel):
#     attendance_rate: float
#     gpa: float
#     hours_studied_per_week: float
#     previous_failures: int
#     attendance_percentage: float
#     quizzes_completed: int
#     assignments_completed: int
#     lms_engagement_score: float

# # --- Model Training Function ---
# def train_model_from_csv(spark_df):
#     print("Training model...")

#     feature_cols = [
#         "attendance_rate",
#         "gpa",
#         "hours_studied_per_week",
#         "previous_failures",
#         "attendance_percentage",
#         "quizzes_completed",
#         "assignments_completed",
#         "lms_engagement_score"
#     ]
#     target_cols = ["dropout_risk", "course_demand", "predicted_performance"]

#     pandas_df = spark_df.select(*feature_cols, *target_cols).toPandas()
#     pandas_df.dropna(subset=feature_cols + target_cols, inplace=True)

#     # --- Encode target columns ---
#     ModelState.target_encoders = {}
#     for col in target_cols:
#         le = LabelEncoder()
#         pandas_df[col] = le.fit_transform(pandas_df[col])
#         ModelState.target_encoders[col] = le

#     X = pandas_df[feature_cols]
#     y = pandas_df[target_cols]

#     base_model = RandomForestClassifier(n_estimators=100, random_state=42)
#     ModelState.rf_model = MultiOutputClassifier(base_model)
#     ModelState.rf_model.fit(X, y)

#     y_pred = ModelState.rf_model.predict(X)
#     metrics = {}
#     for i, label in enumerate(target_cols):
#         acc = accuracy_score(y[label], y_pred[:, i])
#         report = classification_report(y[label], y_pred[:, i], output_dict=True)
#         cm = confusion_matrix(y[label], y_pred[:, i])
#         metrics[label] = {
#             "accuracy": acc,
#             "classification_report": report,
#             "confusion_matrix": cm.tolist()
#         }
#     ModelState.last_metrics = metrics

#     print("Model trained:", ModelState.rf_model is not None)
#     return {
#         "message": "Model trained successfully",
#         "performance_summary": metrics
#     }

# # --- Prediction Function ---
# def predict_student_from_input(user_input: dict):
#     if ModelState.rf_model is None:
#         return {"error": "Model not trained yet"}

#     # --- Ensure input columns order is correct ---
#     feature_cols = [
#         "attendance_rate",
#         "gpa",
#         "hours_studied_per_week",
#         "previous_failures",
#         "attendance_percentage",
#         "quizzes_completed",
#         "assignments_completed",
#         "lms_engagement_score"
#     ]
#     # Fill missing columns with 0 if not present (for safety)
#     input_data = {col: user_input.get(col, 0) for col in feature_cols}
#     input_df = pd.DataFrame([input_data], columns=feature_cols)

#     # --- Predict ---
#     y_pred = ModelState.rf_model.predict(input_df)[0]
#     labels = ["dropout_risk", "course_demand", "predicted_performance"]

#     # --- Decode predictions using LabelEncoders ---
#     result = {}
#     for i, label in enumerate(labels):
#         encoder = ModelState.target_encoders.get(label)
#         if encoder:
#             result[label] = encoder.inverse_transform([y_pred[i]])[0]
#         else:
#             result[label] = str(y_pred[i])  # fallback

#     return result