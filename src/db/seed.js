const { db, nextId } = require('./memory');

function seed() {
  if (db.subjects.length === 0) {
    const defaults = ['matemática', 'biologia', 'química', 'história', 'geografia'];
    defaults.forEach(name => db.subjects.push({ id: nextId('subjects'), name }));
  }
}

module.exports = { seed };
