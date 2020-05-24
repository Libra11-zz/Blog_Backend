const koaRouter = require('koa-router')
const router = new koaRouter()
const Blog = require('../DB/models/blogs')
const ObjectID = require("mongodb").ObjectID;

//获取最近Blog
const getRecentBlog = async (ctx) => {
  return new Promise((resolve, reject) => {
    Blog.find({}, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    }).limit(10).sort({ pubTime: -1 });
  });
};
//获取全部Blog（分页）
const getAllBlogs = async (ctx) => {
  let { page, limit } = ctx.request.query;
  return new Promise((resolve, reject) => {
    Blog.find({}, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    }).limit(Number(limit))
      .skip((page - 1) * limit)
      .exec();
  });
};
//获取全部Blog
const getAllBlog = async (ctx) => {
  return new Promise((resolve, reject) => {
    Blog.find({}, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    }).sort({ pubTime: -1 })
  });
};
//获取全部Blog数量
const getAllBlogsCount = async (ctx) => {
  let { page, limit } = ctx.request.query;
  return new Promise((resolve, reject) => {
    Blog.find({}, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    })
  });
};
// 根据Id获取blog详情
const getBlogById = async (ctx) => {
  return new Promise((resolve, reject) => {
    Blog.find({ _id: ObjectID(ctx.query.id) }, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  })
};
// 获取所有分类
const getAllCategory = async (ctx) => {
  return new Promise((resolve, reject) => {
    Blog.find({}, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    }).distinct("category").exec();
  })
};
// 根据分类获取博客列表
const getBlogsByCategory = async (ctx) => {
  return new Promise((resolve, reject) => {
    Blog.find({ category: ctx.query.category }, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    }).limit(8).skip((ctx.query.pageNum - 1) * 8)
  })
};
router.post('/publishBlog', async ctx => {
  let blog = new Blog({
    title: ctx.request.body.title,
    author: ctx.request.body.author,
    desc: ctx.request.body.content_short,
    content: ctx.request.body.content,
    numbers: ctx.request.body.content.length,
    headerPic: ctx.request.body.image_uri,
    tag: ctx.request.body.tag,
    category: ctx.request.body.category,
    pubTime: ctx.request.body.pubTime,
    upTime: ctx.request.body.upTime
  })
  await new Promise((resolve, reject) => {
    blog.save((err) => {
      if (err) {
        console.log(err)
        reject
      }
      ctx.status = 200
      ctx.body = {
        code: 0,
        res: '发布成功'
      }
      resolve()
    })
  })
})
router.get('/getRecentBlog', async ctx => {
  let blogs = await getRecentBlog(ctx)
  if (!blogs) {
    ctx.status = 200
    ctx.body = {
      code: -1,
      res: '没有查到文章'
    }
  } else {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      blogs,
      total: blogs.length,
    };
  }
})
router.get('/getAllCategory', async ctx => {
  let blogs = await getAllCategory(ctx)
  if (!blogs) {
    ctx.status = 200
    ctx.body = {
      code: -1,
      res: '没有查到文章'
    }
  } else {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      data: blogs,
    };
  }
})
router.get('/getBlogsByCategory', async ctx => {
  let blogs = await getBlogsByCategory(ctx)
  let total = await Blog.countDocuments({ category: ctx.query.category })
  if (!blogs) {
    ctx.status = 200
    ctx.body = {
      code: -1,
      res: '没有查到文章'
    }
  } else {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      data: blogs,
      total: total
    };
  }
})
router.get('/getAllBlogs', async ctx => {
  let blogs = await getAllBlogs(ctx)
  if (!blogs) {
    ctx.status = 200
    ctx.body = {
      code: -1,
      res: '没有查到文章'
    }
  } else {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      total: blogs.length,
      blogs
    };
  }
})
router.get('/getAllBlog', async ctx => {
  let blogs = await getAllBlog(ctx)
  if (!blogs) {
    ctx.status = 200
    ctx.body = {
      code: -1,
      res: '没有查到文章'
    }
  } else {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      blogs
    };
  }
})
router.get('/getAllBlogsCount', async ctx => {
  let blogs = await getAllBlogsCount(ctx)
  if (!blogs) {
    ctx.status = 200
    ctx.body = {
      code: -1,
      res: '没有查到文章'
    }
  } else {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      total: blogs.length,
    };
  }
})
router.get('/getBlogById', async (ctx) => {
  let blog = await getBlogById(ctx)
  if (!blog) {
    ctx.status = 200
    ctx.body = {
      code: -1,
      res: '没有查到文章内容'
    }
  } else {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      blog
    };
  }
})

module.exports = router.routes()