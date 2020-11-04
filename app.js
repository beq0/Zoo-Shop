const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productRoute = require('./routes/product.route');
const historyRoute = require('./routes/sellHistory.route');
const parameterRoute = require('./routes/parameter.route');
const bodyParser = require("body-parser");
const cors = require('cors');
const frontendApp = require('./public/App');
const path = require("path");


mongoose.connect('mongodb://localhost/zoo_shop', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}, (error) => {
  if(!error) console.log('Connected to DB!');
  else console.log(error);
});

const app = express();

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Product routes
app.use('/api/product', productRoute);

// History routes
app.use('/api/history', historyRoute);

// Parameter routes
app.use('/api/parameter', parameterRoute);

// catch 404 
app.use('/api/*', (req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

function returnFrontendApp(req, res) {
  const { html } = frontendApp.render({ url: req.url });

  res.write(`
    <!DOCTYPE html>

    <meta charset='utf-8'>
    
    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">
    <link rel="icon" href="images/fav.png" sizes="16x16" type="image/png">
    <title>ზოო-მაღაზია</title>

    <link rel='stylesheet' href='/global.css'>
    <link rel='stylesheet' href='/bundle.css'>

    <script src="/xlsx.full.min.js"></script>
    <script src="/materialize.min.js"></script>
    
    <link rel="stylesheet" href="/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">


    <div id="app">${html}</div>
    <script src="/bundle.js"></script>
  `);

  res.end();
}

app.get('/', returnFrontendApp);
app.get('/home', returnFrontendApp);
app.get('/products', returnFrontendApp);
app.get('/history', returnFrontendApp);
app.get('/parameter', returnFrontendApp);

app.get('*', (req, res) => {
  res.write(`
    <!DOCTYPE html>

    <style>
      *{
        transition: all 0.6s;
      }
      
      html {
        height: 100%;
      }
      
      body{
        font-family: 'Lato', sans-serif;
        color: #888;
        margin: 0;
      }
      
      #main{
        display: table;
        width: 100%;
        height: 100vh;
        text-align: center;
      }
      
      .fof{
        display: table-cell;
        vertical-align: middle;
      }
      
      .fof h1{
        font-size: 50px;
        display: inline-block;
        padding-right: 12px;
        animation: type .5s alternate infinite;
      }
      
      @keyframes type{
        from{box-shadow: inset -3px 0px 0px #888;}
        to{box-shadow: inset -3px 0px 0px transparent;}
      }
    </style>

    <div id="main">
    	<div class="fof">
        		<h1>Error 404</h1>
    	</div>
    </div>
  `);

  res.end();
})

mongoose.set('useFindAndModify', false);

module.exports = app;