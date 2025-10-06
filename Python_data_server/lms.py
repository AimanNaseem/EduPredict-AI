from pyspark.sql.functions import col, count, avg, countDistinct, when
from pyspark.sql import DataFrame




def get_course_engagement_metrics(df: DataFrame):
        """
        Calculate engagement metrics per course
        """
        data_course =df.groupBy("course_id") \
            .agg(
                countDistinct("student_id").alias("unique_students"),
                avg("session_duration").alias("avg_session_duration"),
                avg("quizzes_completed").alias("avg_quizzes"),
                avg("pages_viewed").alias("avg_pages_viewed"),
                count("*").alias("total_actions")
            ).orderBy("total_actions", ascending=False)
            
        return [row.asDict() for row in data_course.collect()]

def get_student_performance(df: DataFrame):
        """
        Calculate student performance metrics
        """
        data = df.groupBy("student_id") \
            .agg(
                count("*").alias("total_actions"),
                avg("session_duration").alias("avg_session_duration"),
                avg("quizzes_completed").alias("avg_quizzes"),
                avg("pages_viewed").alias("avg_pages_viewed")
            ).orderBy("total_actions", ascending=False)
        return [row.asDict() for row in data.collect()]
    

def get_action_type_distribution(df: DataFrame):
        """
        Calculate distribution of action types
        """
        data = df.groupBy("action_type") \
            .agg(count("*").alias("count")) \
            .orderBy("count", ascending=False)
        return [row.asDict() for row in data.collect()]
    