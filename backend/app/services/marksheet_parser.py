# import re
# from html import unescape


# def clean_text(text: str) -> str:

#     if not text:
#         return ""

#     text = unescape(text)

#     text = text.replace("&#124;", "")
#     text = text.replace("|", " ")

#     text = re.sub(r"\s+", " ", text)

#     return text.strip()


# def parse_marksheet(content: str):

#     result = {
#         "student_name": None,
#         "seat_number": None,
#         "programme_name": None,
#         "exam_month": None,
#         "sgpi": None,
#         "percentage_marks": None,
#         "subjects": []
#     }

#     # -------------------------
#     # Exam Month
#     # -------------------------

#     exam_match = re.search(
#         r"Examination\s*:\s*([A-Za-z]+\s+\d{4})",
#         content
#     )

#     if exam_match:
#         result["exam_month"] = exam_match.group(1)

#     # -------------------------
#     # Programme Name
#     # -------------------------

#     for line in content.splitlines():

#         if "Programme :" in line:

#             columns = [
#                 clean_text(col)
#                 for col in line.split("|")
#             ]

#             columns = [col for col in columns if col]

#             if len(columns) >= 2:
#                 result["programme_name"] = columns[1]

#             break

#     # -------------------------
#     # Seat Number
#     # -------------------------

#     for line in content.splitlines():

#         if "Examination Seat Number" in line:

#             columns = [
#                 clean_text(col)
#                 for col in line.split("|")
#             ]

#             columns = [col for col in columns if col]

#             for value in columns:

#                 if re.fullmatch(r"\d{8,}", value):
#                     result["seat_number"] = value
#                     break

#             break

#     # -------------------------
#     # Student Name
#     # -------------------------

#     for line in content.splitlines():

#         if "Name of Student" in line:

#             columns = [
#                 clean_text(col)
#                 for col in line.split("|")
#             ]

#             columns = [col for col in columns if col]

#             for value in columns:

#                 if (
#                     value != "Name of Student"
#                     and len(value.split()) >= 2
#                 ):
#                     result["student_name"] = value
#                     break

#             break

#     # -------------------------
#     # SGPI
#     # -------------------------

#     sgpi_match = re.search(
#         r"SGPI:.*?(\d+\.\d+)",
#         content
#     )

#     if sgpi_match:
#         result["sgpi"] = float(
#             sgpi_match.group(1)
#         )

#     # -------------------------
#     # Percentage Marks
#     # -------------------------

#     percentage_match = re.search(
#         r"% Marks:\s*(\d+\.\d+)",
#         content
#     )

#     if percentage_match:
#         result["percentage_marks"] = float(
#             percentage_match.group(1)
#         )

#     # -------------------------
#     # Subjects
#     # -------------------------

#     for line in content.splitlines():

#         if not line.startswith("|"):
#             continue

#         if "Course Code" in line:
#             continue

#         if "TOTAL" in line:
#             continue

#         if "Final Result" in line:
#             continue

#         columns = [
#             clean_text(col)
#             for col in line.split("|")
#         ]

#         columns = [col for col in columns if col]

#         if len(columns) < 3:
#             continue

#         course_code = columns[0]

#         if not re.match(
#             r"^\d{3}[A-Z0-9]+$",
#             course_code
#         ):
#             continue

#         course_name = columns[1]

#         numeric_values = []

#         for value in columns[2:]:

#             if re.fullmatch(r"\d+", value):
#                 numeric_values.append(int(value))

#         course_credits = None
#         credit_earned = None
#         cmulg = None

#         if len(numeric_values) >= 1:
#             course_credits = numeric_values[0]

#         if len(numeric_values) >= 3:
#             credit_earned = numeric_values[-3]
#             cmulg = numeric_values[-1]

#         elif len(numeric_values) == 2:
#             credit_earned = numeric_values[0]
#             cmulg = numeric_values[-1]

#         elif len(numeric_values) == 1:
#             credit_earned = numeric_values[0]

#         result["subjects"].append({
#             "course_code": course_code,
#             "course_name": course_name,
#             "course_credits": course_credits,
#             "credit_earned": credit_earned,
#             "cmulg": cmulg
#         })

#     return result


# def validate_marksheet(parsed_data):

#     required_fields = [
#         "student_name",
#         "seat_number",
#         "programme_name",
#         "exam_month",
#         "sgpi",
#         "percentage_marks"
#     ]

#     missing_fields = []

#     for field in required_fields:

#         if parsed_data.get(field) in [None, ""]:
#             missing_fields.append(field)

#     if len(parsed_data["subjects"]) == 0:
#         missing_fields.append("subjects")

#     return missing_fields

import re
from html import unescape


def clean_text(text: str) -> str:
    if not text:
        return ""

    text = unescape(text)

    # Convert HTML table separators
    text = text.replace("&#124;", "|")

    # Normalize line endings
    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    # Normalize spaces but preserve line breaks
    text = re.sub(r"[ \t]+", " ", text)

    # Remove extra blank lines
    text = re.sub(r"\n{2,}", "\n", text)

    return text.strip()


def parse_marksheet(content: str):

    content = clean_text(content)

    result = {
        "student_name": None,
        "seat_number": None,
        "programme_name": None,
        "exam_month": None,
        "sgpi": None,
        "percentage_marks": None,
        "subjects": [],
    }

    lines = content.split("\n")

    # -------------------------
    # Exam Month
    # -------------------------

    exam_patterns = [
        r"Examination\s*:?\s*([A-Za-z]+\s+\d{4})",
        r"Examination\s+([A-Za-z]+\s+\d{4})",
    ]

    for pattern in exam_patterns:
        exam_match = re.search(pattern, content, re.IGNORECASE)

        if exam_match:
            result["exam_month"] = exam_match.group(1).strip()
            break

    # -------------------------
    # Programme Name
    # -------------------------

    programme_match = re.search(
        r"Programme\s*:?\s*([^\n|]+?Bachelor[^\n|]+)",
        content,
        re.IGNORECASE,
    )

    if programme_match:
        result["programme_name"] = clean_text(programme_match.group(1))

    else:
        for line in lines:

            if "Programme" not in line:
                continue

            columns = [clean_text(col) for col in line.split("|")]
            columns = [col for col in columns if col]

            for value in columns:

                if "Bachelor" in value or "Master" in value:
                    result["programme_name"] = value
                    break

            if result["programme_name"]:
                break

    # -------------------------
    # Seat Number
    # -------------------------

    seat_match = re.search(r"\b\d{11}\b", content)

    if seat_match:
        result["seat_number"] = seat_match.group(0)

    # -------------------------
    # Student Name
    # -------------------------

    for line in lines:

        normalized_line = line.lower().replace(" ", "")

        if "nameofstudent" not in normalized_line:
            continue

        columns = [clean_text(col) for col in line.split("|")]
        columns = [col for col in columns if col]

        for value in columns:

            normalized_value = value.lower().replace(" ", "")

            if normalized_value == "nameofstudent":
                continue

            if len(value.split()) >= 3 and not re.search(r"\d", value):
                result["student_name"] = value
                break

        if result["student_name"]:
            break

    # -------------------------
    # Fallback
    # -------------------------

    if not result["student_name"]:

        name_match = re.search(
            r"Name\s*of\s*Student\s+([A-Za-z ]{5,})",
            content,
            re.IGNORECASE,
        )

        if not name_match:

            name_match = re.search(
                r"Name\s*ofStudent\s+([A-Za-z ]{5,})",
                content,
                re.IGNORECASE,
            )

        if name_match:

            candidate = clean_text(name_match.group(1))

            candidate = re.split(
                r"(Course Code|Final Result|SGPI)",
                candidate,
            )[0].strip()

            words = candidate.split()

            result["student_name"] = " ".join(words[:6])

    # -------------------------
    # SGPI
    # -------------------------

    sgpi_match = re.search(
        r"SGPI.*?(\d+(?:\.\d+)?)",
        content,
        re.IGNORECASE,
    )

    if sgpi_match:
        result["sgpi"] = float(sgpi_match.group(1))

    # -------------------------
    # Percentage Marks
    # -------------------------

    percentage_patterns = [
        r"%\s*Marks\s*:?\s*(\d+(?:\.\d+)?)",
        r"%Marks\s*:?\s*(\d+(?:\.\d+)?)",
    ]

    for pattern in percentage_patterns:

        percentage_match = re.search(
            pattern,
            content,
            re.IGNORECASE,
        )

        if percentage_match:
            result["percentage_marks"] = float(
                percentage_match.group(1)
            )
            break

    # -------------------------
    # Subjects
    # -------------------------

    for line in lines:

        line = line.strip()

        if not line.startswith("|"):
            continue

        if "Course Code" in line:
            continue

        if "TOTAL" in line:
            continue

        if "Final Result" in line:
            continue

        columns = [clean_text(col) for col in line.split("|")]
        columns = [col for col in columns if col]

        if len(columns) < 2:
            continue

        course_match = re.search(
            r"11[6|8][A-Z0-9]{4,}",
            columns[0],
            re.IGNORECASE,
        )

        if not course_match:
            continue

        course_code = course_match.group(0)
        course_name = columns[1]

        numeric_values = []

        for value in columns[2:]:

            cleaned = (
                value.replace("!", "")
                .replace("O", "0")
                .replace("o", "0")
            )

            if re.fullmatch(r"\d+", cleaned):
                numeric_values.append(int(cleaned))

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

        result["subjects"].append(
            {
                "course_code": course_code,
                "course_name": course_name,
                "course_credits": course_credits,
                "credit_earned": credit_earned,
                "cmulg": cmulg,
            }
        )

    return result


def validate_marksheet(parsed_data):

    required_fields = [
        "student_name",
        "seat_number",
        "programme_name",
        "exam_month",
        "sgpi",
        "percentage_marks",
    ]

    missing_fields = []

    for field in required_fields:

        if parsed_data.get(field) in [None, ""]:
            missing_fields.append(field)

    if len(parsed_data["subjects"]) == 0:
        missing_fields.append("subjects")

    return missing_fields
