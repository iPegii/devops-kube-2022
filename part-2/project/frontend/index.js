const Koa = require('koa');
const render = require('koa-ejs');
const Router = require("koa-router");
const HttpStatus = require("http-status");
const path = require('path');
fs = require('fs');
var serve = require('koa-static');
const mime = require('mime-types')
const axios = require("axios")
const bodyParser = require('koa-bodyparser')

const app = new Koa();
const router = new Router();
app.use(bodyParser())

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layout',
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


router.get("hello", "/", async(ctx) => {
  const todos = await axios.get("http://backend-svc/todos")
  console.log("todos data: ", todos.data)
  await ctx.render('index', {todos: todos.data})
});

router.post("add todo", "/add-todo", async(ctx) => {
  const todoToPost = ctx.request.body.todo
  await axios.post("http://backend-svc/todos", {todo:todoToPost})
  console.log('added note')
  ctx.redirect("/")
});

app.use(serve(path.join(__dirname, filePath)))
app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`running on port ${PORT}`));