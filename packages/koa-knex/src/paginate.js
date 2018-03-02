module.exports = async (ctx, next) => {
  if (!ctx.state.knex) {
    ctx.throw(500, "Missing Knex Query");
    await next();
  }

  const maxPage = ctx.state.query.maxPage
    ? parseInt(ctx.state.query.maxPage)
    : 5;
  const curPage = ctx.state.query.curPage
    ? parseInt(ctx.state.query.curPage)
    : 1;

  const totalResults = await ctx.state.knex.base
    .clone()
    .count("*")
    .then(total => {
      return total[0].count;
    });
  const offset = curPage * maxPage;
  const totalPages = Math.floor(totalResults / maxPage);

  const results = await ctx.state.knex.base
    .modify(ctx.state.knex.query)
    .limit(maxPage)
    .offset(offset);

  const buildQueryParams = (overrides = {}) => {
    let query = Object.assign({}, ctx.state.query, overrides);
    let params = [];

    for (const param in query) {
      params.push(`${param}=${query[param]}`);
    }
    return params.join("&");
  };

  const url = `${ctx.request.origin}${ctx.request.path}`;
  const prevPage =
    curPage === 1
      ? null
      : `${url}?${buildQueryParams({
          curPage: curPage - 1
        })}`;
  const nextPage =
    curPage === totalPages
      ? null
      : `${url}?${buildQueryParams({
          curPage: curPage + 1
        })}`;

  ctx.body = {
    prevPage,
    nextPage,
    totalPages,
    totalResults,
    results
  };
};
