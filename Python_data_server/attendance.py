import pandas as pd
import numpy as np
from pyspark.sql import DataFrame
from pyspark.sql.functions import col, avg, count, date_format, sum as _sum, to_date, lag, datediff, when, lit, first
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.feature_selection import SelectKBest, f_classif
# from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.metrics import accuracy_score, classification_report
from typing import Dict, List, Tuple, Optional
from sklearn.preprocessing import StandardScaler
from datetime import datetime
import joblib

def filter_date_range(df: DataFrame, start_date: Optional[str] = None, end_date: Optional[str] = None) -> DataFrame:
    filtered_df = df
    if start_date:
        filtered_df = filtered_df.filter(col("date") >= start_date)
    if end_date:
        filtered_df = filtered_df.filter(col("date") <= end_date)
    return filtered_df

def get_all_attendance(spark_df: DataFrame):
    return [row.asDict() for row in spark_df.collect()]

def get_attendance_by_course(spark_df: DataFrame, course_id: str):
    filtered_df = spark_df.filter(col("course_id") == course_id)
    return [row.asDict() for row in filtered_df.collect()]


#http://localhost:3001/attendance_status
def generate_attendance_table(attendance_data: pd.DataFrame) -> List[Dict]:
    required_cols = {"student_id", "Name", "course", "attendance_status", "timestamp"}
    missing = required_cols - set(attendance_data.columns)
    if missing:
        raise ValueError(f"Missing columns in data: {missing}")

    formatted = []
    for idx, row in attendance_data.iterrows():
        raw_timestamp = row["timestamp"]
        formatted_time = (
            pd.to_datetime(raw_timestamp).strftime("%I:%M %p")
            if pd.notnull(raw_timestamp) else "N/A"
        )

        formatted.append({
            "id": f"rec-{idx}",  # unique id
            "student_id": row["student_id"],
            "student_name": row["Name"],
            "course": row["course"],
            "status": row["attendance_status"],
            "time": formatted_time
        })

    return formatted



def get_attendance_by_student(spark_df: DataFrame, student_id: str, course_id: str, limits: str):
    filtered_df = spark_df.filter((col("student_id") == student_id) & (col("course_id") == course_id))
    sorted_df = filtered_df.orderBy(col("date").desc()).limit(int(limits))
    return [row.asDict() for row in sorted_df.collect()]

def get_attendance_analytics(spark_df: DataFrame):
    analytics_df = spark_df.groupBy("course_id").agg(avg("attendance_percentage").alias("average_attendance"))
    return [row.asDict() for row in analytics_df.collect()]

def perform_random_forest_regression(attendance_data: pd.DataFrame):
    attendance_data["date"] = pd.to_datetime(attendance_data["date"])
    attendance_data["date_numeric"] = attendance_data["date"].apply(lambda x: x.toordinal())

    X = attendance_data[["date_numeric"]].values
    Y = attendance_data["attendance_percentage"].values

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, Y)

    predictions = model.predict(X)
    labels = attendance_data["date"].dt.strftime("%Y-%m-%d").tolist()
    data = predictions.tolist()

    return labels, data

##This function is used for Student detail to fetch student record

def calculate_attendance_statistics(spark_df: DataFrame) -> Dict[str, Dict]:
    overall_stats = spark_df.agg(
        avg("attendance_percentage").alias("avg_attendance"),
        (count(when(col("attendance_status") == "Present", 1)) * 100 / count("*")).alias("overall_presence_rate"),
        (count(when(col("attendance_status") == "Late", 1)) * 100 / count("*")).alias("overall_late_rate"),
        (count(when(col("attendance_status") == "Absent", 1)) * 100 / count("*")).alias("overall_absence_rate")
    ).toPandas().to_dict('records')[0]

    course_stats = spark_df.groupBy("batch_id").agg(
        avg("attendance_percentage").alias("avg_attendance"),
        count("*").alias("total_sessions")
    ).toPandas().to_dict('records')

    student_stats = spark_df.groupBy("student_id").agg(
    first("name").alias("name"),
    avg("attendance_percentage").alias("avg_attendance"),
    _sum(when(col("attendance_status") == "Present", 1).otherwise(0)).alias("present_count"),
    _sum(when(col("attendance_status") == "Late", 1).otherwise(0)).alias("late_count"),
    _sum(when(col("attendance_status") == "Absent", 1).otherwise(0)).alias("absent_count")
)
# ✅ Remove rows where all counts are 0
    filtered_stats_df = student_stats.filter(
    (col("present_count") > 0) | (col("late_count") > 0) | (col("absent_count") > 0)
)
    # ✅ Convert to Pandas + dict
    student_stats = filtered_stats_df.toPandas().to_dict("records")

    return {
        "overall": {k: round(float(v), 2) if isinstance(v, (float, np.float64)) else v for k, v in overall_stats.items()},
        "course_wise": course_stats,
        "student_wise": student_stats
    }


def calculate_course_performance_metrics(spark_df: DataFrame, selected_batch: str = None) -> Dict[str, List]:
    # Filter early if batch is provided
    if selected_batch and selected_batch.lower() != "select batch":
        spark_df = spark_df.filter(col("batch_id") == selected_batch)

    metrics_df = (
        spark_df.groupBy("batch_id", "course", "month")
        .agg(
            avg("quizzes_completed").alias("avg_quizzes"),
            avg("attendance_percentage").alias("avg_attendance"),
            avg("assignments_completed").alias("avg_assignment"),
            count("*").alias("total_students"),
            count(when(col("attendance_status") == "Present", 1)).alias("present_count"),
            count(when(col("attendance_status") == "Late", 1)).alias("late_count"),
            count(when(col("attendance_status") == "Absent", 1)).alias("absent_count"),
            (count(when(col("attendance_status") == "Present", 1)) * 100.0 / count("*")).alias("presence_rate"),
            (count(when(col("attendance_status") == "Late", 1)) * 100.0 / count("*")).alias("late_rate"),
            (count(when(col("attendance_status") == "Absent", 1)) * 100.0 / count("*")).alias("absence_rate"),
        )
        .orderBy("batch_id", "month", "course")
    )

    collected_rows = metrics_df.collect()
    unique_courses = {row["course"] for row in collected_rows}

    result = {
        "course_ids": list(unique_courses),
        "metrics": [
            {
                "batch": row["batch_id"],
                "course": row["course"],
                "month": row["month"],
                "avg_attendance": round(row["avg_attendance"], 2) if row["avg_attendance"] else 0.0,
                "avg_quizzes": int(row["avg_quizzes"]) if row["avg_quizzes"] else 0,
                "avg_assignment": int(row["avg_assignment"]) if row["avg_assignment"] else 0,
                "total_students": row["total_students"],
                "present_count": row["present_count"],
                "late_count": row["late_count"],
                "absent_count": row["absent_count"],
                "presence_rate": round(row["presence_rate"], 2),
                "late_rate": round(row["late_rate"], 2),
                "absence_rate": round(row["absence_rate"], 2),
                "total_courses": len(unique_courses)
            }
            for row in collected_rows
        ]
    }

    # ✅ Save result as .pkl (like model.pkl)
    # joblib.dump(result, "metrics.pkl")
    # print("Metrics saved as metrics.pkl")

    return result




    
   


def generate_attendance_heatmap_data(spark_df: DataFrame) -> Dict[str, List]:
    # ✅ Correct date format for single-digit month/day handling
    df_with_date = spark_df.withColumn("parsed_date", to_date(col("date"), "M/d/yyyy"))

    # ✅ Now safely extract day-of-week
    heatmap_data = df_with_date.select(
        date_format("parsed_date", "E").alias("day_of_week"),
        col("course_id"),
        col("attendance_status")
    ).groupBy("day_of_week", "course_id").agg(
        (count(when(col("attendance_status") == "Present", True)) * 100 / count("*")).alias("attendance_rate")
    ).toPandas()

    # ✅ Pivot for heatmap format
    pivot_data = heatmap_data.pivot(
        index="day_of_week",
        columns="course_id",
        values="attendance_rate"
    ).round(2)

    return {
        "days": pivot_data.index.tolist(),
        "courses": pivot_data.columns.tolist(),
        "values": pivot_data.values.tolist()
    }


# attendance_trend admin dasboard
def perform_attendance_trend_analysis(attendance_data: pd.DataFrame, limit: Optional[str] = None) -> Dict[str, List]:
    # Ensure month is string (e.g., "2025-01" or "Jan-2025")
    attendance_data["month"] = attendance_data["month"].astype(str)

    # Group by month and calculate mean attendance
    grouped_data = attendance_data.groupby("month").agg({"attendance_percentage": "mean"}).reset_index()

    # Apply limit if given
    if limit:
        grouped_data = grouped_data.head(int(limit))

    # Create numeric index for months (1, 2, 3, ...)
    grouped_data["month_numeric"] = range(1, len(grouped_data) + 1)

    X = grouped_data[["month_numeric"]].values
    Y = grouped_data["attendance_percentage"].values

    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, Y)
    predictions = model.predict(X)

    return {
        "labels": grouped_data["month"].tolist(),
        "actual": grouped_data["attendance_percentage"].tolist(),
        "predicted": predictions.tolist(),
        "trend_slope": None,
        "trend_intercept": None
    }



# Prediction Overview Summary of dropout risk  Admin
def train_rf_model_and_get_dropout_summary(spark_df):
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

    # Convert Spark DataFrame to Pandas
    pandas_df = spark_df.select("student_id", *feature_cols, "dropout_risk").toPandas()
    pandas_df.dropna(subset=["student_id"] + feature_cols + ["dropout_risk"], inplace=True)

    risk_map = {"Low": 0, "Medium": 1, "High": 2}
    inverse_risk_map = {v: k for k, v in risk_map.items()}
    pandas_df["dropout_risk_encoded"] = pandas_df["dropout_risk"].map(risk_map)

    X = pandas_df[feature_cols]
    y = pandas_df["dropout_risk_encoded"]

    # Split train-test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Standardize features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train Gradient Boosting Classifier
    gb_model = GradientBoostingClassifier(random_state=42)
    gb_model.fit(X_train_scaled, y_train)

    # Predict on test
    y_pred = gb_model.predict(X_test_scaled)

    # Metrics
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Gradient Boosting Dropout Risk Prediction Accuracy: {accuracy * 100:.2f}%")
    print("Classification Report:")
    print(classification_report(y_test, y_pred, target_names=risk_map.keys(), digits=2))

    # Map back predicted labels
    risk_labels = [inverse_risk_map[p] for p in y_pred]
    student_ids_test = pandas_df.loc[X_test.index, "student_id"]

    result_df = pd.DataFrame({
        "student_id": student_ids_test.values,
        "predicted_dropout_risk": risk_labels
    })

    print(pandas_df['dropout_risk'].value_counts())

    summary_df = (
        result_df.groupby("predicted_dropout_risk")["student_id"]
        .nunique()
        .reset_index()
        .rename(columns={"student_id": "student_count"})
        .sort_values("predicted_dropout_risk")
    )

    return summary_df.to_dict(orient="records")




# same uper se
def train_rf_model_and_get_dropout_summary(spark_df: DataFrame):
    # Step 1: Define feature columns based on your dataset
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

    # Step 2: Convert Spark DataFrame to Pandas and select required columns
    pandas_df = spark_df.select("student_id", *feature_cols, "dropout_risk").toPandas()

    # Step 3: Drop missing values
    pandas_df.dropna(subset=["student_id"] + feature_cols + ["dropout_risk"], inplace=True)

    # Step 4: Encode categorical target into numbers
    risk_map = {"Low": 0, "Medium": 1, "High": 2}
    inverse_risk_map = {v: k for k, v in risk_map.items()}  # To convert back later
    pandas_df["dropout_risk_encoded"] = pandas_df["dropout_risk"].map(risk_map)

    # Step 5: Split data into train/test sets
    X = pandas_df[feature_cols]
    y = pandas_df["dropout_risk_encoded"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Step 6: Train classifier
    rf_model = RandomForestClassifier(random_state=42)
    rf_model.fit(X_train, y_train)

    # Step 7: Predict on test set
    y_pred = rf_model.predict(X_test)

    # --- New: Calculate and print accuracy and classification report ---
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Random Forest Dropout Risk Prediction Accuracy: {accuracy * 100:.2f}%")
    print("Classification Report:")
    print(classification_report(y_test, y_pred, target_names=risk_map.keys(), digits=2))

    # Step 8: Map predictions back to "Low", "Medium", "High"
    risk_labels = [inverse_risk_map[pred] for pred in y_pred]

    # Step 9: Get corresponding student IDs from test set
    student_ids_test = pandas_df.loc[X_test.index, "student_id"]

    # Step 10: Create summary DataFrame
    result_df = pd.DataFrame({
        "student_id": student_ids_test.values,
        "predicted_dropout_risk": risk_labels
    })
    print(pandas_df['dropout_risk'].value_counts())

    summary_df = (
        result_df.groupby("predicted_dropout_risk")["student_id"]
        .nunique()
        .reset_index()
        .rename(columns={"student_id": "student_count"})
        .sort_values("predicted_dropout_risk")
    )

    # Step 11: Return result as list of dicts
    return summary_df.to_dict(orient="records")


# def calculate_dropout_risk_per_student(spark_df):
#     feature_cols = [
#         "gpa", "hours_studied_per_week",
#         "previous_failures", "attendance_percentage",
#         "quizzes_completed", "assignments_completed", "lms_engagement_score"
#     ]

#     # Drop rows with missing values
#     spark_df = spark_df.dropna(subset=["student_id", "Name", "dropout_risk"] + feature_cols)

#     # Convert to Pandas
#     pandas_df = spark_df.toPandas().reset_index(drop=True)

#     # Label Encoding
#     risk_map = {"Low": 0, "Medium": 1, "High": 2}
#     inverse_risk_map = {0: "Low", 1: "Medium", 2: "High"}
#     pandas_df["dropout_risk_encoded"] = pandas_df["dropout_risk"].map(risk_map)

#     # Feature Scaling
#     scaler = MinMaxScaler()
#     X_scaled = scaler.fit_transform(pandas_df[feature_cols])
#     X = pd.DataFrame(X_scaled, columns=feature_cols)
#     y = pandas_df["dropout_risk_encoded"]

#     # Train-test split
#     X_train, X_test, y_train, y_test = train_test_split(
#         X, y, test_size=0.2, random_state=42
#     )

#     # Model training
#     model = RandomForestClassifier(random_state=42, class_weight='balanced')
#     model.fit(X_train, y_train)

#     # Evaluation
#     y_pred = model.predict(X_test)
#     acc = accuracy_score(y_test, y_pred)
#     report = classification_report(y_test, y_pred, target_names=["Low", "Medium", "High"])
#     print("✅ Dropout Risk Prediction Accuracy:", round(acc * 100, 2), "%")
#     print("📊 Detailed Classification Report:\n", report)

#     # Predict all records
#     all_preds = model.predict(X)
#     all_probs = model.predict_proba(X)  # shape: (n_samples, n_classes)

#     student_risks = []
#     for idx, row in pandas_df.iterrows():
#         pred_class = all_preds[idx]
#         pred_prob = max(all_probs[idx])  # highest class probability as confidence
#         normalized_score = round(pred_prob * 100, 2)  # confidence score out of 100

#         attendance = round(row["attendance_percentage"], 2)  # attendance

#         student_data = {
#             "student_id": row["student_id"],
#             "name": row["Name"],
#             "Course": row.get("preferred_course", "N/A"),
#             "normalized_profile_score": normalized_score,  # Now from model confidence
#             "attendance": attendance,
#             "risk_level": inverse_risk_map[pred_class]
#         }
#         student_risks.append(student_data)

#     return sorted(student_risks, key=lambda x: x["student_id"])



# def calculate_dropout_risk_per_student(spark_df: DataFrame):
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

#     # Step 1: Convert Spark DataFrame to Pandas
#     pandas_df = spark_df.select(
#         "student_id", "Name", "preferred_course", "dropout_risk", *feature_cols
#     ).toPandas()
#     pandas_df.dropna(subset=["student_id", "Name", "dropout_risk"] + feature_cols, inplace=True)
#     pandas_df = pandas_df.reset_index(drop=True)

#     # Step 2: Normalize features (0-1 scale)
#     norm_df = pandas_df.copy()
#     for col in feature_cols:
#         if col == "previous_failures":
#             norm_df[col] = 1 - (norm_df[col] - norm_df[col].min()) / (norm_df[col].max() - norm_df[col].min())
#         else:
#             norm_df[col] = (norm_df[col] - norm_df[col].min()) / (norm_df[col].max() - norm_df[col].min())

#     # Step 3: Calculate average score
#     norm_df['average_score'] = norm_df[feature_cols].mean(axis=1)

#     # Step 4: Assign dropout risk (Dynamic with Medium value too)
#     student_risks = []
#     y_true = []  # ground truth
#     y_pred = []  # predicted

#     for idx, row in norm_df.iterrows():
#         avg = row['average_score']
#         attendance = row['attendance_percentage']

#         if avg >= 0.75:
#             risk = {
#                 "Low": round(avg * 100, 2),
#                 "Medium": round((1 - avg) * 50, 2),
#                 "High": round((1 - avg) * 50, 2)
#             }
#         elif avg >= 0.45:
#             risk = {
#                 "Low": round(avg * 60, 2),
#                 "Medium": round((1 - abs(0.5 - avg)) * 100 * 0.6, 2),
#                 "High": round((1 - avg) * 40, 2)
#             }
#         else:
#             risk = {
#                 "Low": round(avg * 40, 2),
#                 "Medium": round(avg * 20, 2),
#                 "High": round((1 - avg) * 100, 2)
#             }

#         # Fix rounding to make sum = 100
#         total = sum(risk.values())
#         if total != 100.0:
#             diff = round(100.0 - total, 2)
#             risk["Medium"] = round(risk["Medium"] + diff, 2)

#         # Determine max risk
#         risk_level = max(risk, key=risk.get)

#         # Collect true and predicted
#         y_true.append(pandas_df.loc[idx, "dropout_risk"])
#         y_pred.append(risk_level)

#         student_data = {
#             "student_id": pandas_df.loc[idx, "student_id"],
#             "name": pandas_df.loc[idx, "Name"],
#             "Course": pandas_df.loc[idx, "preferred_course"],
#             "average_score": round(avg * 100, 2),
#             "attendance": round(attendance * 100, 2),
#             "estimated_dropout_risk_percentage": risk,
#             "risk_level": risk_level
#         }
#         student_risks.append(student_data)

#     # 🔥 Print accuracy
#     accuracy = accuracy_score(y_true, y_pred)
#     report = classification_report(y_true, y_pred, digits=2)

#     print("Dropout Risk Prediction Accuracy:", round(accuracy * 100, 2), "%")
#     print("Detailed Classification Report:\n", report)

#     return sorted(student_risks, key=lambda x: x["student_id"])



#  Individual student dropout risk predictions. Admin
def calculate_dropout_risk_per_student(spark_df: DataFrame):
    feature_cols = [
        "gpa",
        "hours_studied_per_week",
        "previous_failures",
        "attendance_percentage",
        "quizzes_completed",
        "assignments_completed",
        "lms_engagement_score"
    ]

    # Month order mapping to keep chronological order
    month_order = {
        "January": 1, "February": 2, "March": 3,
        "April": 4, "May": 5, "June": 6,
        "July": 7, "August": 8, "September": 9,
        "October": 10, "November": 11, "December": 12
    }
    batch_order = {
        "B001": 1, "B002": 2, "B003": 3,
        "B004": 4, "B005": 5, "B006": 6,
        "B007": 7, "B008": 8, "B009": 9,
        "B010": 10, "B011": 11
    }


    pandas_df = spark_df.select(
        "student_id", "month","batch_id", "Name", "course", "teacher_name", "dropout_risk", *feature_cols
    ).toPandas()

    pandas_df.dropna(
        subset=["student_id", "month","batch_id", "Name", "teacher_name", "dropout_risk"] + feature_cols,
        inplace=True
    )
    pandas_df = pandas_df.reset_index(drop=True)

    # Add numeric month for sorting
    pandas_df["month_num"] = pandas_df["month"].map(month_order)
    pandas_df["batch_num"] = pandas_df["batch_id"].map(batch_order)

    # Sort by student → month order
    pandas_df = pandas_df.sort_values(by=["batch_num", "student_id", "month_num"]).reset_index(drop=True)


    # Encode labels
    label_map = {"Low": 0, "Medium": 1, "High": 2}
    pandas_df["risk_label"] = pandas_df["dropout_risk"].map(label_map)

    X = pandas_df[feature_cols]
    y = pandas_df["risk_label"]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )

    model = GradientBoostingClassifier(
        n_estimators=150, learning_rate=0.1, max_depth=4, random_state=42
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_scaled)
    y_pred_labels = [list(label_map.keys())[list(label_map.values()).index(pred)] for pred in y_pred]

    # Threshold rules
    thresholds = {
        "Low": {
            "gpa": 2.5,
            "attendance_percentage": 60,
            "lms_engagement_score": 70,
            "assignments_completed": 10,
            "quizzes_completed": 5
        },
        "Medium": {
            "gpa": 1.8,
            "attendance_percentage": 50,
            "lms_engagement_score": 50,
            "assignments_completed": 7,
            "quizzes_completed": 3
        },
        "High": {
            "gpa": 0,
            "attendance_percentage": 0,
            "lms_engagement_score": 0,
            "assignments_completed": 0,
            "quizzes_completed": 0
        }
    }
    limited_df = pandas_df.groupby("course").head(10).reset_index(drop=True)
    student_risks = []

    for idx, row in limited_df.iterrows():
        predicted_risk = y_pred_labels[idx]

        # Function to check if row meets thresholds
        def check_consistency(risk_level):
            t = thresholds[risk_level]
            return not (
                row["gpa"] < t["gpa"] or
                row["attendance_percentage"] < t["attendance_percentage"] or
                row["lms_engagement_score"] < t["lms_engagement_score"] or
                row["assignments_completed"] < t["assignments_completed"] or
                row["quizzes_completed"] < t["quizzes_completed"]
            )

        # Adjust prediction if thresholds don't match
        if not check_consistency(predicted_risk):
            if predicted_risk == "Low":
                if row["gpa"] < thresholds["Medium"]["gpa"] or row["attendance_percentage"] < thresholds["Medium"]["attendance_percentage"]:
                    predicted_risk = "High"
                else:
                    predicted_risk = "Medium"
            elif predicted_risk == "Medium":
                if row["gpa"] < thresholds["High"]["gpa"] or row["attendance_percentage"] < thresholds["High"]["attendance_percentage"]:
                    predicted_risk = "High"
                elif check_consistency("Low"):
                    predicted_risk = "Low"
            elif predicted_risk == "High":
                if check_consistency("Medium"):
                    predicted_risk = "Medium"
                if check_consistency("Low"):
                    predicted_risk = "Low"

        # Risk reason
        reasons = []
        if row['attendance_percentage'] < 50:
            reasons.append("Low attendance")
        if row['gpa'] < 2:
            reasons.append("Low GPA")
        if row['lms_engagement_score'] < 60:
            reasons.append("Low LMS activity")
        if row['assignments_completed'] < 10:
            reasons.append("Incomplete assignments")
        if row['quizzes_completed'] < 5:
            reasons.append("Low quiz participation")

        student_data = {
            "student_id": row["student_id"],
            "Month": row["month"],
            "Batch": row["batch_id"],
            "name": row["Name"],
            "Course": row["course"],
            "teacher_name": row["teacher_name"],
            "attendance": f"{round(row['attendance_percentage'], 2)}%",
            "gpa": round(row["gpa"], 2),
            "assignments_completed": int(row["assignments_completed"]),
            "quizzes_completed": int(row["quizzes_completed"]),
            "lms_engagement_score": round(row["lms_engagement_score"], 1),
            "previous_failures": int(row["previous_failures"]),
            "risk_level": predicted_risk,
            "risk_reason": ", ".join(reasons) if reasons else "No major issues",
        }
        student_risks.append(student_data)

    acc = accuracy_score(y, y_pred)
    print(f"🎯 Dropout Risk Prediction Accuracy: {round(acc * 100, 2)}%")
    print("📊 Classification Report:\n", classification_report(y, y_pred, target_names=label_map.keys()))

    return student_risks



def train_rf_model_and_get_student_probabilities(spark_df):
    feature_cols = [
       
        "gpa",
        "hours_studied_per_week",
        "previous_failures",
        "attendance_percentage",
        "quizzes_completed",
        "assignments_completed",
        "lms_engagement_score"
    ]

    # Load Spark DataFrame and convert to Pandas
    pandas_df = spark_df.select("student_id", "Name", *feature_cols, "predicted_performance").toPandas()

    # Clean and encode
    pandas_df["predicted_performance"] = pandas_df["predicted_performance"].replace({
        "Low": "Below Average",
        "Medium": "Average",
        "High": "Excellent"
    })

    pandas_df.dropna(subset=["student_id", "Name"] + feature_cols + ["predicted_performance"], inplace=True)

    performance_map = {
        "Below Average": 0,
        "Average": 1,
        "Above Average": 2,
        "Excellent": 3
    }
    class_names = ["Below Average", "Average", "Above Average", "Excellent"]
    pandas_df["performance_encoded"] = pandas_df["predicted_performance"].map(performance_map)

    X = pandas_df[feature_cols]
    y = pandas_df["performance_encoded"]

    # Train-Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    test_indices = y_test.index

    # --- 🔧 PREPROCESSING ---

    # 1. Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 2. Feature Selection (keep best features)
    selector = SelectKBest(score_func=f_classif, k='all')  # try 'k=5' for top 5
    X_train_selected = selector.fit_transform(X_train_scaled, y_train)
    X_test_selected = selector.transform(X_test_scaled)

    # --- 🌲 Train Tuned Random Forest Model ---
    model = RandomForestClassifier(
        n_estimators=100,            # More trees = better performance
        max_depth=15,                # Controlled depth to prevent overfitting
        min_samples_split=5,         # Minimum split for internal nodes
        class_weight='balanced',
        random_state=42
    )

#     model = XGBClassifier(
#     n_estimators=300,
#     max_depth=10,
#     learning_rate=0.1,
#     subsample=0.8,
#     colsample_bytree=0.8,
#     random_state=42
#    )

    model.fit(X_train_selected, y_train)

    # --- 🔍 Predict ---
    y_pred = model.predict(X_test_selected)

    result_df = pd.DataFrame({
        "Student ID": pandas_df.loc[test_indices, "student_id"].values,
        "Name": pandas_df.loc[test_indices, "Name"].values,
        "Predicted_performance": [class_names[i] for i in y_pred]
    })

    # 📊 Accuracy Report
    accuracy = accuracy_score(y_test, y_pred)
    print(f"✅ Test Accuracy: {accuracy:.2%}\n")
    print("📋 Classification Report:")
    print(classification_report(y_test, y_pred, target_names=class_names))

    return result_df.to_dict(orient="records")



# student performance summary
def train_rf_model_and_get_performance_summary(spark_df):
    # Step 1: Feature columns
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

    # Step 2: Convert Spark to Pandas
    pandas_df = spark_df.select("student_id", *feature_cols, "predicted_performance").toPandas()

    # Step 3: Map old labels
    pandas_df["predicted_performance"] = pandas_df["predicted_performance"].replace({
        "Low": "Below Average",
        "Medium": "Average",
        "High": "Excellent"
    })

    # Step 4: Drop rows with missing values
    pandas_df.dropna(subset=["student_id"] + feature_cols + ["predicted_performance"], inplace=True)

    # Step 5: Encode labels
    performance_map = {
        "Below Average": 0,
        "Average": 1,
        "Above Average": 2,
        "Excellent": 3
    }
    inverse_perf_map = {v: k for k, v in performance_map.items()}
    pandas_df["performance_encoded"] = pandas_df["predicted_performance"].map(performance_map)

    # Step 6: Prepare X and y
    X = pandas_df[feature_cols]
    y = pandas_df["performance_encoded"]

    # Step 7: Train model on full dataset
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    # Step 8: Predict on full dataset
    y_pred = model.predict(X)
    predicted_labels = [inverse_perf_map[val] for val in y_pred]
    pandas_df["predicted_performance_label"] = predicted_labels

    # Step 9: Group and count predicted labels
    summary_df = (
        pandas_df.groupby("predicted_performance_label")["student_id"]
        .count()
        .reset_index()
        .rename(columns={"student_id": "student_count", "predicted_performance_label": "predicted_performance"})
        .sort_values("predicted_performance")
    )

    # Step 10: Add percentage column
    total_students = summary_df["student_count"].sum()
    summary_df["percentage"] = (summary_df["student_count"] / total_students * 100).round(2)

    # Accuracy score and classification report
    acc = accuracy_score(y, y_pred)
    report = classification_report(y, y_pred, target_names=[inverse_perf_map[i] for i in sorted(inverse_perf_map.keys())])

    # Print accuracy and classification report to terminal
    print("Accuracy Score:", acc)
    print("Classification Report:\n", report)

    return summary_df.to_dict(orient="records")