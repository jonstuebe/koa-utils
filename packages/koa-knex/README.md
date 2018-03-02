# Koa Knex

A set of middleware and helper functions to simplify working with Knex inside of Koa.

## Install

using yarn:

```shell
yarn add @jonstuebe/koa-knex
```

or npm:

```shell
npm i --save @jonstuebe/koa-knex
```

## Usage

```javascript
const Koa = require("koa");
const {
  knex,
  requireParams,
  transformParams,
  paginate,
  stringToArray
} = require("@jonstuebe/koa-knex");

const app = new Koa();

app.use(
  knex({
    client: "pg",
    connection: process.env.DATABASE_URL
  })
);

app
  .use(requireParams(["fields"]))
  .use(transformParams("fields", stringToArray))
  .use(async (ctx, next) => {
    ctx.state.knex = {
      base: ctx.knex("users"),
      query: query => {
        return query.select(ctx.state.query.fields);
      }
    };
    await next();
  })
  .use(paginate);

app.listen(3000, () => {
  console.log(`listening at http://localhost:3000`);
});
```
