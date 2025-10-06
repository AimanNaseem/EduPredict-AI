import io
import sys
from model_state import ModelState
from studentInput import StudentInput, predict_student_from_input, train_model_from_csv
import uvicorn
from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, Form, Header
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pyspark.sql import SparkSession, DataFrame
import pandas as pd
from contextlib import asynccontextmanager
from fastapi import Query
import joblib
import os
from typing import Optional
from teacher import analyze_dataset, get_all_models_comparison, REGRESSION_MODELS, CLASSIFICATION_MODELS
import jwt

# Custom analysis functions
from lms import (
    get_action_type_distribution,
    get_course_engagement_metrics,
    get_student_performance
)
from attendance import (


    calculate_dropout_risk_per_student,
    generate_attendance_table,
    get_all_attendance,
    get_attendance_by_course,
    get_attendance_by_student,
    get_attendance_analytics,
    perform_random_forest_regression,  # ✅ This uses RandomForest inside
    calculate_attendance_statistics,
    calculate_course_performance_metrics,
    generate_attendance_heatmap_data,
    perform_attendance_trend_analysis,
    train_rf_model_and_get_dropout_summary,
    train_rf_model_and_get_performance_summary,
    train_rf_model_and_get_student_probabilities,
   
)

from demographics import (
    get_demographic_summary,
    get_educational_insights,
    get_risk_analysis,
    get_overall_student_statistics
)
from student import(
    get_assignment_by_course,
    get_quiz_summary_by_course,
    get_student_dashboard_data,
    perform_attendance_trend_analysis_student,
    get_course_avg
)
from teacher import (
    
    get_academic_performance_metrics,
    get_course_overview,
    predict_course_demand_from_df,
    train_and_predict,
  
)

# ----------------- JWT Decode -----------------
SECRET_KEY = "your_jwt_secret"
ALGORITHM="HS256"

CACHE = {}

# Global Spark session and dataset references
spark: SparkSession = None
df: DataFrame = None
pandas_data: pd.DataFrame = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global spark, df, pandas_data
    try:
        print("Starting up Spark session...")
        spark = SparkSession.builder.appName("EduPredict Unified Server").getOrCreate()

        print("Loading unified dataset...")
        dataset_path = "datasets/all_batches.csv"
        df = spark.read.csv(dataset_path, header=True, inferSchema=True)
        pandas_data = df.toPandas()

        print("Dataset loaded successfully.")

         # ✅ Train model here
        # from studentInput import train_model_from_csv
        train_model_from_csv(df)  # This line is important!

        yield
    finally:
        if spark:
            print("Shutting down Spark session...")
            spark.stop()
            print("Spark session stopped.")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
   
    CORSMiddleware,    # website                # App
    allow_origins=["http://localhost:5173"], #"http://localhost:8081"],     #http://localhost:5174
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_spark_session():
    return spark

def get_spark_df():
    if df is None:
        raise HTTPException(status_code=503, detail="Dataset not initialized.")
    return df

def get_pandas_data():
    if pandas_data is None:
        raise HTTPException(status_code=503, detail="Dataset not initialized.")
    return pandas_data


@app.get("/")
def root():
    return {"message": "EduPredict Unified API is running"}


# New endpoint for API info
@app.get("/api-info")
async def api_info():
    return {
        "message": "ML Model Analysis API",
        "endpoints": {
            "/": "API status",
            "/api-info": "API documentation",
            "/analyze_data": "Analyze dataset with specific model",
            "/compare_all_models": "Compare all models on dataset",
            "/available_models": "Get list of available models"
        }
    }

# All attendance endpoints remain unchanged...
@app.get("/attendance")
def fetch_all_attendance(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_all_attendance(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/attendance/course/{course_id}")
def fetch_attendance_by_course(course_id: str, spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_attendance_by_course(spark_df, course_id))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/attendance/student/{student_id}/{course_id}/{limits}")
def fetch_attendance_by_student(student_id: str, course_id: str, limits: str, spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_attendance_by_student(spark_df, student_id, course_id, limits))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics")
def fetch_analytics(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_attendance_analytics(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/attendance_status")
def fetch_attendance_table(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        pandas_df = spark_df.toPandas()

        # Keep only the first occurrence per student_id (ensure uniqueness)
        unique_df = pandas_df.drop_duplicates(subset="student_id")

        # Limit to first 30 unique records
        limited_df = unique_df.head(50)

        table_data = generate_attendance_table(limited_df)
        return JSONResponse(content=table_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict_dropout")
async def predict_dropout(file: UploadFile = File(...), model_name: str = Form(...)):
    try:
        # Read CSV into DataFrame
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))

        # Train & Predict
        result = train_and_predict(df, model_name)
        return JSONResponse(content=result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


#--------------------


@app.post("/analyze_data")
async def analyze_data(
    file: UploadFile = File(...), 
    model_name: str = Form(...),
    target_column: str = Form(None)
):
    """
    Analyze any CSV dataset with specified model
    """
    try:
        # Read CSV into DataFrame
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))
        
        # Analyze with specified model
        result = analyze_dataset(df, model_name, target_column)
        return JSONResponse(content=result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compare_all_models")
async def compare_all_models(
    file: UploadFile = File(...),
    target_column: str = Form(None)
):
    """
    Compare all available models on the dataset
    """
    try:
        # Read CSV into DataFrame
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))
        
        # Get comparison results
        result = get_all_models_comparison(df, target_column)
        return JSONResponse(content=result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        

@app.get("/available_models")
async def get_available_models():
    """
    Get list of available models
    """
    return {
        "regression_models": list(REGRESSION_MODELS.keys()),
        "classification_models": list(CLASSIFICATION_MODELS.keys())
    }


#----------------

@app.post("/predict_user")
def predict_user_performance(user_input: StudentInput):
    print("rf_model is None?", ModelState.rf_model is None)
    try:
        result = predict_student_from_input(user_input.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model/performance")
def get_model_performance():
    if not ModelState.last_metrics:
        return {"error": "Model not trained yet"}
    return ModelState.last_metrics



@app.get("/attendance_statistics")
def fetch_attendance_statistics(spark_df: DataFrame = Depends(get_spark_df)):
    
    try:
        analytics = calculate_attendance_statistics(spark_df)
        
        return JSONResponse(content=analytics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/attendance_course_performance")
def fetch_course_performance(
    spark_df: DataFrame = Depends(get_spark_df),
    selected_batch: str = Query(None, description="Filter by batch ID")
):
    try:
        folder = "pkl"
        os.makedirs(folder, exist_ok=True)
        pkl_file = os.path.join(folder, "metrics.pkl")

        cache_key = f"attendance_course_performance_{selected_batch}"

        # ✅ Step 1: Pehle memory cache check karo
        if cache_key in CACHE:
            print(f"Returning {cache_key} from CACHE")
            return JSONResponse(content=CACHE[cache_key])

        # ✅ Step 2: Agar cache me nahi hai to file check karo
        if os.path.exists(pkl_file):
            analytics = joblib.load(pkl_file)
            print("Loaded metrics from metrics.pkl")
        else:
            # ✅ Step 3: Agar file bhi nahi hai to calculate karo
            analytics = calculate_course_performance_metrics(spark_df, selected_batch)
            joblib.dump(analytics, pkl_file)
            print("Calculated & saved metrics to metrics.pkl")

        # ✅ Step 4: Cache me save karo
        CACHE[cache_key] = analytics

        return JSONResponse(content=analytics)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/attendance_heatmap")
def fetch_heatmap(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=generate_attendance_heatmap_data(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/random-forest-regression")
def fetch_random_forest_regression(data: pd.DataFrame = Depends(get_pandas_data)):
    try:
        labels, predictions = perform_random_forest_regression(data)
        return JSONResponse(content={"labels": labels, "data": predictions})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/perform_attendance_trend_analysis/{limits}")
def fetch_attendance_trends(limits: str, data: pd.DataFrame = Depends(get_pandas_data)):
    try:
        return JSONResponse(content=perform_attendance_trend_analysis(data, limits))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# LMS endpoints remain unchanged...
@app.get("/course-engagement")
def course_engagement(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_course_engagement_metrics(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/student-performance")
def student_perf(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_student_performance(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/action-distribution")
def action_dist(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_action_type_distribution(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Demographics...
@app.get("/demographic-summary")
def demo_summary(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_demographic_summary(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/educational-insights")
def edu_insights(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_educational_insights(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/course_demand")
def edu_insights(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        folder = "pkl"
        os.makedirs(folder, exist_ok=True)

        course_file = os.path.join(folder, "course_demand_metrics.pkl")
        cache_key = "course_demand"   # unique cache key

        # 1) ✅ Check memory cache first
        if cache_key in CACHE:
            print("Loaded metrics from CACHE (RAM)")
            return JSONResponse(content=CACHE[cache_key])

        # 2) ✅ Check pickle file next
        if os.path.exists(course_file):
            contents = joblib.load(course_file)
            CACHE[cache_key] = contents   # memory me bhi daal do
            print("Loaded metrics from course_demand_metrics.pkl")
        else:
            # 3) ✅ Calculate via Spark (if not cached & not in pkl)
            contents = predict_course_demand_from_df(spark_df)
            CACHE[cache_key] = contents   # memory me store
            joblib.dump(contents, course_file)  # file me store
            print("Calculated & saved course_demand_metrics.pkl")

        return JSONResponse(content=contents)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/students_statistics")
def students_stats(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_overall_student_statistics(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/risk-analysis")
def risk_analysis(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_risk_analysis(spark_df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/dropout_risk_by_course")
def risk_analysis(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        folder = "pkl"
        os.makedirs(folder, exist_ok=True)

        risk_file = os.path.join(folder, "dropout_risk_by_course.pkl")
        cache_key = "dropout_risk_by_course" # unique cache key

        if cache_key in CACHE:
            print("Loaded dropout_risk_by_course from CACHE")
            return JSONResponse(content=CACHE[cache_key])
        
        # 2) ✅ Check pickle file next
        if os.path.exists(risk_file):
            contents = joblib.load(risk_file)
            CACHE[cache_key] = contents   # memory me bhi daal do
            print("Loaded metrics from dropout_risk_by_course.pkl")

        else:
            # 3) ✅ Calculate via Spark (if not cached & not in pkl)
            contents = train_rf_model_and_get_dropout_summary(spark_df)
            CACHE[cache_key] = contents   # memory me store
            joblib.dump(contents, risk_file)  # file me store
            print("Calculated & saved dropout_risk_by_course.pkl")
        
        return JSONResponse(content=contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/dropout_risk_percentage")
def risk_analysis(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        folder = "pkl"
        os.makedirs(folder, exist_ok=True)

        dropout_file = os.path.join(folder, "dropout_risk_percentage_metrics.pkl")
        cache_key = "dropout_risk_percentage"   # unique cache key

        # 1) ✅ Check memory cache first
        if cache_key in CACHE:
            print("Loaded metrics from CACHE (RAM)")
            return JSONResponse(content=CACHE[cache_key])

        # 2) ✅ Check pickle file next
        if os.path.exists(dropout_file):
            contents = joblib.load(dropout_file)
            CACHE[cache_key] = contents   # memory me bhi daal do
            print("Loaded metrics from dropout_risk_percentage_metrics.pkl")

        else:
            # 3) ✅ Calculate via Spark (if not cached & not in pkl)
            contents = calculate_dropout_risk_per_student(spark_df)
            CACHE[cache_key] = contents   # memory me store
            joblib.dump(contents, dropout_file)  # file me store
            print("Calculated & saved dropout_risk_percentage_metrics.pkl")


        return JSONResponse(content=contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    
@app.get("/get_student_probabilities")
def risk_analysis(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        folder = "pkl"
        os.makedirs(folder, exist_ok=True)
        pkl_file = os.path.join(folder, "student_probabilities_metrics.pkl")
        cache_key = "student_probabilities"  # unique cache key

        # 1️⃣ Check memory cache first
        if cache_key in CACHE:
            print("Returning student_probabilities from CACHE")
            return JSONResponse(content=CACHE[cache_key])
        

        if os.path.exists(pkl_file):
            metrics = joblib.load(pkl_file)
            CACHE[cache_key] = metrics
            print("Loaded student_probabilities from pkl")

        else:
            # 3️⃣ Calculate metrics
            metrics = train_rf_model_and_get_student_probabilities(spark_df)
            # 4️⃣ Save to .pkl
            joblib.dump(metrics, pkl_file)
            print("Calculated & saved student_probabilities to pkl")
            # 5️⃣ Save to memory cache
            CACHE[cache_key] = metrics

        return JSONResponse(content=metrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 


@app.get("/academic-performance")
def academic_performance(spark_df: DataFrame = Depends(get_spark_df)):
    try:

        folder = "pkl"
        os.makedirs(folder, exist_ok=True)
        pkl_file = os.path.join(folder, "academic_performance_metrics.pkl")
        cache_key = "academic_performance"   # unique cache key

        # 1️⃣ Check memory cache first
        if cache_key in CACHE:
            print("Returning academic performance from CACHE")
            return JSONResponse(content=CACHE[cache_key])
        

        if os.path.exists(pkl_file):
            metrics = joblib.load(pkl_file)
            CACHE[cache_key] = metrics
            print("Loaded academic performance from pkl")

        else:
            # 3️⃣ Calculate metrics
            metrics = get_academic_performance_metrics(spark_df)
            # 4️⃣ Save to .pkl
            joblib.dump(metrics, pkl_file)
            print("Calculated & saved academic performance metrics to pkl")
            # 5️⃣ Save to memory cache
            CACHE[cache_key] = metrics

        return JSONResponse(content=metrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/quiz-summary")
def quiz_summary(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        folder = "pkl"
        os.makedirs(folder, exist_ok=True)
        pkl_file = os.path.join(folder, "quiz-summary_metrics.pkl")
        cache_key = "quiz-summary"   # unique cache key

        # 1️⃣ Check memory cache first
        if cache_key in CACHE:
            print("Returning quiz-summary from CACHE")
            return JSONResponse(content=CACHE[cache_key])
        

        if os.path.exists(pkl_file):
            metrics = joblib.load(pkl_file)
            CACHE[cache_key] = metrics
            print("Loaded quiz-summary from pkl")

        else:
            # 3️⃣ Calculate metrics
            metrics = get_quiz_summary_by_course(spark_df)
            # 4️⃣ Save to .pkl
            joblib.dump(metrics, pkl_file)
            print("Calculated & saved quiz-summary_metrics to pkl")
            # 5️⃣ Save to memory cache
            CACHE[cache_key] = metrics
        return JSONResponse(content=metrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/assignment-summary")
def assignment_summary(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        folder = "pkl"
        os.makedirs(folder, exist_ok=True)
        pkl_file = os.path.join(folder, "assignment-summary_metrics.pkl")
        cache_key = "assignment-summary"   # unique cache key

        # 1️⃣ Check memory cache first
        if cache_key in CACHE:
            print("Returning assignment-summary from CACHE")
            return JSONResponse(content=CACHE[cache_key])
        

        if os.path.exists(pkl_file):
            metrics = joblib.load(pkl_file)
            CACHE[cache_key] = metrics
            print("Loaded assignment-summary from pkl")

        else:
            # 3️⃣ Calculate metrics
            metrics = get_assignment_by_course(spark_df)
            # 4️⃣ Save to .pkl
            joblib.dump(metrics, pkl_file)
            print("Calculated & saved assignment-summary_metrics to pkl")
            # 5️⃣ Save to memory cache
            CACHE[cache_key] = metrics
        return JSONResponse(content=metrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/performance_summary")
def performance_analysis(spark_df: DataFrame = Depends(get_spark_df)):
    try:
        folder = "pkl"
        os.makedirs(folder, exist_ok=True)
        pkl_file = os.path.join(folder, "performance_summary_metrics.pkl")
        cache_key = "performance_summary"   # unique cache key

        # 1️⃣ Check memory cache first
        if cache_key in CACHE:
            print("Returning performance_summary from CACHE")
            return JSONResponse(content=CACHE[cache_key])
        

        if os.path.exists(pkl_file):
            metrics = joblib.load(pkl_file)
            CACHE[cache_key] = metrics
            print("Loaded performance_summary from pkl")

        else:
            # 3️⃣ Calculate metrics
            metrics = train_rf_model_and_get_performance_summary(spark_df)
            # 4️⃣ Save to .pkl
            joblib.dump(metrics, pkl_file)
            print("Calculated & saved performance_summary_metrics to pkl")
            # 5️⃣ Save to memory cache
            CACHE[cache_key] = metrics

        return JSONResponse(content=metrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Student specific
@app.get("/student/{student_id}")
def student_dashboard(student_id: str, spark_df: DataFrame = Depends(get_spark_df)):
    try:
        # ✅ Convert Spark DataFrame to Pandas
        pandas_df = spark_df.toPandas()

        # ✅ Call your Pandas-based function
        metrics = get_student_dashboard_data(pandas_df, student_id)

        return JSONResponse(content=metrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/student_course_wise/{student_id}")
def student_course_avg(student_id: str, spark_df: DataFrame = Depends(get_spark_df)):
    try:
        return JSONResponse(content=get_course_avg(spark_df, student_id))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/student_attendance_trends/{student_id}/{limits}")
def student_attendance_trends(student_id: str, limits: str, data: pd.DataFrame = Depends(get_pandas_data)):
    try:
        return JSONResponse(content=perform_attendance_trend_analysis_student(data, student_id, limits))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/teacher")
def teacher_view(
    spark: SparkSession = Depends(get_spark_session),
    spark_df: DataFrame = Depends(get_spark_df)
):
    try:
        folder = "pkl"
        os.makedirs(folder, exist_ok=True)   # agar folder exist na kare to create ho jaye
        teacher_file = os.path.join(folder, "teacher.pkl")
        cache_key = "teacher_metrics"   # ✅ unique cache key


        # 1) ✅ Check memory cache first
        if cache_key in CACHE:
            print("Loaded metrics from CACHE (RAM)")
            return JSONResponse(content=CACHE[cache_key])

        if os.path.exists(teacher_file):
            metrics = joblib.load(teacher_file)
            CACHE[cache_key] = metrics
            print("Loaded metrics from teacher.pkl")
        else:
            metrics = get_course_overview(spark,spark_df,spark_df,spark_df)
            CACHE[cache_key] = metrics
            joblib.dump(metrics, teacher_file)
            print("Calculated & saved teacher.pkl ")
        return JSONResponse(content=metrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

##teacher token ##
def get_teacher_from_token(authorization: str = Header(...)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        token = authorization.split(" ")[1]  # "Bearer <token>"
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"name": decoded["name"], "batch_id": decoded["batch_id"]}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


# ----------------- Route -----------------
@app.get("/teacher/analytics")
def fetch_teacher_analytics(
    teacher=Depends(get_teacher_from_token),
    spark_df: DataFrame = Depends(get_spark_df)
):
    from pyspark.sql import functions as F

    try:
        folder = "pkl"
        os.makedirs(folder, exist_ok=True)
        pkl_file = os.path.join(folder, "teacher_analytics.pkl")

        cache_key = f"teacher_analytics_{teacher['name']}_{teacher['batch_id']}"

        # ✅ Step 1: Memory cache check
        if cache_key in CACHE:
            print(f"Returning {cache_key} from CACHE")
            return JSONResponse(content=CACHE[cache_key])

        # ✅ Step 2: File cache check
        if os.path.exists(pkl_file):
            all_data = joblib.load(pkl_file)
            if cache_key in all_data:
                print(f"Loaded {cache_key} from PKL")
                CACHE[cache_key] = all_data[cache_key]
                return JSONResponse(content=all_data[cache_key])

        # ✅ Step 3: Agar cache + file dono nahi hai → calculate
        df_clean = spark_df.dropDuplicates([
            "batch_id", "month", "course", "teacher_name",
            "quizzes_completed", "attendance_status",
            "attendance_percentage", "assignments_completed"
        ])
        df_filtered = df_clean.filter(
            (F.col("teacher_name") == teacher["name"]) &
            (F.col("batch_id") == teacher["batch_id"])
        )

        if df_filtered.count() == 0:
            return JSONResponse(content={"message": "No records found"})

        # month order for sorting
        month_order = [
            "January","February","March","April","May","June","July",
            "August","September","October","November","December"
        ]
        months = [row["month"] for row in df_filtered.select("month").distinct().collect()]
        months_sorted = sorted(months, key=lambda x: month_order.index(x), reverse=True)
        last3 = months_sorted[:3][::-1]

        df_last3 = df_filtered.filter(F.col("month").isin(last3))
        summary_df = df_last3.groupBy("month").agg(
            F.first("course").alias("course"),
            F.first("batch_id").alias("batch_id"),
            F.first("teacher_name").alias("teacher_name"),
            F.countDistinct("quizzes_completed").alias("quizzes_completed"),
            F.avg("attendance_percentage").alias("avg_attendance"),
            F.avg("assignments_completed").alias("avg_assignments"),
            F.count(F.when(F.col("attendance_status") == "Present", 1)).alias("present_count"),
            F.count(F.when(F.col("attendance_status") == "Late", 1)).alias("late_count"),
            F.count(F.when(F.col("attendance_status") == "Absent", 1)).alias("absent_count"),
            (F.count(F.when(F.col("attendance_status") == "Present", 1)) * 100.0 / F.count("*")).alias("presence_rate"),
            (F.count(F.when(F.col("attendance_status") == "Late", 1)) * 100.0 / F.count("*")).alias("late_rate"),
            (F.count(F.when(F.col("attendance_status") == "Absent", 1)) * 100.0 / F.count("*")).alias("absence_rate"),
        ).orderBy("month")

        result = [
            {
                "month": row["month"],
                "course": row["course"],
                "batch": row["batch_id"],
                "teacher_name": row["teacher_name"],
                "quizzes_completed": int(row["quizzes_completed"]) if row["quizzes_completed"] else 0,
                "avg_attendance": round(row["avg_attendance"], 2) if row["avg_attendance"] else 0.0,
                "avg_assignments": int(row["avg_assignments"]) if row["avg_assignments"] else 0,
                "present_count": row["present_count"],
                "late_count": row["late_count"],
                "absent_count": row["absent_count"],
                "presence_rate": round(row["presence_rate"], 2),
                "late_rate": round(row["late_rate"], 2),
                "absence_rate": round(row["absence_rate"], 2),
            }
            for row in summary_df.collect()
        ]

        # ✅ Step 4: Save to cache + PKL
        CACHE[cache_key] = result

        # agar file hai to update karo, warna naya dict banao
        if os.path.exists(pkl_file):
            all_data = joblib.load(pkl_file)
        else:
            all_data = {}

        all_data[cache_key] = result
        joblib.dump(all_data, pkl_file)
        print(f"Saved {cache_key} to PKL")

        return JSONResponse(content=result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(status_code=500, content={"message": f"Unexpected error: {str(exc)}"})

def main(argv=sys.argv[1:]):
    import argparse

    parser = argparse.ArgumentParser(description="Start the Attendance Analytics API server.")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host address to bind the server")
    parser.add_argument("--port", type=int, default=3001, help="Port number to bind the server")
    parser.add_argument("--debug", action="store_true", help="Enable debug mode for live reloading")

    args = parser.parse_args(argv)

    try:
        print(f"Starting server on {args.host}:{args.port} with debug={args.debug}")
        uvicorn.run("server:app", host=args.host, port=args.port, reload=args.debug)
    except KeyboardInterrupt:
        print("\nServer shutdown initiated by user.")
    except Exception as e:
        print(f"An error occurred while running the server: {e}")
    finally:
        print("Server has been stopped.")

if __name__ == "__main__":
    main()