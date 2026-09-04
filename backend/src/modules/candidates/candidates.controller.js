const service = require('./candidates.service');
const { success, paginated } = require('../../utils/apiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const { items, page, limit, total } = await service.list(req.query);
  return paginated(res, items, page, limit, total);
});

const getById = asyncHandler(async (req, res) => {
  const record = await service.getById(req.params.id);
  return success(res, record);
});

const create = asyncHandler(async (req, res) => {
  const record = await service.create(req.body, req.user && req.user.id);
  return success(res, record, 'Candidates created', 201);
});

const update = asyncHandler(async (req, res) => {
  const record = await service.update(req.params.id, req.body);
  return success(res, record, 'Candidates updated');
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  return success(res, null, 'Candidates deleted');
});

module.exports = { list, getById, create, update, remove };
