const { db, nextId } = require('../db/memory');

function getSubjectsWithEnoughQuestions() {
  const counts = db.questions.reduce((acc, q) => {
    acc[q.subjectId] = (acc[q.subjectId] || 0) + 1;
    return acc;
  }, {});
  return db.subjects.filter(s => (counts[s.id] || 0) >= 3);
}

function pickRandom(arr, n) {
  const copy = [...arr];
  // Fisher-Yates shuffle until n
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function createQuiz({ studentId, subjectIds }) {
  if (!Array.isArray(subjectIds)) throw { status: 400, message: 'subjectIds must be an array' };
  const uniqueSubjectIds = [...new Set(subjectIds.map(Number))];
  if (uniqueSubjectIds.length < 1 || uniqueSubjectIds.length > 4) {
    throw { status: 400, message: 'You must select between 1 and 4 subjects' };
  }
  if (db.subjects.length === 0) throw { status: 400, message: 'No subjects available' };

  // Validate each subject has at least 3 questions
  const validSubjects = getSubjectsWithEnoughQuestions().map(s => s.id);
  const invalidSelected = uniqueSubjectIds.filter(id => !validSubjects.includes(id));
  if (invalidSelected.length > 0) {
    throw { status: 400, message: 'Selected subjects must have at least 3 questions each' };
  }

  // For each subject, pick 3 random questions
  const questionIds = uniqueSubjectIds.flatMap(subId => {
    const qs = db.questions.filter(q => q.subjectId === subId);
    const chosen = pickRandom(qs, 3);
    return chosen.map(q => q.id);
  });

  if (questionIds.length === 0) {
    throw { status: 400, message: 'No valid questions available for selected subjects' };
  }

  const quiz = {
    id: nextId('quizzes'),
    studentId,
    subjectIds: uniqueSubjectIds,
    questionIds,
    createdAt: new Date().toISOString()
  };
  db.quizzes.push(quiz);

  // Prepare response questions without answerIndex
  const responseQuestions = questionIds.map(qid => {
    const q = db.questions.find(x => x.id === qid);
    return { id: q.id, subjectId: q.subjectId, text: q.text, options: q.options };
  });

  return { quizId: quiz.id, subjects: uniqueSubjectIds, questions: responseQuestions };
}

function finalizeQuiz({ quizId, answers, studentId }) {
  const quiz = db.quizzes.find(q => q.id === Number(quizId));
  if (!quiz) throw { status: 404, message: 'Quiz not found' };
  if (quiz.studentId !== studentId) throw { status: 403, message: 'Forbidden: this quiz does not belong to you' };
  if (quiz.finalizedAt) throw { status: 400, message: 'Quiz already finalized' };

  if (!Array.isArray(answers) || answers.length === 0) throw { status: 400, message: 'answers must be a non-empty array' };

  const answerMap = new Map(answers.map(a => [Number(a.questionId), Number(a.selectedIndex)]));

  let total = quiz.questionIds.length;
  let correct = 0;
  let incorrect = 0;
  const bySubject = {}; // subjectId -> { total, correct, incorrect }
  const correctQuestionIds = [];
  const incorrectQuestionIds = [];
  const details = [];

  quiz.questionIds.forEach(qid => {
    const q = db.questions.find(x => x.id === qid);
    if (!q) return; // Shouldn't happen
    const selectedIndex = answerMap.has(qid) ? answerMap.get(qid) : null;
    const isCorrect = selectedIndex === q.answerIndex;
    if (isCorrect) {
      correct++;
      correctQuestionIds.push(qid);
    } else {
      incorrect++;
      incorrectQuestionIds.push(qid);
    }
    if (!bySubject[q.subjectId]) bySubject[q.subjectId] = { total: 0, correct: 0, incorrect: 0 };
    bySubject[q.subjectId].total++;
    if (isCorrect) bySubject[q.subjectId].correct++; else bySubject[q.subjectId].incorrect++;

    details.push({
      questionId: q.id,
      subjectId: q.subjectId,
      selectedIndex,
      correctIndex: q.answerIndex,
      correct: isCorrect
    });
  });

  const results = {
    total,
    correct,
    incorrect,
    bySubject,
    correctQuestionIds,
    incorrectQuestionIds,
    details
  };

  quiz.finalizedAt = new Date().toISOString();
  quiz.results = results;

  return { quizId: quiz.id, ...results };
}

function listMyQuizzes(studentId) {
  const finished = db.quizzes.filter(q => q.studentId === studentId && q.finalizedAt);
  return {
    totalFinished: finished.length,
    quizzes: finished.map(q => ({
      id: q.id,
      subjectIds: q.subjectIds,
      createdAt: q.createdAt,
      finalizedAt: q.finalizedAt,
      results: q.results
    }))
  };
}

function statsPerSubject(studentId) {
  // total questions per subject
  const totalPerSubject = db.subjects.reduce((acc, s) => {
    acc[s.id] = db.questions.filter(q => q.subjectId === s.id).length;
    return acc;
  }, {});

  // answered by student per subject (unique question IDs across finalized quizzes)
  const finished = db.quizzes.filter(q => q.studentId === studentId && q.finalizedAt);
  const answeredSets = {}; // subjectId -> Set of questionIds
  finished.forEach(qz => {
    qz.questionIds.forEach(qid => {
      const q = db.questions.find(x => x.id === qid);
      if (!q) return;
      if (!answeredSets[q.subjectId]) answeredSets[q.subjectId] = new Set();
      answeredSets[q.subjectId].add(qid);
    });
  });

  return db.subjects.map(s => ({
    subjectId: s.id,
    subjectName: s.name,
    totalQuestions: totalPerSubject[s.id] || 0,
    answeredByStudent: answeredSets[s.id] ? answeredSets[s.id].size : 0
  }));
}

function listAnsweredQuestionIds(studentId) {
  const finished = db.quizzes.filter(q => q.studentId === studentId && q.finalizedAt);
  const answeredQuestionIds = new Set();
  finished.forEach(qz => qz.questionIds.forEach(id => answeredQuestionIds.add(id)));
  return Array.from(answeredQuestionIds.values());
}

function statsOverall(studentId) {
  const totalQuestions = db.questions.length;
  const finished = db.quizzes.filter(q => q.studentId === studentId && q.finalizedAt);
  const answeredQuestionIds = new Set();
  finished.forEach(qz => qz.questionIds.forEach(id => answeredQuestionIds.add(id)));
  return {
    totalQuestions,
    answeredByStudent: answeredQuestionIds.size
  };
}

module.exports = {
  createQuiz,
  finalizeQuiz,
  listMyQuizzes,
  statsPerSubject,
  statsOverall,
  getSubjectsWithEnoughQuestions,
  listAnsweredQuestionIds
};
