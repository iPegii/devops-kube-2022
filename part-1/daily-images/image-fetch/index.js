const Koa = require('koa');
const render = require('koa-ejs');
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const Logger = require("koa-logger");
const cors = require('koa-cors');
const HttpStatus = require("http-status");
const path = require('path');
fs = require('fs');
const mount = require('koa-mount')
var serve = require('koa-static');
const mime = require('mime-types')

const app = new Koa();
const router = new Router();

app.use(BodyParser());
app.use(Logger());
app.use(cors());

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'index',
    viewExt: 'html',
    cache: false,
    debug: true
  });

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

router.get("hello", "/", async(ctx,next) => {
  ctx.body = `<div><h1>This is the image of the day</h1><img src="/get-image" alt="daily image"></img></div>`
  ctx.status = HttpStatus.OK;
  await next();
});
app.use(serve(path.join(__dirname, filePath)))
app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`running on port ${PORT}`));