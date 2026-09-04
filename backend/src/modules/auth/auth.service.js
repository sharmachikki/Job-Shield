const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const repository = require('./auth.repository');
const env = require('../../config/environment');
const AppError = require('../../utils/AppError');

function signTokens(user, roles) {
  const payload = { id: user.id, roles };
  const accessToken = jwt.sign(payload, env.jwt.accessSecret, { expiresIn: env.jwt.accessExpiresIn });
  const refreshToken = jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });
  return { accessToken, refreshToken };
}

async function register({ fullName, email, phone, password, role }) {
  const existing = await repository.findByEmail(email);
  if (existing) throw new AppError('An account with this email already exists', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await repository.createUser({ fullName, email, phone, passwordHash });

  // A user can hold multiple roles on the same account (e.g. Job Seeker + Freelancer)
  await repository.attachRole(user.id, role || 'JOB_SEEKER');

  const roles = await repository.getRoles(user.id);
  const tokens = signTokens(user, roles);
  await repository.saveRefreshToken(user.id, tokens.refreshToken, new Date(Date.now() + 7 * 24 * 3600 * 1000));

  return { user: { id: user.id, fullName: user.fullName, email: user.email, roles }, ...tokens };
}

async function login({ email, password }) {
  const user = await repository.findByEmail(email);
  if (!user) throw new AppError('Invalid email or password', 401);

  const isValid = await bcrypt.compare(password, user.passwordHash || '');
  if (!isValid) throw new AppError('Invalid email or password', 401);

  const roles = await repository.getRoles(user.id);
  const tokens = signTokens(user, roles);
  await repository.saveRefreshToken(user.id, tokens.refreshToken, new Date(Date.now() + 7 * 24 * 3600 * 1000));

  return { user: { id: user.id, fullName: user.fullName, email: user.email, roles }, ...tokens };
}

async function refresh(refreshToken) {
  try {
    const payload = jwt.verify(refreshToken, env.jwt.refreshSecret);
    const accessToken = jwt.sign({ id: payload.id, roles: payload.roles }, env.jwt.accessSecret, {
      expiresIn: env.jwt.accessExpiresIn,
    });
    return { accessToken };
  } catch (err) {
    throw new AppError('Invalid or expired refresh token', 401);
  }
}

module.exports = { register, login, refresh };
