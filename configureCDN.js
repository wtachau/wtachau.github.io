import path from 'path'
import expressCDN from 'express-cdn'

export default (app, isLocal) => {
  return expressCDN(app, {
    publicDir  : path.join(__dirname, 'public'),
    viewsDir   : path.join(__dirname, 'views'),
    domain     : 's3-us-west-1.amazonaws.com/tachauwebsite',
    bucket     : 'tachauwebsite',
    endpoint   : 's3-us-west-1.amazonaws.com',
    key        : process.env.AWS_ACCESS_KEY_ID,
    secret     : process.env.AWS_SECRET_ACCESS_KEY,
    hostname   : 'localhost',
    port       : (isLocal ? 1337 : 443),
    ssl        : !isLocal,
    production : true
  })
}