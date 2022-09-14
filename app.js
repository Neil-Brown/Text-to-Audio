//const bodyParser = require('body-parser');
//const compression = require('compression');
const crypto = require('crypto');
const express = require("express");
//const session = require('express-session');
//const MongoStore = require('connect-mongo');
//var favicon = require('serve-favicon');
//const mongoose = require('mongoose');
const routes = require("./routes.js")
//const helmet = require("helmet");
var path = require('path')

const environment = process.env.NODE_ENV || 3000;

function redirect(req, res, next){
		let host = req.headers.host;
	if(!process.env.PORT){
	  return next();
	}

	if (req.headers["x-forwarded-proto"] !== "https"){
		return res.redirect(301, "https://" + req.hostname + req.url);
	} else if(host.match(/^www\..*/i)){
		return res.redirect(301, "https://" + host.replace("www.", "") + req.url);
	}

	next();
  };

const app = express();
const nonce = crypto.randomBytes(16).toString('base64')
app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
  next();
});
// app.use(compression({threshold:9}));
// app.use(
// 	helmet.hsts(),
// 	helmet.noSniff(),
// 	helmet.hidePoweredBy(),
// 	helmet.referrerPolicy({
//     policy:'same-origin',
//   }),
//   helmet.contentSecurityPolicy({
// 		"block-all-mixed-content":true,
//     directives: {
// 			formAction:["'none'"],
// 			defaultSrc:["'none'"],
// 			frameAncestors:["'none'"],
// 	 		baseUri:["'self'"],
// 	 		objectSrc:["'none'"],
// 			manifestSrc:["'self'"],
//       "script-src": [
// 				"'self'",
// 	      "https://cdn.jsdelivr.net/npm/bootstrap.native@3.0.15/dist/bootstrap-native.min.js",
// 	      "https://cdnjs.cloudflare.com/ajax/libs/tone/13.4.9/Tone.min.js",
// 				"https://cdn.jsdelivr.net/npm/share-buttons/dist/share-buttons.js",
// 	      "https://www.gstatic.com/charts/",
// 	      "https://www.gstatic.com/charts/loader.js",
// 				"https://unpkg.com/@tonejs/midi",
// 				"https://pagead2.googlesyndication.com",
// 				"'sha256-3HIhz7IN6fkgeZ3peJ/BWmJvzOJIXiw+SnewA7gKH9g='",
// 				"'sha256-wSgeFsO6HgEoYktih2uLNbFp1Jh6KX7DdXwFahB7rhQ='", // Share functions
// 				"'sha256-AmuvbQetZlEP5WH+Kwi35dbnJYaPK59V6owQW2sfWOY='", // resource loader
// 				`'nonce-${nonce}'`
//     ],
//
//       "style-src":[
// 			"'self'",
//       "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css",
//       "https://fonts.googleapis.com/",
//       "https://www.gstatic.com/charts/51/css/core/tooltip.css",
//       "https://www.gstatic.com/charts/51/css/util/util.css",
// 			"https://pagead2.googlesyndication.com",
// 			"'unsafe-inline'"
//     ],
//     "font-src":["https://fonts.gstatic.com/"],
//     "child-src": ["blob: *"],
// 		"img-src": [
// 			"'self'",
// 			"data:",
// 			"https://pagead2.googlesyndication.com"
// 		],
// 		"connect-src":[
// 			"'self'",
// 			"https://www.google-analytics.com",
// 			"https://pagead2.googlesyndication.com"
// 		]
//     },
//   })
// );

// CONFIG
app.all("*", redirect);
//app.use(favicon(path.join(__dirname, 'public', '/img/favicon.ico')))
app.use(express.static(__dirname + "/public/"));
app.set("view engine", "pug");


// //enable caching
// app.use(function(req,res,next){
// 	res.set('Cache-control', 'public, max-age=300')
//   next();
// });


// parse incoming requests
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended:true}));
// SERVER

const server = app.listen(process.env.PORT || 3000, () => {
    console.log("The app is running on: " + environment)
});

//db
//let url = `mongodb+srv://admin:${process.env.MONGO_ATLAS_PASSWORD}@cluster0.riamtlv.mongodb.net/?retryWrites=true&w=majority`
let url = "mongodb://127.0.0.1:27017/eartrainer"
if (environment === "production"){
	url = process.env.DB_URI
	console.log("In Production")
} else{
	console.log("In Development")
}

// mongoose.connect(url, {useNewUrlParser: true });
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log("Connected to db");
// });

// app.use(session({
// 	 secret: 'keyboard cat',
// 	 resave:true,
// 	 saveUninitialized:false,
// 	 store: MongoStore.create({ mongoUrl: url, ttl: 24 * 60 * 60})
//  }))

 //template variables
 // app.use(function(req,res,next){
 // 	res.locals.userId = req.session.userId || null
 // 	app.locals.nonce = nonce
 //   next();
 // });
app.use("/", routes);

module.exports = server;
