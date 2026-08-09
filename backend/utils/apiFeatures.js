/**
 * utils/apiFeatures.js
 * ----------------------
 * Small chainable helper for building the GET /api/items query:
 * text search, field filtering, sorting, and pagination.
 *
 * Usage:
 *   const features = new ApiFeatures(Item.find(), req.query)
 *     .search(['title', 'description'])
 *     .filter()
 *     .sort()
 *     .paginate();
 *   const items = await features.query;
 */

class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search(fields = []) {
    if (this.queryString.q && fields.length) {
      const regex = new RegExp(this.queryString.q, 'i');
      this.query = this.query.find({
        $or: fields.map((field) => ({ [field]: regex })),
      });
    }
    return this;
  }

  filter() {
    const excluded = ['q', 'sort', 'page', 'limit', 'fields'];
    const queryObj = { ...this.queryString };
    excluded.forEach((field) => delete queryObj[field]);
    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 20;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
