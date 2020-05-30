const koaRouter = require('koa-router')
const router = new koaRouter()
const User = require('../DB/models/users')
const Blog = require('../DB/models/blogs')

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
//找到所有文章标签
const getAllTags = () => {
  return new Promise((resolve, reject) => {
    Blog.find({}, { tag: 1 }, (err, doc) => {
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
router.get('/getAllTags', async ctx => {
  let info = await getAllTags(ctx)
  if (!info) {
    ctx.status = 200
    ctx.body = {
      code: -1,
      res: '没有查询到标签'
    }
  } else {
    let res = []
    for (const item of info) {
      item.tag.forEach(element => {
        if (!res.includes(element)) {
          res.push(element)
        }
      });
    }
    ctx.status = 200;
    ctx.body = {
      code: 0,
      info: res
    };
  }
})
module.exports = router.routes()