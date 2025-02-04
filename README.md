# Platform-based-programming-final-project

Below is an example of API documentation written in Markdown. This documentation includes an introduction to the project and a detailed description of all 20 endpoints, including the HTTP method, endpoint URL, parameters, request body (if applicable), and expected responses.

---

# Student Management API Documentation

## Introduction

The **Student Management API** is designed to manage data for students, subjects, and classes. It is built with Node.js, Express, and MySQL, and provides endpoints to perform various operations such as adding, updating, retrieving, and deleting records. The API also manages many-to-many relationships between students and subjects as well as between students and classes.

### Key Features

- **Student Management:** Create, update, retrieve, and delete student records.
- **Subject Management:** Create, update, and retrieve subjects.
- **Class Management:** Manage class levels and assign students to classes.
- **Relationship Management:** Manage many-to-many relationships between students and subjects, and students and classes.
- **Reporting:** Generate student reports that include the subjects assigned to each student.

> **Note:** All endpoints return JSON responses (unless stated otherwise) and expect requests to use the JSON format.

---

## Endpoints

### 1. Add a New Student

- **Method:** `POST`
- **URL:** `/students`
- **Description:** Adds a new student to the system.
- **Request Body:**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "grade": "A"
  }
  ```
- **Success Response:**
  - **Code:** `201 Created`
  - **Content:**
    ```json
    {
      "id": 1,
      "name": "John Doe",
      "grade": "A"
    }
    ```
- **Error Responses:**
  - **Code:** `400 Bad Request` if any required field is missing.
  - **Code:** `500 Internal Server Error` on database or server errors.

---

### 2. Delete a Student

- **Method:** `DELETE`
- **URL:** `/students/:id`
- **Description:** Deletes a student by ID and removes associated relationships.
- **URL Parameters:**
  - `id` (integer) – The unique identifier for the student.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** A plain text message confirming deletion.
- **Error Responses:**
  - **Code:** `404 Not Found` if the student does not exist.
  - **Code:** `500 Internal Server Error` on database or server errors.

---

### 3. Add a New Subject

- **Method:** `POST`
- **URL:** `/subjects`
- **Description:** Adds a new subject.
- **Request Body:**
  ```json
  {
    "id": 101,
    "name": "Mathematics"
  }
  ```
- **Success Response:**
  - **Code:** `201 Created`
  - **Content:**
    ```json
    {
      "id": 101,
      "name": "Mathematics"
    }
    ```
- **Error Responses:**
  - **Code:** `400 Bad Request` if required fields are missing.
  - **Code:** `500 Internal Server Error` on database or server errors.

---

### 4. Upgrade a Class by ID

- **Method:** `PATCH`
- **URL:** `/classes/:id/upgrade`
- **Description:** Increases the level of a class by 1.
- **URL Parameters:**
  - `id` (integer) – The unique identifier for the class.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    {
      "message": "Class <id> upgraded successfully.",
      "classData": { "id": <id>, "level": <new_level> }
    }
    ```
- **Error Responses:**
  - **Code:** `404 Not Found` if the class is not found.
  - **Code:** `500 Internal Server Error` on database or server errors.

---

### 5. Generate a Student Report

- **Method:** `GET`
- **URL:** `/students/report`
- **Description:** Retrieves a report of all students including their name, grade, and the subjects assigned to them.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** An array of student report objects.
    ```json
    [
      {
        "name": "John Doe",
        "grade": "A",
        "subjects": [
          { "id": 101, "name": "Mathematics" }
        ]
      },
      ...
    ]
    ```
- **Error Responses:**
  - **Code:** `500 Internal Server Error` on database or server errors.

---

### 6. Get All Students

- **Method:** `GET`
- **URL:** `/students`
- **Description:** Retrieves all student records.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** An array of student objects.
    ```json
    [
      { "id": 1, "name": "John Doe", "grade": "A" },
      { "id": 2, "name": "Jane Doe", "grade": "B" }
    ]
    ```
- **Error Responses:**
  - **Code:** `500 Internal Server Error` on database or server errors.

---

### 7. Get a Student by ID

- **Method:** `GET`
- **URL:** `/students/:id`
- **Description:** Retrieves a single student by ID.
- **URL Parameters:**
  - `id` (integer) – The unique identifier for the student.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** A student object.
    ```json
    { "id": 1, "name": "John Doe", "grade": "A" }
    ```
- **Error Responses:**
  - **Code:** `404 Not Found` if the student does not exist.
  - **Code:** `500 Internal Server Error` on database or server errors.

---

### 8. Assign a Subject to a Student

- **Method:** `POST`
- **URL:** `/students/:id/subjects`
- **Description:** Assigns a subject to a student.
- **URL Parameters:**
  - `id` (integer) – The student's ID.
- **Request Body:**
  ```json
  {
    "subjectId": 101
  }
  ```
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    { "message": "Subject assigned successfully." }
    ```
- **Error Responses:**
  - **Code:** `404 Not Found` if the student is not found.
  - **Code:** `400 Bad Request` if the subject ID is invalid or missing.
  - **Code:** `500 Internal Server Error` on database or server errors.

---

### 9. Remove a Subject from a Student

- **Method:** `DELETE`
- **URL:** `/students/:id/subjects/:subjectId`
- **Description:** Removes a subject assignment from a student.
- **URL Parameters:**
  - `id` (integer) – The student's ID.
  - `subjectId` (integer) – The subject's ID.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** A plain text message confirming removal.
- **Error Responses:**
  - **Code:** `404 Not Found` if the association is not found.
  - **Code:** `500 Internal Server Error` on database or server errors.

---

### 10. Update Student Information

- **Method:** `PUT`
- **URL:** `/students/:id`
- **Description:** Updates student information (e.g., name, grade).
- **URL Parameters:**
  - `id` (integer) – The student's ID.
- **Request Body:** (Only include fields that need to be updated)
  ```json
  {
    "name": "John Smith",
    "grade": "A+"
  }
  ```
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** The updated student object.
- **Error Responses:**
  - **Code:** `400 Bad Request` if no valid update fields are provided.
  - **Code:** `404 Not Found` if the student is not found.
  - **Code:** `500 Internal Server Error` on database or server errors.

### 15. Assign a Student to a Class

- **Method:** `POST`
- **URL:** `/classes/:id/students`
- **Description:** Assigns a student to a class.
- **URL Parameters:**
  - `id` (integer) – The class's ID.
- **Request Body:**
  ```json
  {
    "studentId": 1
  }
  ```
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    { "message": "Student assigned to class successfully." }
    ```
- **Error Responses:**
  - **Code:** `404 Not Found` if the class or student does not exist.
  - **Code:** `500 Internal Server Error` on database or server errors.

---

### 16. Remove a Student from a Class

- **Method:** `DELETE`
- **URL:** `/classes/:id/students/:studentId`
- **Description:** Removes a student from a class.
- **URL Parameters:**
  - `id` (integer) – The class's ID.
  - `studentId` (integer) – The student's ID.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** A plain text message confirming the removal.
- **Error Responses:**
  - **Code:** `404 Not Found` if the association is not found.
  - **Code:** `500 Internal Server Error` on database or server errors.

---

### 17. Get All Subjects

- **Method:** `GET`
- **URL:** `/subjects`
- **Description:** Retrieves all subject records.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** An array of subject objects.
    ```json
    [
      { "id": 101, "name": "Mathematics" },
      { "id": 102, "name": "Science" }
    ]
    ```
- **Error Responses:**
  - **Code:** `500 Internal Server Error` on database or server errors.

---

### 18. Get a Subject by ID

- **Method:** `GET`
- **URL:** `/subjects/:id`
- **Description:** Retrieves a subject by its ID.
- **URL Parameters:**
  - `id` (integer) – The subject's ID.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    { "id": 101, "name": "Mathematics" }
    ```
- **Error Responses:**
  - **Code:** `404 Not Found` if the subject is not found.
  - **Code:** `500 Internal Server Error` on database or server errors.

---

### 19. Update Subject Information

- **Method:** `PUT`
- **URL:** `/subjects/:id`
- **Description:** Updates subject details (currently, only the name field is allowed).
- **URL Parameters:**
  - `id` (integer) – The subject's ID.
- **Request Body:**
  ```json
  {
    "name": "Advanced Mathematics"
  }
  ```
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    {
      "message": "Subject updated successfully.",
      "subject": { "id": 101, "name": "Advanced Mathematics" }
    }
    ```
- **Error Responses:**
  - **Code:** `400 Bad Request` if the name field is missing.
  - **Code:** `404 Not Found` if the subject is not found.
  - **Code:** `500 Internal Server Error` on database or server errors.

---

### 20. Get Students in a Class

- **Method:** `GET`
- **URL:** `/classes/:id/students`
- **Description:** Retrieves all students assigned to a particular class.
- **URL Parameters:**
  - `id` (integer) – The class's ID.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** An array of student objects belonging to the class.
    ```json
    [
      { "id": 1, "name": "John Doe", "grade": "A" },
      { "id": 3, "name": "Alice Johnson", "grade": "B" }
    ]
    ```
- **Error Responses:**
  - **Code:** `404 Not Found` if the class is not found or has no students.
  - **Code:** `500 Internal Server Error` on database or server errors.
