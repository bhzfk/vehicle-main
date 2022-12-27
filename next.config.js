const withLess = require("next-with-less");
const nextConfig = {
  reactStrictMode: true,
  cssModules: false,
  images: {
    domains: ['fahrzeugtool.inosup.org']
  },
  env: {
    "API_URL": process.env.REACT_APP_API_ADDRESS,
    "SITE_URL": process.env.REACT_APP_SITE_ADDRESS
  }
}

module.exports = withLess(nextConfig)
