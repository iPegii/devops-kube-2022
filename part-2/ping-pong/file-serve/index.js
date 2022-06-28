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
const Pool = require('pg').Pool

const app = new Koa();
const router = new Router();

/*
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
*/

//generateAndLoopString()
const connectionString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@postgres-svc:5432/${process.env.POSTGRES_DB}`

const pool = new Pool({
  connectionString
});

const initializeDatabase = async() => {
  const client = await pool.connect()
  try {
    const result = await client.query('CREATE TABLE IF NOT EXISTS pingpong (id serial PRIMARY KEY, counter INT NOT NULL);')
    client.release()
  } catch(err) {
    console.log("Error initializing database: ", err)
  }
  try {
    const result = await client.query('SELECT EXISTS(SELECT 1 FROM pingpong WHERE id = 1);')
    client.release()
    console.log("initDatabase: ", result)
    if(result.rows[0]) {
      const result2 = await client.query('INSERT INTO pingpong(counter) VALUES (0);')
      client.release()
    }
  } catch(err) {
    console.log("Error initializing database: ", err)
  }
}

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
  initializeDatabase()

router.get("hello", "/", async(ctx,next) => {
    ctx.body = "<div><h1>This page of no content</h1><p>Whoops.</p></div>";
    ctx.status = HttpStatus.OK;
    await next();
});

router.get("pingpong", "/pingpong", async(ctx,next) => {
  const client = await pool.connect()
  try {
    const result = await client.query('SELECT counter FROM pingpong WHERE id=1;')
    client.release()
    console.log(result)
    var counter = result.rows[0].counter
    ctx.status = HttpStatus.OK
    counter = counter + 1
    const result2 = await cliet.query('UPDATE pingpong SET counter = $1 WHERE id=1 RETURNING *',[counter])
    client.release()
    console.log(result2)
    ctx.body = "<div><h1>Ping pong</h1><p>"+ counter +"</p></div>";
  } catch(err) {
    console.log("error retrieving counter before increasing: ", err)
    ctx.status = HttpStatus.NOT_FOUND
    ctx.body = "Not found"
  }
});

router.get("get pingpong", "/get-pingpongs", async(ctx,next) => {
  const client = await pool.connect()
  try {
    const result = await client.query('SELECT counter FROM pingpong WHERE id=1;')
    client.release()
    console.log(result)
    ctx.status = HttpStatus.OK
    ctx.body = result.rows[0].counter
  } catch(err) {
    console.log("error in /get-pingpong", err)
    ctx.status = HttpStatus.NOT_FOUND
    ctx.body = "Not found"
  }
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`running on port ${PORT}`));