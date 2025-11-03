// In-memory database for EduQuiz
// This module exports simple JS objects and helper functions to manage IDs.

const db = {
  users: [], // { id, name, email, passwordHash, role: 'student'|'teacher' }
  subjects: [], // { id, name }
  questions: [], // { id, subjectId, text, options: [string], answerIndex, createdBy, imageUrl? }
  quizzes: [] // { id, studentId, subjectIds: number[], questionIds: number[], createdAt, finalizedAt?: Date, results?: any }
};

let nextIds = {
  users: 1,
  subjects: 1,
  questions: 1,
  quizzes: 1
};

function nextId(collection) {
  const id = nextIds[collection]++;
  return id;
}

module.exports = {
  db,
  nextId
};
