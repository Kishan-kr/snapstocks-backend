
const sortMap = new Map([
  ["relevance", {views: -1, createdAt: -1}],
  ["newest", {createdAt: -1}],
  ["likes", {likes: -1, createdAt: -1}],
  ["downloads", {downloads: -1, createdAt: -1}],
])

module.exports = {sortMap};