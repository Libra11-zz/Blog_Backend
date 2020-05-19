const koaRouter = require('koa-router')
const router = new koaRouter()
const User = require('../DB/models/users')

//找到所有管理员用户
const findAllAdminUsers = () => {
  return new Promise((resolve, reject) => {
    User.find({ isAdmin: { $in: true } }, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};
router.get('/getAllAdminUsers', async ctx => {
  let info = await findAllAdminUsers(ctx)
  if (!info) {
    ctx.status = 200
    ctx.body = {
      code: -1,
      res: '没有查询到管理员用户'
    }
  } else {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      info
    };
  }
})
module.exports = router.routes()