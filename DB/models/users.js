const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = mongoose.Schema({
  userName: String,
  password: String,
  token: String,
  create_time: Date,
  isAdmin: {
    type: Boolean, //是否是管理员 
    default: false //默认false 管理员身份修改数据库即可
  },
});

module.exports = mongoose.model('Users', UserSchema)