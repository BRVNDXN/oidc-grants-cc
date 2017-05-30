const express 	   = require('express'),
	  app 	  	   = express(),
	  bodyParser   = require('body-parser'),
	  cookieParser = require('cookie-parser'),
	  jwt 		   = require('express-jwt');
	  jwksRsa 	   = require('jwks-rsa'),
	  jwtAuthz     = require('express-jwt-authz');

// Support JSON-encoded bodies
app.use(bodyParser.json({
  limit: '5mb'
}));
// Support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '5mb'
}));
// Parse cookies
app.use(cookieParser());
// Parse request params like in Express 3.0
app.use( require('request-param')() );

// Authentication middleware. When used, the
// access token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and 
  // the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://bthompson.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.API_ID,
  issuer: `https://bthompson.auth0.com/`,
  algorithms: ['RS256']
});

const checkScopes = jwtAuthz([ 'read:messages' ]);

// app.get('/api/private', checkJwt, checkScopes, function(req, res) {
app.get('/api/private', checkJwt, function(req, res) {
  res.json({ 
    message: "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this." 
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});