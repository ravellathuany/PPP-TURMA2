const { db, nextId } = require('../db/memory');

function listQuestions(filter = {}) {
  const { subjectId } = filter;
  let list = db.questions;
  if (subjectId) list = list.filter(q => q.subjectId === Number(subjectId));
  return list;
}

function getQuestionById(id) {
  const q = db.questions.find(q => q.id === Number(id));
  if (!q) throw { status: 404, message: 'Question not found' };
  return q;
}

function addQuestion({ subjectId, text, options, answerIndex, createdBy, imageUrl }) {
  if (!subjectId || !text || !Array.isArray(options)) {
    throw { status: 400, message: 'subjectId, text e options são obrigatórios' };
  }
  // Exactly five options, all non-empty strings
  if (options.length !== 5 || options.some(o => typeof o !== 'string' || o.trim().length === 0)) {
    throw { status: 400, message: 'São necessárias exatamente 5 alternativas não vazias' };
  }
  if (answerIndex === undefined || answerIndex === null || isNaN(Number(answerIndex))) {
    throw { status: 400, message: 'answerIndex é obrigatório e deve ser um número' };
  }
  if (!db.subjects.some(s => s.id === Number(subjectId))) {
    throw { status: 400, message: 'Subject does not exist' };
  }
  const ans = Number(answerIndex);
  if (ans < 0 || ans > 4) {
    throw { status: 400, message: 'answerIndex deve estar entre 0 e 4' };
  }
  const id = nextId('questions');
  const q = { id, subjectId: Number(subjectId), text, options, answerIndex: ans, createdBy };
  if (imageUrl) q.imageUrl = imageUrl;
  db.questions.push(q);
  return q;
}

function removeQuestion(id) {
  const idx = db.questions.findIndex(q => q.id === Number(id));
  if (idx === -1) throw { status: 404, message: 'Question not found' };
  db.questions.splice(idx, 1);
}

function setQuestionImageUrl(id, imageUrl) {
  const q = getQuestionById(id);
  q.imageUrl = imageUrl;
  return q;
}

function clearQuestionImage(id) {
  const q = getQuestionById(id);
  q.imageUrl = undefined;
  delete q.imageUrl;
  return q;
}

module.exports = { listQuestions, getQuestionById, addQuestion, removeQuestion, setQuestionImageUrl, clearQuestionImage };
