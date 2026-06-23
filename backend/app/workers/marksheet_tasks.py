import os
import json

from app.workers.celery_app import celery_app
from app.database.connection import get_connection
from app.services.marksheet_extractor import extract_marksheet
from app.services.marksheet_parser import parse_marksheet, validate_marksheet


@celery_app.task
def process_marksheet(document_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            UPDATE academic_rag.documents
            SET status = %s
            WHERE id = %s
        """,
            ("PROCESSING", document_id),
        )

        connection.commit()

        print(f"Processing marksheet document: {document_id}")

        cursor.execute(
            """
        SELECT file_path, semester, student_id
        FROM academic_rag.documents
        WHERE id = %s
        """,
            (document_id,),
        )

        document = cursor.fetchone()

        if not document:
            raise Exception(f"Document {document_id} not found")

        file_path = document[0]
        semester = document[1]
        student_id = document[2]

        extracted_content = extract_marksheet(file_path)

        # Save markdown for debugging
        markdown_dir = "app/data/extracted_markdown"
        os.makedirs(markdown_dir, exist_ok=True)

        markdown_path = os.path.join(markdown_dir, f"document_{document_id}.md")

        with open(markdown_path, "w", encoding="utf-8") as file:
            file.write(extracted_content)

        parsed_data = parse_marksheet(extracted_content)

        print("\n===== PARSED DATA =====\n")
        print(parsed_data)
        print("\n=======================\n")

        

        # Save parsed JSON
        json_dir = "app/data/extracted_json"
        os.makedirs(json_dir, exist_ok=True)

        json_path = os.path.join(json_dir, f"document_{document_id}.json")

        with open(json_path, "w", encoding="utf-8") as file:
            json.dump(parsed_data, file, indent=4)
        # Remove existing data for this document

        cursor.execute(
            """
            DELETE FROM academic_rag.marksheet_data
            WHERE document_id = %s
        """,
            (document_id,),
        )

        # Save marksheet data

        # Save marksheet data
        for subject in parsed_data["subjects"]:

            cursor.execute(
                """
            INSERT INTO academic_rag.marksheet_data (
                user_id,
                document_id,
                semester,
                seat_number,
                student_name,
                programme_name,
                exam_month,
                sgpi,
                percentage_marks,
                course_code,
                course_name,
                course_credits,
                credit_earned,
                cmulg
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
                (
                    student_id,
                    document_id,
                    semester,
                    parsed_data["seat_number"],
                    parsed_data["student_name"],
                    parsed_data["programme_name"],
                    parsed_data["exam_month"],
                    parsed_data["sgpi"],
                    parsed_data["percentage_marks"],
                    subject["course_code"],
                    subject["course_name"],
                    subject["course_credits"],
                    subject["credit_earned"],
                    subject["cmulg"],
                ),
            )

        cursor.execute(
            """
            UPDATE academic_rag.documents
            SET status = %s
            WHERE id = %s
        """,
            ("COMPLETED", document_id),
        )

        connection.commit()

        return {"document_id": document_id, "status": "COMPLETED"}

    except Exception as e:

        connection.rollback()

        cursor.execute(
            """
            UPDATE academic_rag.documents
            SET status = %s
            WHERE id = %s
        """,
            ("FAILED", document_id),
        )

        connection.commit()

        raise e

    finally:
        cursor.close()
        connection.close()
