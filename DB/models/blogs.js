const mongoose = require('mongoose')
const Schema = mongoose.Schema
const BlogSchema = new Schema({
  // blog title
  title: {
    type: String,
    required: true
  },
  // blog keyword (SEO)
  keyword: [{
    type: String,
    default: ''
  }],
  // blog author (only me)
  author: {
    type: String,
    default: ''
  },
  // blog description (display on the blog card)
  desc: {
    type: String,
    default: ''
  },
  // blog content
  content: {
    type: String,
    required: true
  },
  // number of words
  numbers: {
    type: Number,
    default: 0
  },
  // surface plot
  headerPic: {
    type: String,
    required: true
  },
  // blog tag
  tag: {
    type: Array,
    require: true
  },
  // blog category
  category: {
    type: String,
    require: true
  },
  pubTime: {
    type: Date,
    required: true
  },
  upTime: {
    type: Date,
    required: true
  },
  // some other meta data
  meta: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
  },
})
module.exports = mongoose.model('Blogs', BlogSchema)