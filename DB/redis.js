const { Redis } = require("@upstash/redis")

const redis = new Redis({
    url: "https://strong-rabbit-48805.upstash.io",
    token: "Ab6lAAIjcDExMmYzZmJlMmVkYzQ0ZjNlYjMyZjFiM2I4N2FmMzdhYXAxMA",
  })
module.exports = {redis};