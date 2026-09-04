const service = require('./site-settings.service');
const { success } = require('../../utils/apiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const getPublic = asyncHandler(async (req, res) => {
  const settings = await service.getPublicSettings();
  return success(res, settings);
});

const getAdmin = asyncHandler(async (req, res) => {
  const settings = await service.getAdminSettings();
  return success(res, settings);
});

const update = asyncHandler(async (req, res) => {
  const settings = await service.updateSettings(req.body, req.user && req.user.id);
  return success(res, settings, 'Site settings updated');
});

module.exports = { getPublic, getAdmin, update };
