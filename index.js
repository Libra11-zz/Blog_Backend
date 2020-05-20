const Koa = require('koa')
const consola = require('consola')
const mongoose = require('mongoose')
const dbConfig = require('./DB/config')
const KoaRouter = require('koa-router');
const router = new KoaRouter();
const userRouter = require('./routers/user')
const blogRouter = require('./routers/blog')
const commentsRouter = require('./routers/comments')
const remoteSearchRouter = require('./routers/remote-search')
const path = require('path');
const cors = require('koa2-cors');
//引入json
const json = require('koa-json');
//配置静态图片 否则koa-multer上传图片后在浏览器无法查看图片
const staticFiles = require('koa-static');
//引入users数据表
const User = require('./DB/models/users');
//bodyparser:该中间件用于post请求的数据
const bodyParser = require('koa-bodyparser');
const check = require('./token/checkToken')
const app = new Koa()
//跨域问题解决
app.use(cors({
  origin: '*'
}));
app.use(bodyParser());
app.use(json());
app.use(check)
//注意 访问时不需要增加/static前缀
app.use(staticFiles(path.join(__dirname, '../static')));
//封装接口
router.use('/api/users', userRouter);
router.use('/api/blogs', blogRouter);
router.use('/api/comments', commentsRouter);
router.use('/api/remote-search', remoteSearchRouter);
//配置路由模块
app.use(router.routes()).use(router.allowedMethods());
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('数据库连接成功');
}).catch(() => {
  console.log('数据库连接失败');
})
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000
app.listen(port, host)
consola.ready({
  message: `Server listening on http://${host}:${port}`,
  badge: true
})
