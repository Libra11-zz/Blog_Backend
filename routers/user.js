const koaRouter = require('koa-router')
const router = new koaRouter()
//下面这两个包用来生成时间
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');
//用于密码加密
const sha1 = require('sha1');
const User = require('../DB/models/users')
const createToken = require('../token/createToken')

//数据库的操作
//根据用户名查找用户
const findUser = (userName) => {
  return new Promise((resolve, reject) => {
    User.findOne({ userName }, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};
//找到所有用户
const findAllUsers = () => {
  return new Promise((resolve, reject) => {
    User.find({}, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};
//删除某个用户
const delUser = function (id) {
  return new Promise((resolve, reject) => {
    User.findOneAndRemove({ _id: id }, err => {
      if (err) {
        reject(err);
      }
      console.log('删除用户成功');
      resolve();
    });
  });
};
//获得所有用户信息
const GetAllUsers = async (ctx) => {
  //查询所有用户信息
  let doc = await findAllUsers();
  ctx.status = 200;
  ctx.body = {
    code: 0,
    res: doc
  };
};

//删除某个用户
const DelUser = async (ctx) => {
  //拿到要删除的用户id
  let id = ctx.request.body.id;
  await delUser(id);
  ctx.status = 200;
  ctx.body = {
    code: -1,
    res: '删除成功'
  };
};
//根据token查询用户
const getInfoByToken = async (ctx) => {
  let token = ctx.query.token;
  return new Promise((resolve, reject) => {
    User.findOne({ token }, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};
router.get('/getInfoByToken', async ctx => {
  let info = await getInfoByToken(ctx)
  if (!info) {
    ctx.status = 200
    ctx.body = {
      code: -1,
      res: '用户不存在'
    }
  } else {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      info
    };
  }
})
router.post('/login', async ctx => {
  let userName = ctx.request.body.userName
  let password = sha1(ctx.request.body.password) //解密
  let doc = await findUser(userName)
  if (!doc) {
    ctx.status = 200;
    ctx.body = {
      code: -1,
      res: '用户名不存在'
    }
  } else if (doc.password === password) {
    //生成一个新的token,并存到数据库
    let token = createToken(userName);
    doc.token = token;
    let newDoc = new User(doc)
    await new Promise((resolve, reject) => {
      newDoc.save((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
    ctx.status = 200;
    ctx.body = {
      code: 0,
      userName,
      token, //登录成功要创建一个新的token,应该存入数据库
      create_time: doc.create_time
    };
  } else {
    ctx.status = 200;
    ctx.body = {
      code: -1,
      res: '密码错误'
    };
  }
})
router.post('/register', async ctx => {
  console.log(ctx.request.body)
  let user = new User({
    userName: ctx.request.body.userName,
    password: sha1(ctx.request.body.password), //加密
    token: createToken(this.userName), //创建token并存入数据库
    create_time: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
  });
  let doc = await findUser(user.userName);
  if (doc) {
    ctx.status = 200;
    ctx.body = {
      code: -1,
      res: '用户名已经存在'
    };
  } else {
    await new Promise((resolve, reject) => {
      user.save((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
    ctx.status = 200;
    ctx.body = {
      code: 0,
      res: '注册成功'
    }
  }
})
router.post('/logout', async (ctx) => {
  try {
    // 跳转到登录页或网站首页
    ctx.status = 200;
    ctx.body = {
      code: 0,
      res: '退出成功'
    }
  } catch (err) {
    ctx.status = 200;
    ctx.body = {
      code: -1,
      res: '退出失败'
    }
    throw new Error(err)
  }
})
module.exports = router.routes()