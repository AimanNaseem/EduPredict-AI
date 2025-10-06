from pyspark.sql.functions import col, avg, count, when, lit, round, sum as _sum,first
from pyspark.sql import DataFrame, SparkSession
from pyspark.sql import functions as F
from sklearn.linear_model import LinearRegression
from typing import Dict, Optional
import pandas as pd


def get_student_dashboard_data(pandas_df: pd.DataFrame, student_id: str):
    # Filter rows for the given student
    student_df = pandas_df[pandas_df["student_id"] == student_id]

    if student_df.empty:
        return {"error": f"No data found for student_id: {student_id}"}

    # ----- Attendance Stats -----
    avg_attendance = round(student_df["attendance_percentage"].astype(float).mean(), 2)
    total_present = (student_df["attendance_status"] == "Present").sum()
    total_late = (student_df["attendance_status"] == "Late").sum()
    total_absent = (student_df["attendance_status"] == "Absent").sum()

    # ----- LMS Stats -----
    total_lms_actions = student_df.shape[0]
    unique_courses_visited = student_df["course_id"].nunique()

    # ----- Demographic & Academic Info -----
    name = (
        student_df["Name"].dropna().iloc[0]
        if not student_df["Name"].dropna().empty
        else None
    )
    gpa = (
        round(float(student_df["gpa"].dropna().iloc[0]), 2)
        if not student_df["gpa"].dropna().empty
        else None
    )
    preferred_course = (
        student_df["course"].dropna().iloc[0]
        if not student_df["course"].dropna().empty
        else None
    )

    # ----- Final Combined Output -----
    return {
        "student_id": student_id,
        "name": name,
        "gpa": gpa,
        "preferred_course": preferred_course,
        "avg_attendance": avg_attendance,
        "total_present": int(total_present),
        "total_late": int(total_late),
        "total_absent": int(total_absent),
        "total_lms_actions": int(total_lms_actions),
        "unique_courses_visited": int(unique_courses_visited),
    }


def perform_attendance_trend_analysis_student(
    attendance_data: pd.DataFrame, student_id: str, limit: Optional[str] = None
) -> Dict[str, list]:

    attendance_data = attendance_data[attendance_data["student_id"] == student_id]

    # Ensure date is in datetime format
    attendance_data["date"] = pd.to_datetime(attendance_data["date"])

    # Group by dates and compute average attendance percentages for each date
    grouped_data = (
        attendance_data.groupby("date")
        .agg(
            {
                "attendance_percentage": "mean"  # Compute the average attendance percentage per date
            }
        )
        .reset_index()
    )

    # Apply limit if provided
    if limit:
        grouped_data = grouped_data.head(int(limit))

    # Convert dates to numeric format for regression
    grouped_data["date_numeric"] = grouped_data["date"].apply(lambda x: x.toordinal())

    # Prepare variables for regression
    X = grouped_data[["date_numeric"]].values
    Y = grouped_data["attendance_percentage"].values

    # Fit linear regression model
    model = LinearRegression()
    model.fit(X, Y)

    # Generate predictions
    predictions = model.predict(X)

    return {
        "labels": grouped_data["date"].dt.strftime("%Y-%m-%d").tolist(),
        "actual": grouped_data["attendance_percentage"].tolist(),
        "predicted": predictions.tolist(),
        "trend_slope": float(model.coef_[0]),
        "trend_intercept": float(model.intercept_),
    }


def get_course_avg(spark_df: DataFrame, student_id: str):
    # Filter data for the given student
    lms_stats = spark_df.filter(col("student_id") == student_id)

    # Calculate average LMS engagement per course
    avg_engagement_df = lms_stats.groupBy("course_id").agg(
        avg("lms_engagement_score").alias("avg_lms_engagement_score")
    )

    # Collect and format the result
    result = avg_engagement_df.collect()
    formatted_result = [
        {
            "course_id": row["course_id"],
            "avg_lms_engagement_score": round(row["avg_lms_engagement_score"], 2),
        }
        for row in result
    ]

    return formatted_result


def get_quiz_summary_by_course(df: DataFrame):
    """
    Returns batch/month/course-wise distinct quizzes completed.
    Uses countDistinct to avoid duplicates.
    """

    # 1️⃣ Remove exact duplicate rows (optional but safe)
    df_clean = df.dropDuplicates(["batch_id", "month", "course", "teacher_name", "quizzes_completed"])

    # 2️⃣ Group by batch and month, count distinct quizzes
    summary_df = (
        df_clean.groupBy("batch_id", "month")
        .agg(
            F.first("course").alias("course"),             # first course per batch
            F.first("teacher_name").alias("teacher_name"), # first teacher per batch
            F.countDistinct("quizzes_completed").alias("quizzes_completed")  # unique quizzes
        )
        .orderBy("batch_id", "month")
    )

    # 3️⃣ Convert to list of dictionaries
    result = [
        {
            "batch": row["batch_id"],
            "month": row["month"],
            "course_id": row["course"],
            "teacher_name": row["teacher_name"],
            "quizzes_completed": int(row["quizzes_completed"] or 0),
        }
        for row in summary_df.collect()
    ]

    return result


def get_assignment_by_course(df: DataFrame):
    # Group by course_id and sum quizzes_completed

    df_clean = df.dropDuplicates(["batch_id", "month", "course","assignments_completed"])
    summary_df = (
         df_clean.groupBy("batch_id", "month")
         .agg(
            F.first("course").alias("course"),  # ek hi course hoga batch me
            F.countDistinct("assignments_completed").alias("total_assignments_completed")
        )
        .orderBy("batch_id", "month")
    )
    # Step 3: Convert to list of dictionaries
    result = [
        {
            "batch": row["batch_id"],
            "month": row["month"],
            "course": row["course"],
            "total_assignments_completed": int(row["total_assignments_completed"] or 0),
        }
        for row in summary_df.collect()
    ]
    return result