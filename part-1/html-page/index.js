const Koa = require('koa');
const render = require('koa-ejs');
const Router = require("koa-router");
const path = require('path');

const app = new Koa();
const router = new Router();

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'index',
    viewExt: 'html',
    cache: false,
    debug: true
  });

router.get("hello", "/", (ctx) => {
    ctx.body = "<div><h1>Hello World, Koa folks!</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p></div>";
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`running on port ${PORT}`));