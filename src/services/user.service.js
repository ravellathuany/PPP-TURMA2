const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, nextId } = require('../db/memory');
const { JWT_SECRET } = require('../middleware/auth');

function findUserByEmail(email) {
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

async function register({ name, email, password, role }) {
  if (!name || !email || !password) {
    throw { status: 400, message: 'name, email and password are required' };
  }
  if (findUserByEmail(email)) {
    throw { status: 409, message: 'Email already registered' };
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const id = nextId('users');
  const user = { id, name, email, passwordHash, role: role === 'teacher' ? 'teacher' : 'student' };
  db.users.push(user);
  const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
  return { user: { id, name, email, role: user.role }, token };
}

async function login({ email, password }) {
  if (!email || !password) throw { status: 400, message: 'email and password are required' };
  const user = findUserByEmail(email);
  if (!user) throw { status: 401, message: 'Invalid credentials' };
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw { status: 401, message: 'Invalid credentials' };
  const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
}

function listStudents() {
  return db.users.filter(u => u.role === 'student').map(({ passwordHash, ...rest }) => rest);
}

module.exports = {
  register,
  login,
  listStudents
};
