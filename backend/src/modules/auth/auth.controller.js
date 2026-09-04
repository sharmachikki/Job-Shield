const service = require('./auth.service');
const { success } = require('../../utils/apiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const result = await service.register(req.body);
  return success(res, result, 'Registration successful', 201);
});

const login = asyncHandler(async (req, res) => {
  const result = await service.login(req.body);
  return success(res, result, 'Login successful');
});

const refresh = asyncHandler(async (req, res) => {
  const result = await service.refresh(req.body.refreshToken);
  return success(res, result, 'Token refreshed');
});

module.exports = { register, login, refresh };
