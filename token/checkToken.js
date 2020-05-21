const jwt = require('jsonwebtoken');

const avoidVerifyUrl = [
  "/api/users/login",
  "/api/users/logout",
  "/api/blogs/getRecentBlog",
  "/api/blogs/getAllBlogsCount",
  "/api/blogs/getAllCategory",
  "/api/comments/publishComment",
  "/api/comments/replyComment",
]
//检查token是否过期
module.exports = async (ctx, next) => {
  let url = ctx.request.url;
  // 不用检查的接口
  if (!url.startsWith("/api") ||
    avoidVerifyUrl.includes(url) ||
    url.startsWith("/api/blogs/getBlogById") ||
    url.startsWith("/api/comments/getComments") ||
    url.startsWith("/api/blogs/getBlogsByCategory")
  ) {
    await next()
  } else {
    //拿到token
    const authorization = ctx.get('Authorization');
    if (authorization === '') {
      ctx.throw(401, 'no token detected in http headerAuthorization');
    }
    let tokenContent;
    try {
      tokenContent = await jwt.verify(authorization, 'Libra');//如果token过期或验证失败，将抛出错误
    } catch (err) {
      ctx.throw(401, 'invalid token');
    }
    await next();
  }
};
