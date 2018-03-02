const _ = require("lodash");

module.exports = (params, transform) => {
  return async (ctx, next) => {
    if (!_.isArray(params)) {
      params = [params];
    }
    params.forEach(param => {
      if (!ctx.state.query[param]) {
        ctx.throw(500, "param does not exist");
      }
      ctx.state.query[param] = transform(ctx.state.query[param]);
    });

    await next();
  };
};
