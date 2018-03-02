const _ = require("lodash");

module.exports = (params, opts = { stripUnknown: true }) => {
  return async (ctx, next) => {
    if (!_.isArray(params)) {
      ctx.throw(500, "Validation requires an array of query params");
    }

    params.forEach(param => {
      if (!ctx.query[param]) {
        ctx.throw(500, "Failed input validation");
      }
    });

    let passedParams = ctx.query;
    if (opts.stripUnknown) {
      passedParams = _.pick(passedParams, [...params, "curPage"]);
    }
    ctx.state.query = passedParams;
    await next();
  };
};
