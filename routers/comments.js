const koaRouter = require('koa-router')
const router = new koaRouter()
const Comment = require('../DB/models/comments')
const ObjectID = require("mongodb").ObjectID;


//获取评论列表
const getComments = async (ctx) => {
  return new Promise((resolve, reject) => {
    Comment.find({ article_id: ctx.query.id }, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};
router.post('/replyComment', async ctx => {
  await new Promise((resolve, reject) => {
    Comment.updateOne({ _id: ObjectID(ctx.request.body.id) },
      {
        '$push': {
          otherComment: {
            name: ctx.request.body.name,
            replyer: ctx.request.body.replyer,
            content: ctx.request.body.content,
            avatar: ctx.request.body.avatar,
            email: ctx.request.body.email
          }
        }
      }, (err) => {
        if (err) {
          console.log(err)
          reject
        }
        ctx.status = 200
        ctx.body = {
          code: 0,
          res: '回复成功'
        }
        resolve()
      });
  })
})
router.post('/publishComment', async ctx => {
  let comment = new Comment({
    article_id: ctx.request.body.article_id,
    name: ctx.request.body.name,
    replyer: ctx.request.body.replyer,
    content: ctx.request.body.content,
    avatar: ctx.request.body.avatar,
    email: ctx.request.body.email
  })
  await new Promise((resolve, reject) => {
    comment.save((err) => {
      if (err) {
        console.log(err)
        reject
      }
      ctx.status = 200
      ctx.body = {
        code: 0,
        res: '评论成功'
      }
      resolve()
    })
  })
})
router.get('/getComments', async (ctx) => {
  let comments = await getComments(ctx)
  if (!comments) {
    ctx.status = 200
    ctx.body = {
      code: -1,
      res: '没有评论'
    }
  } else {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      comments
    };
  }
})

module.exports = router.routes()