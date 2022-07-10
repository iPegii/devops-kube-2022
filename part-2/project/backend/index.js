const Koa = require('koa');
const render = require('koa-ejs');
const Router = require("koa-router");
const HttpStatus = require("http-status");
const path = require('path');
fs = require('fs');
const axios = require('axios')
const bodyParser = require('koa-bodyparser')
const Pool = require('pg').Pool

const app = new Koa();
const router = new Router();
app.use(bodyParser())

const connectionString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@postgres-svc:5432/${process.env.POSTGRES_DB}`

const pool = new Pool({
  connectionString
});

const initializeDatabase = async() => {
  const client = await pool.connect()
  try {
    const result = await client.query('CREATE TABLE IF NOT EXISTS todos (id serial PRIMARY KEY, todo VARCHAR(140) NOT NULL);')
    client.release()
  } catch(err) {
    console.log("Error initializing database: ", err)
  }
}
initializeDatabase()

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const imageFilePath = path.join(directory, 'daily_image.jpg')
const timeDataFilePath = path.join(directory, 'time.txt')

const fetchDailyImage = async() => {
  await fs.promises.mkdir(directory, { recursive: true })
  let imageTimeData = null
  if(fs.existsSync(timeDataFilePath) === true) {
    const timeData = await fs.readFileSync(timeDataFilePath, 'utf-8');
    timeData.split(/\r?\n/).forEach(line =>  {
      console.log(line)
      imageTimeData = Date.parse(line)
    })
    if(imageTimeData - Date.now() > 3600 * 1000 * 24){
      const image = await axios.get("https://picsum.photos/1200.jpg",{responseType:"stream"})
      image.data.pipe(fs.createWriteStream(imageFilePath))
      await fs.writeFile(timeDataFilePath, image.headers.date, (err) => {
        if(err) throw err
        console.log("written")
      });
     }
    } else {
      const image = await axios.get("https://picsum.photos/1200.jpg",{responseType:"stream"})
      image.data.pipe(fs.createWriteStream(imageFilePath))
      await fs.writeFile(timeDataFilePath, image.headers.date, (err) => {
        if(err) throw err
        console.log("written")
      });
    }
}

fetchDailyImage()

var todos = ["Make a nice website", "Learn Kubernetes", "Be fast", "Just do it"]

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'index',
    viewExt: 'html',
    cache: false,
    debug: true
  });

router.get("hello", "/", async(ctx,next) => {
    ctx.body = "<div><h1>This is a random string with date</h1></div>";
    ctx.status = HttpStatus.OK;
    await next();
});

router.post("add todos", "/todos", async(ctx) => {
  const data = ctx.request.body.todo
  console.log("todo sent to backend: ", ctx.request)
  console.log("length: ", data.length)
  todos = todos.concat(data)
  if(data.length > 140) {
    ctx.status = 400
  } else {
  const client = await pool.connect()
  try {
    const result = await client.query('INSERT INTO todos(todo) VALUES ($1) RETURNING *', [data])
    console.log("Todo inserted to backend: ", result)
    client.release()
  } catch(err) {
    console.log("Error adding todo: ", err)
  }
  ctx.status = 200
}
})
  
router.get("get todos", "/todos", async(ctx) => {
  const client = await pool.connect()
  try {
    const result = await client.query('SELECT todo FROM todos')
    console.log(result)
    const todos = result.rows.map(row => {
      return row.todo
    })
    client.release()
    ctx.body = todos;
    ctx.status = 200
  } catch(err) {
    console.log("Error fetching todo: ", err)
    ctx.body = "<div>Error fetching todos</div>";
    ctx.status = 404
  }
})

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`running on port ${PORT}`));