const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// Create a MySQL connection pool. Change these values to match your database config.
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'students',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Endpoint 2 (Baraa):
app.post('/students', async (req, res) => {
    const { id, name, grade } = req.body;
    if (!id || !name || !grade) {
        return res.status(400).json({ message: "Missing required fields: id, name, grade" });
    }
    try {
        const query = 'INSERT INTO students (id, name, grade) VALUES (?, ?, ?)';
        await pool.query(query, [id, name, grade]);
        res.status(201).json({ id, name, grade });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint 2 (Maher): Delete a student
 */
app.delete('/students/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        await pool.query('DELETE FROM student_subjects WHERE student_id = ?', [studentId]);
        await pool.query('DELETE FROM student_classes WHERE student_id = ?', [studentId]);

        const [result] = await pool.query('DELETE FROM students WHERE id = ?', [studentId]);
        if (result.affectedRows > 0) {
            res.status(200).send(`Student with ID ${studentId} has been removed.`);
        } else {
            res.status(404).send('Student not found.');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/subjects', async (req, res) => {
    const { id, name } = req.body;
    if (!id || !name) {
        return res.status(400).json({ message: "Missing required fields: id, name" });
    }
    try {
        const query = 'INSERT INTO subjects (id, name) VALUES (?, ?)';
        await pool.query(query, [id, name]);
        res.status(201).json({ id, name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint 4 (Fahri): Upgrade a class by ID
 * This endpoint increases the class level by 1.
 */
app.patch('/classes/:id/upgrade', async (req, res) => {
    const classId = req.params.id;
    try {
        // First, check if the class exists
        const [rows] = await pool.query('SELECT * FROM classes WHERE id = ?', [classId]);
        if (rows.length === 0) {
            return res.status(404).send('Class not found.');
        }
        // Upgrade the class level
        await pool.query('UPDATE classes SET level = level + 1 WHERE id = ?', [classId]);
        // Retrieve the updated class data
        const [updatedRows] = await pool.query('SELECT * FROM classes WHERE id = ?', [classId]);
        res.status(200).json({ message: `Class ${classId} upgraded successfully.`, classData: updatedRows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint 5 (Baraa): Generate a student report
 * Returns a list of students with their name, grade, and subjects (retrieved via join).
 */
app.get('/students/report', async (req, res) => {
    try {
        // Get all students
        const [students] = await pool.query('SELECT * FROM students');
        const report = [];

        // For each student, retrieve assigned subjects
        for (const student of students) {
            const [subjects] = await pool.query(
                `SELECT sub.id, sub.name 
                 FROM subjects sub 
                 JOIN student_subjects ss ON sub.id = ss.subject_id 
                 WHERE ss.student_id = ?`, 
                [student.id]
            );
            report.push({
                name: student.name,
                grade: student.grade,
                subjects
            });
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint 6 (Maher): Get all students
 */
app.get('/students', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM students');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint 7 (Alvi): Get a student by ID
 */
app.get('/students/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [studentId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Student not found.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint 8 (Fahri): Assign a subject to a student
 * Request body: { subjectId }
 */
app.post('/students/:id/subjects', async (req, res) => {
    const studentId = req.params.id;
    const subjectId = req.body.subjectId;
    if (!subjectId) {
        return res.status(400).send('subjectId is required.');
    }
    try {
        // Check if student exists
        const [studentRows] = await pool.query('SELECT * FROM students WHERE id = ?', [studentId]);
        if (studentRows.length === 0) {
            return res.status(404).send('Student not found.');
        }
        // Check if subject exists
        const [subjectRows] = await pool.query('SELECT * FROM subjects WHERE id = ?', [subjectId]);
        if (subjectRows.length === 0) {
            return res.status(400).send('Invalid subject ID.');
        }
        // Check if assignment already exists to prevent duplicates
        const [existing] = await pool.query(
            'SELECT * FROM student_subjects WHERE student_id = ? AND subject_id = ?', 
            [studentId, subjectId]
        );
        if (existing.length === 0) {
            await pool.query(
                'INSERT INTO student_subjects (student_id, subject_id) VALUES (?, ?)',
                [studentId, subjectId]
            );
        }
        res.status(200).json({ message: 'Subject assigned successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint 9 (Baraa): Remove a subject from a student
 */
app.delete('/students/:id/subjects/:subjectId', async (req, res) => {
    const studentId = req.params.id;
    const subjectId = req.params.subjectId;
    try {
        const [result] = await pool.query(
            'DELETE FROM student_subjects WHERE student_id = ? AND subject_id = ?', 
            [studentId, subjectId]
        );
        if (result.affectedRows > 0) {
            res.status(200).send('Subject removed');
        } else {
            res.status(404).send('Student or subject association not found.');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint 10 (Maher): Update student information
 * Request body: any fields to update (e.g., name, grade)
 */
app.put('/students/:id', async (req, res) => {
    const studentId = req.params.id;
    const updatedData = req.body;
    // Build the update query dynamically based on the provided fields.
    const allowedFields = ['name', 'grade'];
    const fields = [];
    const values = [];
    for (const field of allowedFields) {
        if (updatedData[field] !== undefined) {
            fields.push(`${field} = ?`);
            values.push(updatedData[field]);
        }
    }
    if (fields.length === 0) {
        return res.status(400).send('No valid fields provided for update.');
    }
    values.push(studentId); // For the WHERE clause
    try {
        const query = `UPDATE students SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await pool.query(query, values);
        if (result.affectedRows === 0) {
            return res.status(404).send('Student not found.');
        }
        // Return the updated student data.
        const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [studentId]);
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint 15 (Alvi): Assign a student to a class
 * Request body: { studentId }
 */
app.post('/classes/:id/students', async (req, res) => {
    const classId = req.params.id;
    const studentId = req.body.studentId;
    if (!studentId) {
        return res.status(400).json({ message: 'studentId is required.' });
    }
    try {
        // Check if class exists
        const [classRows] = await pool.query('SELECT * FROM classes WHERE id = ?', [classId]);
        if (classRows.length === 0) {
            return res.status(404).json({ message: 'Class not found.' });
        }
        // Check if student exists
        const [studentRows] = await pool.query('SELECT * FROM students WHERE id = ?', [studentId]);
        if (studentRows.length === 0) {
            return res.status(404).json({ message: 'Student not found.' });
        }
        // Check if association already exists
        const [existing] = await pool.query(
            'SELECT * FROM student_classes WHERE student_id = ? AND class_id = ?',
            [studentId, classId]
        );
        if (existing.length === 0) {
            await pool.query(
                'INSERT INTO student_classes (student_id, class_id) VALUES (?, ?)',
                [studentId, classId]
            );
        }
        res.status(200).json({ message: 'Student assigned to class successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint 16 (Fahri): Remove a student from a class
 */
app.delete('/classes/:id/students/:studentId', async (req, res) => {
    const classId = req.params.id;
    const studentId = req.params.studentId;
    try {
        const [result] = await pool.query(
            'DELETE FROM student_classes WHERE class_id = ? AND student_id = ?',
            [classId, studentId]
        );
        if (result.affectedRows > 0) {
            res.status(200).send(`Student ${studentId} removed from class ${classId}.`);
        } else {
            res.status(404).send('Class or student association not found.');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint 17 (Baraa): Get all subjects
 */
app.get('/subjects', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM subjects');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint 18 (Maher): Get a subject by ID
 */
app.get('/subjects/:id', async (req, res) => {
    const subjectId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT * FROM subjects WHERE id = ?', [subjectId]);
        if (rows.length === 0) {
            return res.status(404).send('Subject not found.');
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint 19 (Alvi): Update subject information
 * Request body: any fields to update (currently only name is allowed)
 */
app.put('/subjects/:id', async (req, res) => {
    const subjectId = req.params.id;
    const updatedData = req.body;
    if (!updatedData.name) {
        return res.status(400).json({ message: 'Name field is required for update.' });
    }
    try {
        const query = 'UPDATE subjects SET name = ? WHERE id = ?';
        const [result] = await pool.query(query, [updatedData.name, subjectId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Subject not found.' });
        }
        // Return updated subject
        const [rows] = await pool.query('SELECT * FROM subjects WHERE id = ?', [subjectId]);
        res.status(200).json({ message: 'Subject updated successfully.', subject: rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint 20 (Fahri): Get students in a class
 * Returns all students that have been assigned to a particular class.
 */
app.get('/classes/:id/students', async (req, res) => {
    const classId = req.params.id;
    try {
        // Join student_classes with students table to retrieve student details.
        const query = `
            SELECT s.*
            FROM students s
            JOIN student_classes sc ON s.id = sc.student_id
            WHERE sc.class_id = ?
        `;
        const [rows] = await pool.query(query, [classId]);
        if (rows.length === 0) {
            return res.status(404).send('Class not found or has no students.');
        }
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


