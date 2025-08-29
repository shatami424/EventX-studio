// Simple pagination helper for APIs
function paginate(modelQuery, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  return modelQuery.skip(skip).limit(limit);
}

module.exports = paginate;
