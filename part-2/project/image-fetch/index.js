const Koa = require('koa');
const render = require('koa-ejs');
const Router = require("koa-router");
const HttpStatus = require("http-status");
const path = require('path');
fs = require('fs');
var serve = require('koa-static');
const mime = require('mime-types')

const app = new Koa();
const router = new Router();

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: true
  });

const todos = ["Make a nice website", "Learn Kubernetes", "Be fast", "Just do it"]

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'daily_image.jpg')


router.get("get-image", "/get-image", async(ctx) => {
  var mimeType = mime.lookup(filePath);
  const src = fs.createReadStream(filePath);
  ctx.response.set("content-type", mimeType);
  ctx.response.set("content-disposition", "attachment; filename=daily_image.jpg");
  ctx.body = src;
ctx.status = 200
})

router.get("hello", "/", async(ctx) => {
  await ctx.render('index', {todos: todos})
});
app.use(serve(path.join(__dirname, filePath)))
app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`running on port ${PORT}`));