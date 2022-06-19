const Koa = require('koa');
const render = require('koa-ejs');
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const Logger = require("koa-logger");
const cors = require('koa-cors');
const serve = require("koa-static");
const mount = require("koa-mount");
const HttpStatus = require("http-status");
const path = require('path');

const app = new Koa();
const router = new Router();


const generateAndLoopString = () => {

  const randomString = Math.random().toString(12)
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds();
  var dateTime = date+' '+time + ": " + randomString;
  console.log(dateTime)
  return dateTime
}

const timeoutLoop = () => {
  setTimeout(generateAndLoopString,5000)
}
timeoutLoop()

generateAndLoopString()


app.use(BodyParser());
app.use(Logger());
app.use(cors());

var counter = 0

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'index',
    viewExt: 'html',
    cache: false,
    debug: true
  });

router.get("hello", "/", async(ctx,next) => {
    ctx.body = "<div><h1>This is a random string with date</h1><p>"+ generateAndLoopString() +"</p></div>";
    ctx.status = HttpStatus.OK;
    await next();
});

router.get("pingpong", "/pingpong", async(ctx,next) => {
  ctx.status = HttpStatus.OK;
  counter = counter + 1
  ctx.body = "<div><h1>Ping pong</h1><p>"+ counter +"</p></div>";
  await next();
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`running on port ${PORT}`));