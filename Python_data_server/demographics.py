from pyspark.sql.functions import col, count, avg, countDistinct, when
from pyspark.sql import DataFrame

def get_demographic_summary(df: DataFrame):
        """Generate demographic summary"""
        data = (
        df.groupBy("batch_id", "course","month")
          .agg(
              count("student_id").alias("total_students"),
              avg("gpa").alias("avg_gpa"),
              avg("attendance_percentage").alias("avg_attendance"),
             
          )
          .orderBy("total_students", ascending=False)
    )
        return{
         "student_data": [row.asDict() for row in data.collect()]

        }
        
    
def get_educational_insights(df: DataFrame):
        """Generate educational insights"""
        data= df.groupBy("parent_education") \
            .agg(
                count("student_id").alias("total_students"),
                avg("previous_gpa").alias("avg_gpa"),
                avg("subject_grades").alias("avg_subject_grades"),
                avg("dropout_risk").alias("dropout_rate")
            )
        return [row.asDict() for row in data.collect()]
    
def get_overall_student_statistics(df: DataFrame):
        """Generate overall student statistics"""
        total_students = df.count()
        female_students = df.filter(col("gender") == "Female").count()
        male_students = df.filter(col("gender") == "Male").count()
        
        return {
            "total_students": total_students,
            "female_students": female_students,
            "male_students": male_students
        }    

    
def get_risk_analysis(df: DataFrame):
        """Analyze dropout risk factors"""
        data= {
            "total_students": df.count(),
            "dropout_risk_breakdown": df.groupBy(
                when(col("dropout_risk") == 1, "High Risk")
                .otherwise("Low Risk")
            ).count().collect(),
            "risk_by_socioeconomic": df.groupBy("socioeconomic_status") \
                .agg(
                    count("student_id").alias("total_students"),
                    avg("dropout_risk").alias("risk_rate")
                ).collect()
        }
        return data
