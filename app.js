const compression = require('compression');
const crypto = require('crypto');
const express = require("express");
var favicon = require('serve-favicon');
const routes = require("./routes.js")
const helmet = require("helmet");
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
app.use(compression({threshold:9}));
app.use(
	helmet.hsts(),
	helmet.noSniff(),
	helmet.hidePoweredBy(),
	helmet.referrerPolicy({
    policy:'same-origin',
  }),
  helmet.contentSecurityPolicy({
		"block-all-mixed-content":true,
    directives: {
			formAction:["'none'"],
			defaultSrc:["'none'"],
			frameAncestors:["'none'"],
	 		baseUri:["'self'"],
	 		objectSrc:["'self'"],
			manifestSrc:["'self'"],
			mediaSrc:["'self'", 'blob:'],
      "script-src": [
				"'self'",
	      "https://cdn.jsdelivr.net/npm/bootstrap.native@3.0.15/dist/bootstrap-native.min.js",
				`'nonce-${nonce}'`
    ],

      "style-src":[
			"'self'",
      "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css",
    ],
    },
  })
);

// CONFIG
app.all("*", redirect);
app.use(favicon(path.join(__dirname, 'public', '/img/favicon.ico')))
app.use(express.static(__dirname + "/public/"));
app.set("view engine", "pug");


//enable caching
app.use(function(req,res,next){
	res.set('Cache-control', 'public, max-age=300')
  next();
});


// SERVER
const server = app.listen(process.env.PORT || 3000, () => {
    console.log("The app is running on: " + environment)
});

if (environment === "production"){
	url = process.env.DB_URI
	console.log("In Production")
} else{
	console.log("In Development")
}

app.use("/", routes);

module.exports = server;
