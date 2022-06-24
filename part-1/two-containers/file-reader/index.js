const Koa = require('koa');
const render = require('koa-ejs');
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const Logger = require("koa-logger");
const cors = require('koa-cors');
const HttpStatus = require("http-status");
const path = require('path');
fs = require('fs');

const app = new Koa();
const router = new Router();


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

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'random.txt')

const readFile = async()=> {
  const {
    createHash
  } = await import('node:crypto');
  var fullText = "<div><h1>This is a random string with date and hash</h1>" + htmlBody + "</div>"
  var htmlBody = ""
  const allFileContents = fs.readFileSync(filePath, 'utf-8');
  lineCounter = 0
  allFileContents.split(/\r?\n/).forEach(line =>  {
    console.log(`Line from file: ${line}`);
    if(lineCounter === 0) {
    var hashText = ""
    const hash = createHash('sha256');
    hashText = hash.update(line)
    .digest('hex');
    htmlTextTemplate = "<div>---<p>"+ line +"</p><p>"+ hashText +"</p>---</div>" 
    htmlBody = htmlBody.concat(htmlTextTemplate + "\r\n")
    fullText = fullText.concat(htmlBody)
    counter = 1
    } else {
      fullText = fullText.concat("<div><p>" + line + "</p></div>")
      counter = 0
    }
  })
  return fullText
}

router.get("hello", "/", async(ctx,next) => {
  console.log('router')
  ctx.body = await readFile()
  ctx.status = HttpStatus.OK;
  await next();
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`running on port ${PORT}`));