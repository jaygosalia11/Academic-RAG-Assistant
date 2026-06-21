import re
from html import unescape


def clean_text(text: str) -> str:

    if not text:
        return ""

    text = unescape(text)

    text = text.replace("&#124;", "")
    text = text.replace("|", " ")

    text = re.sub(r"\s+", " ", text)

    return text.strip()


def parse_marksheet(content: str):

    result = {
        "student_name": None,
        "seat_number": None,
        "programme_name": None,
        "exam_month": None,
        "sgpi": None,
        "percentage_marks": None,
        "subjects": []
    }

    # -------------------------
    # Exam Month
    # -------------------------

    exam_match = re.search(
        r"Examination\s*:\s*([A-Za-z]+\s+\d{4})",
        content
    )

    if exam_match:
        result["exam_month"] = exam_match.group(1)

    # -------------------------
    # Programme Name
    # -------------------------

    for line in content.splitlines():

        if "Programme :" in line:

            columns = [
                clean_text(col)
                for col in line.split("|")
            ]

            columns = [col for col in columns if col]

            if len(columns) >= 2:
                result["programme_name"] = columns[1]

            break

    # -------------------------
    # Seat Number
    # -------------------------

    for line in content.splitlines():

        if "Examination Seat Number" in line:

            columns = [
                clean_text(col)
                for col in line.split("|")
            ]

            columns = [col for col in columns if col]

            for value in columns:

                if re.fullmatch(r"\d{8,}", value):
                    result["seat_number"] = value
                    break

            break

    # -------------------------
    # Student Name
    # -------------------------

    for line in content.splitlines():

        if "Name of Student" in line:

            columns = [
                clean_text(col)
                for col in line.split("|")
            ]

            columns = [col for col in columns if col]

            for value in columns:

                if (
                    value != "Name of Student"
                    and len(value.split()) >= 2
                ):
                    result["student_name"] = value
                    break

            break

    # -------------------------
    # SGPI
    # -------------------------

    sgpi_match = re.search(
        r"SGPI:.*?(\d+\.\d+)",
        content
    )

    if sgpi_match:
        result["sgpi"] = float(
            sgpi_match.group(1)
        )

    # -------------------------
    # Percentage Marks
    # -------------------------

    percentage_match = re.search(
        r"% Marks:\s*(\d+\.\d+)",
        content
    )

    if percentage_match:
        result["percentage_marks"] = float(
            percentage_match.group(1)
        )

    # -------------------------
    # Subjects
    # -------------------------

    for line in content.splitlines():

        if not line.startswith("|"):
            continue

        if "Course Code" in line:
            continue

        if "TOTAL" in line:
            continue

        if "Final Result" in line:
            continue

        columns = [
            clean_text(col)
            for col in line.split("|")
        ]

        columns = [col for col in columns if col]

        if len(columns) < 3:
            continue

        course_code = columns[0]

        if not re.match(
            r"^\d{3}[A-Z0-9]+$",
            course_code
        ):
            continue

        course_name = columns[1]

        numeric_values = []

        for value in columns[2:]:

            if re.fullmatch(r"\d+", value):
                numeric_values.append(int(value))

        course_credits = None
        credit_earned = None
        cmulg = None

        if len(numeric_values) >= 1:
            course_credits = numeric_values[0]

        if len(numeric_values) >= 3:
            credit_earned = numeric_values[-3]
            cmulg = numeric_values[-1]

        elif len(numeric_values) == 2:
            credit_earned = numeric_values[0]
            cmulg = numeric_values[-1]

        elif len(numeric_values) == 1:
            credit_earned = numeric_values[0]

        result["subjects"].append({
            "course_code": course_code,
            "course_name": course_name,
            "course_credits": course_credits,
            "credit_earned": credit_earned,
            "cmulg": cmulg
        })

    return result


def validate_marksheet(parsed_data):

    required_fields = [
        "student_name",
        "seat_number",
        "programme_name",
        "exam_month",
        "sgpi",
        "percentage_marks"
    ]

    missing_fields = []

    for field in required_fields:

        if parsed_data.get(field) in [None, ""]:
            missing_fields.append(field)

    if len(parsed_data["subjects"]) == 0:
        missing_fields.append("subjects")

    return missing_fields