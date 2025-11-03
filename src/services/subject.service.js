const { db, nextId } = require('../db/memory');

function listSubjects() {
  return db.subjects;
}

function addSubject({ name }) {
  if (!name || typeof name !== 'string') throw { status: 400, message: 'name is required' };
  const clean = name.trim();
  if (!clean) throw { status: 400, message: 'name is required' };
  if (db.subjects.some(s => s.name.toLowerCase() === clean.toLowerCase())) {
    throw { status: 409, message: 'Subject already exists' };
  }
  const subject = { id: nextId('subjects'), name: clean };
  db.subjects.push(subject);
  return subject;
}

function removeSubject(id) {
  const idx = db.subjects.findIndex(s => s.id === Number(id));
  if (idx === -1) throw { status: 404, message: 'Subject not found' };
  // Also remove related questions (optional: but safer to keep consistency)
  const subjectId = db.subjects[idx].id;
  db.questions = db.questions.filter(q => q.subjectId !== subjectId);
  db.subjects.splice(idx, 1);
}

module.exports = { listSubjects, addSubject, removeSubject };
