const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 评论模型
const commentSchema = new mongoose.Schema({
  // 评论所在的文章 id
  article_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  replyer: {
    type: String,
    required: true,
    default: 'Blogger'
  },
  createTime: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: 'https://libra321.oss-cn-huhehaote.aliyuncs.com/avatar.jpg'
  },
  email: {
    type: String
  },
  content: {
    type: String,
    required: true,
    validate: /\S+/
  },
  // 第三者评论
  otherComment: [
    {
      name: {
        type: String,
        required: true
      },
      replyer: {
        type: String,
        required: true
      },
      createTime: {
        type: Date,
        default: Date.now
      },
      isRead: {
        type: Boolean,
        default: false
      },
      email: {
        type: String
      },
      content: {
        type: String,
        required: true,
        validate: /\S+/
      },
      avatar: {
        type: String,
        default: 'https://libra321.oss-cn-huhehaote.aliyuncs.com/avatar.jpg'
      },
    },
  ],
});

module.exports = mongoose.model('Comments', commentSchema);