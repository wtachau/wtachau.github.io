var sslEnabled = true
const isLocal = !process.env._HANDLER 
const isDeploying = !!process.env.DEPLOYING

if (isLocal || isDeploying) {
  require('dotenv').load();
}
if (isLocal) {
  const sslEnabled = false
}

const express = require('express')
const app = express()
const path = require('path')
const port = 3000

const options = {
    publicDir  : path.join(__dirname, 'public')
  , viewsDir   : path.join(__dirname, 'views')
  , domain     : 's3-us-west-1.amazonaws.com/tachauwebsite'
  , bucket     : 'tachauwebsite'
  , endpoint: 's3-us-west-1.amazonaws.com'
  , key        : process.env.AWS_ACCESS_KEY_ID
  , secret     : process.env.AWS_SECRET_ACCESS_KEY
  , hostname   : 'localhost'
  , port       : (sslEnabled ? 443 : 1337)
  , ssl        : sslEnabled
  , production : true
}

const CDN = require('express-cdn')(app, options);

// app.set('view options', { layout: false, pretty: true });
// app.enable('view cache');
// app.use(express.bodyParser());

app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.locals.CDN = CDN();


app.get('/', (req, res) => {
  res.render('home')
})

if (isLocal && !isDeploying) {
  app.listen(port)
}

module.exports = app