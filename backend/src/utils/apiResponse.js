// Consistent API response envelope used across every module.
function success(res, data = null, message = 'OK', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

function paginated(res, items, page, limit, total, message = 'OK') {
  return res.status(200).json({
    success: true,
    message,
    data: items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

function error(res, message = 'Something went wrong', statusCode = 400, errors = null) {
  return res.status(statusCode).json({ success: false, message, errors });
}

module.exports = { success, paginated, error };
