const repository = require('./training-programs.repository');
const AppError = require('../../utils/AppError');

// Business logic for "training-programs" lives here. Controllers stay thin; this is where
// approval-engine hooks, pricing calculations, wallet debits, and cross-module
// orchestration (via other modules' services) should be called from.

async function list(query) {
  const page = Number(query.page) || 1;
  const limit = Math.min(Number(query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    repository.findAll({ skip, take: limit }),
    repository.count(),
  ]);

  return { items, page, limit, total };
}

async function getById(id) {
  const record = await repository.findById(id);
  if (!record) throw new AppError('TrainingPrograms not found', 404);
  return record;
}

async function create(payload, actorUserId) {
  // TODO: attach owner/actor, trigger approval-engine submission if this entity
  // requires central approval (see modules/approvals).
  return repository.create(payload);
}

async function update(id, payload) {
  await getById(id);
  return repository.update(id, payload);
}

async function remove(id) {
  await getById(id);
  return repository.remove(id);
}

module.exports = { list, getById, create, update, remove };
