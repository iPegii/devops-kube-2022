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
fs = require('fs');

const app = new Koa();
const router = new Router();


const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'random.txt')
const pongDirectory = path.join('/', 'usr', 'src', 'app', 'files')
const pongFilePath = path.join(pongDirectory, 'pong.txt')
var dateTime = ""
const generateAndLoopString = async () => {
  var numberOfPingPongs = 0
  await fs.promises.mkdir(pongDirectory, { recursive: true })
  if(fs.existsSync(pongFilePath) === true) {
  console.log("something happens")
  const pongContents = await fs.readFileSync(pongFilePath, 'utf-8');
  pongContents.split(/\r?\n/).forEach(line =>  {
    console.log(line)
    numberOfPingPongs = parseInt(line)
  })
  }
  console.log(numberOfPingPongs)
  await fs.promises.mkdir(directory, { recursive: true })
  const randomString = Math.random().toString(12)
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds();
  dateTime = date+' '+time + ": " + randomString + "\r\n" + "Ping / Pongs: " + numberOfPingPongs + "\r\n";
  fs.appendFile(filePath, dateTime, (err) => {
    if(err) throw err
    console.log("written")
  });
  console.log(dateTime)
  setTimeout(generateAndLoopString,5000)
}

const writeToPingPong = async() => {
  await fs.promises.mkdir(pongDirectory, { recursive: true })
  var numberOfPingPongs = 0
  if(fs.existsSync(pongFilePath) === true) {
    console.log('reads')
  const pongContents = await fs.readFileSync(pongFilePath, 'utf-8');
  pongContents.split(/\r?\n/).forEach(line =>  {
    console.log('generator-reading-stream: ', line)
    numberOfPingPongs = parseInt(line)
  })
}
console.log('generator-read-old: ', numberOfPingPongs)
  numberOfPingPongs = numberOfPingPongs + 1
  console.log('generator-read-new: ', numberOfPingPongs)
  await fs.writeFile(pongFilePath, numberOfPingPongs.toString(), (err) => {
    if(err) throw err
    console.log("written")
  });
  return numberOfPingPongs
}

generateAndLoopString()

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

router.get("hello", "/", async(ctx,next) => {
    ctx.body = "<div><h1>This is a random string with date</h1><p>"+ dateTime +"</p></div>";
    ctx.status = HttpStatus.OK;
    await next();
});

router.get("pingpong", "/pingpong", async(ctx,next) => {
  ctx.status = HttpStatus.OK;
  const counter = await writeToPingPong()
  ctx.body = "<div><h1>Ping pong</h1><p>"+ counter +"</p></div>";
  await next();
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`running on port ${PORT}`));