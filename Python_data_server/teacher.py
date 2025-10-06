from typing import Dict
from pyspark.sql import DataFrame, SparkSession
from pyspark.sql import functions as F
import pandas as pd
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import LabelEncoder , StandardScaler  , OneHotEncoder
from sklearn.ensemble import GradientBoostingClassifier 
from sklearn.model_selection import train_test_split
from fastapi import  HTTPException

import numpy as np

from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from xgboost import XGBRegressor
from sklearn.metrics import r2_score
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import io
from sklearn.impute import SimpleImputer
from sklearn.metrics import r2_score, mean_absolute_error
from pyspark.sql.functions import col, avg, count, desc

from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, Form
from typing import Optional, Dict, Any, List
from sklearn.base import clone



from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.ensemble import  RandomForestClassifier
from xgboost import  XGBClassifier
from sklearn.metrics import classification_report, accuracy_score, r2_score, mean_absolute_error, mean_squared_error
from sklearn.impute import SimpleImputer
import warnings
warnings.filterwarnings('ignore')








# Allowed models

#night
MODELS = {
    "Linear Regression": LinearRegression(),
    # "Random Forest": RandomForestRegressor(n_estimators=150, max_depth=8, random_state=42),
    "Random Forest": RandomForestRegressor(n_estimators=150,max_depth=9,min_samples_split=2,min_samples_leaf=1,random_state=42),
    "Gradient Boosting": GradientBoostingRegressor(n_estimators=100, max_depth=5, random_state=42),
    "XGBoost": XGBRegressor(n_estimators=100, max_depth=5, random_state=42)
}


# MODELS = {
#     "Linear Regression": LinearRegression(),
#     "Random Forest": RandomForestRegressor(n_estimators=200, random_state=42),
#     "Gradient Boosting": GradientBoostingRegressor(n_estimators=200, learning_rate=0.1, random_state=42),
#     "XGBoost": XGBRegressor(n_estimators=200, learning_rate=0.1, random_state=42)
# }

# Models with tuned parameters to avoid overfitting
# MODELS = {
#     "Linear Regression": LinearRegression(),
#     "Random Forest": RandomForestRegressor(
#         n_estimators=200,
#         max_depth=9,
#         min_samples_split=6,
#         min_samples_leaf=3,
#         random_state=42
#     ),
#     "Gradient Boosting": GradientBoostingRegressor(
#         n_estimators=200,
#         learning_rate=0.1,
#         max_depth=6,
#         min_samples_split=6,
#         min_samples_leaf=3,
#         random_state=42
#     ),
#     "XGBoost": XGBRegressor(
#         n_estimators=200,
#         learning_rate=0.1,
#         max_depth=6,
#         min_child_weight=3,
#         subsample=0.8,
#         colsample_bytree=0.8,
#         random_state=42
#     )
# }


# def get_course_overview(
#     spark: SparkSession,
#     attendance_df: DataFrame,
#     lms_df: DataFrame,
#     demographic_df: DataFrame,
#     course_id: str,
# ):
#     # ✅ Attendance summary
#     attendance_summary = (
#         attendance_df.filter(F.col("course_id") == course_id)
#         .groupBy("attendance_status")
#         .count()
#         .toPandas()
#     )

#     # ✅ LMS Engagement Summary (based on engagement_score, quizzes, assignments)
#     lms_engagement = lms_df.agg(
#         F.avg("lms_engagement_score").alias("avg_engagement_score"),
#         F.avg("quizzes_completed").alias("avg_quizzes_completed"),
#         F.avg("assignments_completed").alias("avg_assignments_completed"),
#     ).toPandas()

#     # ✅ Create temp views for SQL
#     attendance_df.createOrReplaceTempView("attendance_data")
#     lms_df.createOrReplaceTempView("lms_data")
#     demographic_df.createOrReplaceTempView("student_demographic_data")

#     # ✅ Student performance query
#     student_performance_query = f"""
#         WITH student_course_performance AS (
#             SELECT 
#                 d.student_id,
#                 d.gpa AS current_gpa,
#                 a.attendance_percentage,
#                 l.quizzes_completed
#             FROM student_demographic_data d
#             JOIN attendance_data a ON d.student_id = a.student_id
#             JOIN lms_data l ON d.student_id = l.student_id AND a.course_id = l.course_id
#             WHERE a.course_id = '{course_id}'
#         )
#         SELECT 
#             student_id,
#             current_gpa,
#             attendance_percentage,
#             ROUND(AVG(quizzes_completed), 2) as avg_quizzes,
#             COUNT(*) as total_records
#         FROM student_course_performance
#         GROUP BY student_id, current_gpa, attendance_percentage
#         HAVING total_records > 0
#     """

#     student_performance = spark.sql(student_performance_query).toPandas()

#     # ✅ Summary metrics
#     summary_metrics = {
#         "total_students": len(student_performance),
#         "avg_gpa": (
#             round(student_performance["current_gpa"].mean(), 2)
#             if not student_performance.empty
#             else 0
#         ),
#         "avg_attendance": (
#             round(student_performance["attendance_percentage"].mean(), 2)
#             if not student_performance.empty
#             else 0
#         ),
#         "avg_quizzes": (
#             round(student_performance["avg_quizzes"].mean(), 2)
#             if not student_performance.empty
#             else 0
#         ),
#     }

#     return {
#         "summary_metrics": summary_metrics,
#         "attendance_summary": attendance_summary.to_dict(orient="records"),
#         "lms_engagement": lms_engagement.to_dict(orient="records"),
#         "student_performance": student_performance.to_dict(orient="records"),
#     }


def get_academic_performance_metrics(df: DataFrame, prev_avg_gpa=None):
    # 1️⃣ Average GPA
    avg_gpa = df.select(avg(col("gpa")).alias("avg_gpa")).collect()[0]["avg_gpa"]

    trend_arrow = None
    if prev_avg_gpa is not None:
        if avg_gpa > prev_avg_gpa:
            trend_arrow = "↑"  # Upar
        elif avg_gpa < prev_avg_gpa:
            trend_arrow = "↓"  # Neeche
        else:
            trend_arrow = "→"  # Stable

    # 2️⃣ Performance Distribution
    performance_dist = (
        df.groupBy("predicted_performance")
          .agg(count("*").alias("count"))
          .orderBy("count", ascending=False)
          .collect()
    )
    performance_chart_data = [
        {"label": row["predicted_performance"], "value": row["count"]}
        for row in performance_dist
    ]

    # 3️⃣ Top 5 Students
    top_students = (
    df.filter(col("predicted_performance") == "Excellent")
      .select("student_id", "Name", "gpa", "predicted_performance")
      .orderBy(col("gpa").desc())
      .limit(10)
      .collect()
)
    top_students_list = [
        {
            "student_id": row["student_id"],
            "name": row["Name"],
            "gpa": round(row["gpa"], 2),
            "performance": row["predicted_performance"]
        }
        for row in top_students
    ]

    return {
        "average_gpa": round(avg_gpa, 2),
        "trend_arrow": trend_arrow,
        "performance_distribution": performance_chart_data,
        "top_students": top_students_list
    }



def get_course_overview(
    spark: SparkSession,
    attendance_df: DataFrame,
    lms_df: DataFrame,
    demographic_df: DataFrame,
    # course_id: str,  # remove this parameter
):
    # Attendance summary without filtering course_id
    attendance_summary = (
        attendance_df
        .groupBy("attendance_status")
        .count()
        .toPandas()
    )

    # LMS Engagement Summary without filtering course_id
    lms_engagement = lms_df.agg(
        F.avg("lms_engagement_score").alias("avg_engagement_score"),
        F.avg("quizzes_completed").alias("avg_quizzes_completed"),
        F.avg("assignments_completed").alias("avg_assignments_completed"),
    ).toPandas()

    # Create temp views
    attendance_df.createOrReplaceTempView("attendance_data")
    lms_df.createOrReplaceTempView("lms_data")
    demographic_df.createOrReplaceTempView("student_demographic_data")

    # Student performance query without course_id filter
    student_performance_query = """
        WITH student_course_performance AS (
            SELECT 
                d.student_id,
                d.gpa AS current_gpa,
                a.attendance_percentage,
                l.quizzes_completed
            FROM student_demographic_data d
            JOIN attendance_data a ON d.student_id = a.student_id
            JOIN lms_data l ON d.student_id = l.student_id AND a.batch_id = l.batch_id
        )
        SELECT 
            student_id,
            current_gpa,
            attendance_percentage,
            ROUND(AVG(quizzes_completed), 2) as avg_quizzes,
            COUNT(*) as total_records
        FROM student_course_performance
        GROUP BY student_id, current_gpa, attendance_percentage
        HAVING total_records > 0
    """

    student_performance = spark.sql(student_performance_query).toPandas()

    summary_metrics = {
    "total_students": len(student_performance),
    "avg_gpa": round(student_performance["current_gpa"].mean(), 2) if not student_performance.empty else 0,
    "avg_attendance": round(student_performance["attendance_percentage"].mean(), 2) if not student_performance.empty else 0,
    "avg_quizzes": round(student_performance["avg_quizzes"].mean(), 2) if not student_performance.empty else 0,
    "avg_assignments": round(lms_engagement["avg_assignments_completed"].iloc[0], 2) if not lms_engagement.empty else 0,
    
    # ✅ Add LMS Engagement Score
    "avg_lms_engagement_score": round(student_performance["lms_engagement_score"].mean(), 2) if "lms_engagement_score" in student_performance.columns and not student_performance.empty else 0,
    
    # ✅ Add Hours Studied Per Week
    "avg_hours_studied": round(student_performance["hours_studied_per_week"].mean(), 2) if "hours_studied_per_week" in student_performance.columns and not student_performance.empty else 0
}

    return {
        "summary_metrics": summary_metrics,
        "attendance_summary": attendance_summary.to_dict(orient="records"),
        "lms_engagement": lms_engagement.to_dict(orient="records"),
        "student_performance": student_performance.to_dict(orient="records"),
    }



# course demond prdiction
def predict_course_demand_from_df(spark_df: pd.DataFrame):
    df = spark_df.toPandas()
    # Feature columns
    feature_cols = [
        "gpa",
        "attendance_rate",
        "hours_studied_per_week",
        "previous_failures",
        "quizzes_completed",
        "assignments_completed",
        "lms_engagement_score",
        "course",  # categorical
          # categorical
    ]

    # Drop columns if they exist (axis=1 means columns)
    cols_to_drop = ["Name", "student_id"]
    existing_cols_to_drop = [col for col in cols_to_drop if col in df.columns]
    df = df.drop(existing_cols_to_drop, axis=1)

    # Encode categorical features
    label_encoders = {}
    for col in feature_cols:
        if col in df.columns and df[col].dtype == "object":
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))
            label_encoders[col] = le

    # Encode target variable
    target_le = LabelEncoder()
    df["course_demand"] = target_le.fit_transform(df["course_demand"].astype(str))

    # Select features and target
    X = df[feature_cols]
    y = df["course_demand"]

    # Train/Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Train model
    model = GradientBoostingClassifier(n_estimators=150, learning_rate=0.1, max_depth=4, random_state=42)
    model.fit(X_train, y_train)

    # Predict
    y_pred = model.predict(X_test)

    # Evaluation
    acc = accuracy_score(y_test, y_pred)
    print(f"🎯 Course_Demand Accuracy: {round(acc * 100, 2)}%")
    print("📊 Classification Report:\n")
    print(classification_report(y_test, y_pred, target_names=target_le.classes_))

    # Prepare output
    output = X_test.copy()
    output["actual_course_demand"] = target_le.inverse_transform(y_test)
    output["predicted_course_demand"] = target_le.inverse_transform(y_pred)

    # Inverse transform categorical features back to original strings
    for col in ["course"]:
        if col in output.columns and col in label_encoders:
            output[col] = label_encoders[col].inverse_transform(output[col])

    return output.reset_index(drop=True).to_dict(orient="records")




# all models predict


# Preprocessing + Prediction
# def train_and_predict(df: pd.DataFrame, model_name: str):
#     feature_cols = [
#         "gpa",
#         "hours_studied_per_week",
#         "previous_failures",
#         "attendance_percentage",
#         "quizzes_completed",
#         "assignments_completed",
#         "lms_engagement_score"
#     ]

#     # Drop unnecessary cols
#     drop_cols = [col for col in ["Name", "student_id"] if col in df.columns]
#     df = df.drop(columns=drop_cols, errors='ignore')

#     # Fill missing
#     df = df.fillna(0)

#     # Encode categorical features
#     for col in feature_cols:
#         if col in df.columns and df[col].dtype == object:
#             le = LabelEncoder()
#             df[col] = le.fit_transform(df[col].astype(str))

#     # Target
#     if "dropout_risk" not in df.columns:
#         raise ValueError("CSV must contain 'dropout_risk' column")

#     # Normalize if needed
#     if df["dropout_risk"].max() <= 1:
#         y = df["dropout_risk"] * 100
#     else:
#         y = df["dropout_risk"]

#     X = df[feature_cols]

#     # Scaling
#     scaler = StandardScaler()
#     X = pd.DataFrame(scaler.fit_transform(X), columns=feature_cols)

#     # Train/Test split
#     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#     # Train model
#     if model_name not in MODELS:
#         raise ValueError("Invalid model name selected")

#     model = MODELS[model_name]
#     model.fit(X_train, y_train)

#     # Predictions
#     predictions = model.predict(X_test)
#     predictions = np.clip(predictions, 0, 100)

#     # Metrics
#     mean_risk = np.mean(predictions)
#     std_dev = np.std(predictions)
#     min_risk = np.min(predictions)
#     max_risk = np.max(predictions)
#     confidence_score = r2_score(y_test, predictions) * 100

#     # Final Output Format
#     return {
#         "Prediction Preview": f"""
# Model: {model_name}
# Mean Dropout Risk: {round(mean_risk, 2)}%
# Std Deviation: {round(std_dev, 2)}
# Min Dropout Risk: {round(min_risk, 2)}%
# Max Dropout Risk: {round(max_risk, 2)}%
# Confidence Score: {round(confidence_score, 2)} / 100
# """
#     }




#night 2nd last code
# # Mapping for categorical target
# DROPOUT_MAPPING = {
#     "Low": 0.2,    # 20%
#     "Medium": 0.5, # 50%
#     "High": 0.8    # 80%
# }

# FEATURE_COLS = [
#     "gpa",
#     "hours_studied_per_week",
#     "previous_failures",
#     "attendance_percentage",
#     "quizzes_completed",
#     "assignments_completed",
#     "lms_engagement_score"
# ]

# def train_and_predict(df: pd.DataFrame, model_name: str):
#     # Check required columns
#     missing_cols = [col for col in FEATURE_COLS if col not in df.columns]
#     if missing_cols:
#         raise HTTPException(status_code=400, detail=f"Missing columns: {missing_cols}")
#     if "dropout_risk" not in df.columns:
#         raise HTTPException(status_code=400, detail="Dataset must contain 'dropout_risk' column.")

#     # Handle missing values
#     df = df.fillna(0)

#     # Encode categorical features in X
#     for col in FEATURE_COLS:
#         if df[col].dtype == object:
#             le = LabelEncoder()
#             df[col] = le.fit_transform(df[col].astype(str))

#     # Encode target values
#     if df["dropout_risk"].dtype == object:
#         df["dropout_risk"] = df["dropout_risk"].map(DROPOUT_MAPPING)
#         if df["dropout_risk"].isnull().any():
#             raise HTTPException(status_code=400, detail="Invalid value in 'dropout_risk'. Must be Low/Medium/High.")

#     # Features & Target
#     X = df[FEATURE_COLS]
#     y = df["dropout_risk"]

#     # Train-test split
#     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#     if model_name not in MODELS:
#         raise HTTPException(status_code=400, detail="Invalid model name selected.")

#     model = MODELS[model_name]
#     model.fit(X_train, y_train)

#     # Predictions
#     predictions = model.predict(X_test)
#     predictions = np.clip(predictions, 0, 1)  # keep in range 0–1

#     # Convert to percentage
#     predictions_percent = predictions * 100
#     y_test_percent = y_test * 100

#     # Stats
#     # mean_risk = round(np.mean(predictions_percent), 2)
#     # std_dev = round(np.std(predictions_percent), 2)
#     # min_risk = round(np.min(predictions_percent), 2)
#     # max_risk = round(np.max(predictions_percent), 2)
#     # confidence_score = round(r2_score(y_test_percent, predictions_percent) * 100, 2)
#     mean_risk = round(float(np.mean(predictions_percent)), 2)
#     std_dev = round(float(np.std(predictions_percent)), 2)
#     min_risk = round(float(np.min(predictions_percent)), 2)
#     max_risk = round(float(np.max(predictions_percent)), 2)
#     # Confidence score display ko hamesha positive rakha
#     confidence_score = abs(round(r2_score(y_test_percent, predictions_percent) * 100, 2))

#     # Format output exactly as required
#     return {
#         "Model": model_name,
#         "Mean Dropout Risk": f"{mean_risk}%",
#         "Std Deviation": f"{std_dev}",
#         "Min Dropout Risk": f"{min_risk}%",
#         "Max Dropout Risk": f"{max_risk}%",
#         "Confidence Score": f"{confidence_score} / 100"
#     }
    


# Mapping for categorical target
# DROPOUT_MAPPING = {
#     "Low": 0.2,    # 20%
#     "Medium": 0.5, # 50%
#     "High": 0.8    # 80%
# }

# # Features list
# FEATURE_COLS = [
#     "gpa",
#     "hours_studied_per_week",
#     "previous_failures",
#     "attendance_percentage",
#     "quizzes_completed",
#     "assignments_completed",
#     "lms_engagement_score"
# ]

# def train_and_predict(df: pd.DataFrame, model_name: str):
#     # Check for missing required columns
#     missing_cols = [col for col in FEATURE_COLS if col not in df.columns]
#     if missing_cols:
#         raise HTTPException(status_code=400, detail=f"Missing columns: {missing_cols}")
#     if "dropout_risk" not in df.columns:
#         raise HTTPException(status_code=400, detail="Dataset must contain 'dropout_risk' column.")

#     # Handle missing values
#     df = df.fillna(0)

#     # Encode target variable
#     if df["dropout_risk"].dtype == object:
#         df["dropout_risk"] = df["dropout_risk"].map(DROPOUT_MAPPING)
#         if df["dropout_risk"].isnull().any():
#             raise HTTPException(status_code=400, detail="Invalid value in 'dropout_risk'. Must be Low/Medium/High.")

#     # Split features into numeric and categorical
#     numeric_features = [col for col in FEATURE_COLS if df[col].dtype != object]
#     categorical_features = [col for col in FEATURE_COLS if df[col].dtype == object]

#     # Preprocessing pipeline
#     numeric_transformer = Pipeline(steps=[
#         ('scaler', StandardScaler())
#     ])
#     categorical_transformer = Pipeline(steps=[
#         ('onehot', OneHotEncoder(handle_unknown='ignore'))
#     ])
#     preprocessor = ColumnTransformer(
#         transformers=[
#             ('num', numeric_transformer, numeric_features),
#             ('cat', categorical_transformer, categorical_features)
#         ]
#     )

#     # Train-test split
#     X = df[FEATURE_COLS]
#     y = df["dropout_risk"]
#     X_train, X_test, y_train, y_test = train_test_split(
#         X, y, test_size=0.2, random_state=42
#     )

#     # Select model
#     if model_name not in MODELS:
#         raise HTTPException(status_code=400, detail="Invalid model name selected.")
#     model = MODELS[model_name]

#     # Full pipeline: preprocessing + model
#     pipeline = Pipeline(steps=[('preprocessor', preprocessor),
#                                ('model', model)])

#     # Train
#     pipeline.fit(X_train, y_train)

#     # Predictions
#     predictions = pipeline.predict(X_test)
#     predictions = np.clip(predictions, 0, 1)  # keep in range 0–1

#     # Convert to %
#     predictions_percent = predictions * 100
#     y_test_percent = y_test * 100

#     # Calculate stats
#     mean_risk = round(np.mean(predictions_percent), 2)
#     std_dev = round(np.std(predictions_percent), 2)
#     min_risk = round(np.min(predictions_percent), 2)
#     max_risk = round(np.max(predictions_percent), 2)
#     confidence_score = round(r2_score(y_test_percent, predictions_percent) * 100, 2)

#     # Output
#     return {
#         "Model": model_name,
#         "Mean Dropout Risk": f"{mean_risk}%",
#         "Std Deviation": f"{std_dev}",
#         "Min Dropout Risk": f"{min_risk}%",
#         "Max Dropout Risk": f"{max_risk}%",
#         "Confidence Score": f"{confidence_score} / 100"
#     }



# new code

# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split, cross_val_score
# from sklearn.preprocessing import StandardScaler, LabelEncoder
# from sklearn.linear_model import LinearRegression
# from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
# from xgboost import XGBRegressor
# from sklearn.impute import SimpleImputer
# from sklearn.metrics import r2_score
# from fastapi import HTTPException

# # Models dictionary
# MODELS = {
#     "Linear Regression": LinearRegression(),
#     "Random Forest": RandomForestRegressor(n_estimators=150, max_depth=9, min_samples_split=2, min_samples_leaf=1, random_state=42),
#     "Gradient Boosting": GradientBoostingRegressor(n_estimators=100, max_depth=5, random_state=42),
#     "XGBoost": XGBRegressor(n_estimators=100, max_depth=5, random_state=42)
# }

# # Mapping for categorical target
# DROPOUT_MAPPING = {
#     "Low": 0.2,    # 20%
#     "Medium": 0.5, # 50%
#     "High": 0.8    # 80%
# }

# FEATURE_COLS = [
#     "gpa",
#     "hours_studied_per_week",
#     "previous_failures",
#     "attendance_percentage",
#     "quizzes_completed",
#     "assignments_completed",
#     "lms_engagement_score"
# ]

# # Enhanced train_and_predict function
# def train_and_predict(df: pd.DataFrame, model_name: str):
#     # Check required columns
#     missing_cols = [col for col in FEATURE_COLS if col not in df.columns]
#     if missing_cols:
#         raise HTTPException(status_code=400, detail=f"Missing columns: {missing_cols}")
#     if "dropout_risk" not in df.columns:
#         raise HTTPException(status_code=400, detail="Dataset must contain 'dropout_risk' column.")
    
#     # Handle missing values with imputation
#     imputer = SimpleImputer(strategy='mean')  # You can also try 'median' or other strategies
#     df[FEATURE_COLS] = imputer.fit_transform(df[FEATURE_COLS])
    
#     # Encode categorical features if they exist in the dataframe
#     for col in FEATURE_COLS:
#         if df[col].dtype == object:
#             le = LabelEncoder()
#             df[col] = le.fit_transform(df[col].astype(str))
    
#     # Encode target values (dropout risk)
#     if df["dropout_risk"].dtype == object:
#         df["dropout_risk"] = df["dropout_risk"].map(DROPOUT_MAPPING)
#         if df["dropout_risk"].isnull().any():
#             raise HTTPException(status_code=400, detail="Invalid value in 'dropout_risk'. Must be Low/Medium/High.")

#     # Features & Target
#     X = df[FEATURE_COLS]
#     y = df["dropout_risk"]
    
#     # Split the data into training and test sets
#     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
#     # Feature Scaling (Standardization) for better model performance
#     scaler = StandardScaler()
#     X_train_scaled = scaler.fit_transform(X_train)
#     X_test_scaled = scaler.transform(X_test)
    
#     # Check if model_name is valid
#     if model_name not in MODELS:
#         raise HTTPException(status_code=400, detail="Invalid model name selected.")
    
#     # Select model
#     model = MODELS[model_name]
    
#     # Cross-validation to assess model performance (use k-fold)
#     cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring='neg_mean_squared_error')  # You can use other metrics
    
#     # Train the model
#     model.fit(X_train_scaled, y_train)
    
#     # Predictions
#     predictions = model.predict(X_test_scaled)
    
#     # Clip predictions to ensure values are within the range [0, 1]
#     predictions = np.clip(predictions, 0, 1)
    
#     # Convert to percentage
#     predictions_percent = predictions * 100
#     y_test_percent = y_test * 100
    
#     # Stats
#     mean_risk = round(np.mean(predictions_percent), 2)
#     std_dev = round(np.std(predictions_percent), 2)
#     min_risk = round(np.min(predictions_percent), 2)
#     max_risk = round(np.max(predictions_percent), 2)
    
#     # Confidence score (R2 score or other metrics)
#     confidence_score = abs(round(r2_score(y_test_percent, predictions_percent) * 100, 2))
    
#     # Include cross-validation scores in output for better insights
#     cv_mean = np.mean(cv_scores)  # Mean of CV scores
#     cv_std = np.std(cv_scores)    # Standard deviation of CV scores
    
#     # Format output
#     return {
#         "Model": model_name,
#         "Mean Dropout Risk": f"{mean_risk}%",
#         "Std Deviation": f"{std_dev}",
#         "Min Dropout Risk": f"{min_risk}%",
#         "Max Dropout Risk": f"{max_risk}%",
#         "Confidence Score": f"{confidence_score} / 100",
#         "CV Mean Score": f"{cv_mean:.2f}",
#         "CV Std Deviation": f"{cv_std:.2f}"
#     }



#-----------------------------------

# Mapping for categorical target
DROPOUT_MAPPING = {
    "Low": 0.2,    # 20%
    "Medium": 0.5, # 50%
    "High": 0.8    # 80%
}

FEATURE_COLS = [
    "gpa",
    "hours_studied_per_week",
    "previous_failures",
    "attendance_percentage",
    "quizzes_completed",
    "assignments_completed",
    "lms_engagement_score"
]

# Enhanced train_and_predict function
def train_and_predict(df: pd.DataFrame, model_name: str):
    # Check required columns
    missing_cols = [col for col in FEATURE_COLS if col not in df.columns]
    if missing_cols:
        raise HTTPException(status_code=400, detail=f"Missing columns: {missing_cols}")
    if "dropout_risk" not in df.columns:
        raise HTTPException(status_code=400, detail="Dataset must contain 'dropout_risk' column.")
    
    # Handle missing values with imputation
    imputer = SimpleImputer(strategy='mean')  # You can also try 'median' or other strategies
    df[FEATURE_COLS] = imputer.fit_transform(df[FEATURE_COLS])
    
    # Encode categorical features if they exist in the dataframe
    for col in FEATURE_COLS:
        if df[col].dtype == object:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))
    
    # Encode target values (dropout risk)
    if df["dropout_risk"].dtype == object:
        df["dropout_risk"] = df["dropout_risk"].map(DROPOUT_MAPPING)
        if df["dropout_risk"].isnull().any():
            raise HTTPException(status_code=400, detail="Invalid value in 'dropout_risk'. Must be Low/Medium/High.")

    # Features & Target
    X = df[FEATURE_COLS]
    y = df["dropout_risk"]
    
    # Split the data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Feature Scaling (Standardization) for better model performance
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Check if model_name is valid
    if model_name not in MODELS:
        raise HTTPException(status_code=400, detail="Invalid model name selected.")
    
    # Select model
    model = MODELS[model_name]
    
    # Train the model
    model.fit(X_train_scaled, y_train)
    
    # Predictions
    predictions = model.predict(X_test_scaled)
    
    # Clip predictions to ensure values are within the range [0, 1]
    predictions = np.clip(predictions, 0, 1)
    
    # Convert to percentage
    predictions_percent = predictions * 100
    y_test_percent = y_test * 100
    
    # Stats for the current model
    mean_risk = round(np.mean(predictions_percent), 2)
    std_dev = round(np.std(predictions_percent), 2)
    min_risk = round(np.min(predictions_percent), 2)
    max_risk = round(np.max(predictions_percent), 2)
    
    # Confidence score (R2 score or other metrics)
    confidence_score = abs(round(r2_score(y_test_percent, predictions_percent) * 100, 2))
    
    # Overall dataset accuracy (Mean Absolute Error)
    mae = mean_absolute_error(y_test_percent, predictions_percent)
    
    # Calculate overall accuracy of the dataset (percentage-based)
    overall_accuracy = 100 - mae  # Lower MAE means higher accuracy, so we subtract it from 100
    
    # Format output
    return {
        "Model": model_name,
        "Mean Dropout Risk": f"{mean_risk:.2f}%",
        "Std Deviation": f"{std_dev:.2f}",
        "Min Dropout Risk": f"{min_risk:.2f}%",
        "Max Dropout Risk": f"{max_risk:.2f}%",
        "Confidence Score": f"{confidence_score} / 100",
        "Overall Dataset Accuracy": f"{overall_accuracy:.2f}%"  # Show overall accuracy of predictions
    }




#--------------------all dataset accuracy---------------------


# Define models for both regression and classification
REGRESSION_MODELS = {
    "Linear Regression": LinearRegression(),
    "Random Forest Regressor": RandomForestRegressor(n_estimators=100, random_state=42),
    "Gradient Boosting Regressor": GradientBoostingRegressor(n_estimators=100, random_state=42),
    "XGBoost Regressor": XGBRegressor(n_estimators=100, random_state=42)
}

CLASSIFICATION_MODELS = {
    "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
    "Random Forest Classifier": RandomForestClassifier(n_estimators=100, random_state=42),
    "Gradient Boosting Classifier": GradientBoostingClassifier(n_estimators=100, random_state=42),
    "XGBoost Classifier": XGBClassifier(n_estimators=100, random_state=42, eval_metric='logloss')
}

def detect_task_type(y):
    """Detect if the task is regression or classification"""
    unique_values = y.nunique()
    # If less than 10 unique values or if values are strings, consider it classification
    if unique_values < 10 or y.dtype == 'object':
        return 'classification'
    else:
        return 'regression'

def preprocess_data(df):
    """Preprocess the dataset"""
    # Separate numeric and categorical columns
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
    
    # Handle missing values
    if numeric_cols:
        numeric_imputer = SimpleImputer(strategy='mean')
        df[numeric_cols] = numeric_imputer.fit_transform(df[numeric_cols])
    
    if categorical_cols:
        categorical_imputer = SimpleImputer(strategy='most_frequent')
        df[categorical_cols] = categorical_imputer.fit_transform(df[categorical_cols])
    
    # Encode categorical variables
    label_encoders = {}
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        label_encoders[col] = le
    
    return df, label_encoders

def analyze_dataset(df: pd.DataFrame, model_name: str, target_column: str = None):
    """
    Analyze any dataset with the specified model
    """
    try:
        # If no target column specified, use the last column
        if target_column is None:
            target_column = df.columns[-1]
        
        if target_column not in df.columns:
            raise HTTPException(status_code=400, detail=f"Target column '{target_column}' not found in dataset")
        
        # Preprocess the data
        df, label_encoders = preprocess_data(df)
        
        # Separate features and target
        X = df.drop(columns=[target_column])
        y = df[target_column]
        
        # Detect task type
        task_type = detect_task_type(y)
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Select appropriate model
        if task_type == 'classification':
            if model_name not in CLASSIFICATION_MODELS:
                raise HTTPException(status_code=400, detail=f"Model '{model_name}' not available for classification")
            model = CLASSIFICATION_MODELS[model_name]
        else:
            if model_name not in REGRESSION_MODELS:
                raise HTTPException(status_code=400, detail=f"Model '{model_name}' not available for regression")
            model = REGRESSION_MODELS[model_name]
        
        # Train the model
        model.fit(X_train_scaled, y_train)
        
        # Make predictions
        y_pred = model.predict(X_test_scaled)
        
        # Calculate metrics based on task type
        results = {
            "model_name": model_name,
            "task_type": task_type,
            "target_column": target_column,
            "total_samples": len(df),
            "training_samples": len(X_train),
            "test_samples": len(X_test),
            "features_used": X.columns.tolist(),
            "number_of_features": len(X.columns)
        }
        
        if task_type == 'classification':
            # Classification metrics
            accuracy = accuracy_score(y_test, y_pred)
            
            # Get classification report as dict
            class_report = classification_report(y_test, y_pred, output_dict=True)
            
            results.update({
                "accuracy_score": f"{accuracy * 100:.2f}%",
                "classification_report": class_report,
                "unique_classes": int(y.nunique()),
                "class_distribution": y.value_counts().to_dict()
            })
            
        else:
            # Regression metrics
            r2 = r2_score(y_test, y_pred)
            mae = mean_absolute_error(y_test, y_pred)
            mse = mean_squared_error(y_test, y_pred)
            rmse = np.sqrt(mse)
            
            results.update({
                "r2_score": f"{r2:.4f}",
                "mean_absolute_error": f"{mae:.4f}",
                "mean_squared_error": f"{mse:.4f}",
                "root_mean_squared_error": f"{rmse:.4f}",
                "mean_prediction": f"{np.mean(y_pred):.4f}",
                "std_prediction": f"{np.std(y_pred):.4f}",
                "min_prediction": f"{np.min(y_pred):.4f}",
                "max_prediction": f"{np.max(y_pred):.4f}"
            })
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing dataset: {str(e)}")

def get_all_models_comparison(df: pd.DataFrame, target_column: str = None):
    """
    Compare all available models on the dataset
    """
    # If no target column specified, use the last column
    if target_column is None:
        target_column = df.columns[-1]
    
    # Preprocess once
    df_processed, _ = preprocess_data(df.copy())
    
    # Detect task type
    y = df_processed[target_column]
    task_type = detect_task_type(y)
    
    # Get appropriate models
    models = CLASSIFICATION_MODELS if task_type == 'classification' else REGRESSION_MODELS
    
    comparison_results = {
        "task_type": task_type,
        "target_column": target_column,
        "models_comparison": []
    }
    
    for model_name in models:
        try:
            result = analyze_dataset(df.copy(), model_name, target_column)
            
            # Extract key metrics for comparison
            if task_type == 'classification':
                summary = {
                    "model": model_name,
                    "accuracy": result["accuracy_score"],
                    "precision": result["classification_report"]["weighted avg"]["precision"],
                    "recall": result["classification_report"]["weighted avg"]["recall"],
                    "f1_score": result["classification_report"]["weighted avg"]["f1-score"]
                }
            else:
                summary = {
                    "model": model_name,
                    "r2_score": result["r2_score"],
                    "mae": result["mean_absolute_error"],
                    "rmse": result["root_mean_squared_error"]
                }
            
            comparison_results["models_comparison"].append(summary)
            
        except Exception as e:
            comparison_results["models_comparison"].append({
                "model": model_name,
                "error": str(e)
            })
    
    return comparison_results