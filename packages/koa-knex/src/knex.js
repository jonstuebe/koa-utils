const Knex = require("knex");

module.exports = (opts, key) => {
  return async (ctx, next) => {
    try {
      const knex = Knex(opts);
      key = key ? key : "knex";
      ctx[key] = knex;
      await next();
    } catch (error) {
      ctx.throw(500, error);
    }
  };
};
