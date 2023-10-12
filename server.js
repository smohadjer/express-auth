import express from 'express';
import cookieParser from 'cookie-parser';
import login from './api/login.js';
import register from './api/register.js';

const app = express();
const port = 8000;

// for static assets and publicly accessible pages
app.use(express.static('public'));

// for parsing forms data such as forms sent via application/x-www-form-urlencoded or application/json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

// api routes
app.post('/api/login', (req, res) => {
  login(req, res);
});

app.post('/api/register', (req, res) => {
  register(req, res);
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('loggedIn');
  res.redirect('/login.html');
});

// middleware for cookie-based authentication
const authenticator = (req, res, next) => {
  console.log('authenticating...');
  console.log(req.cookies.loggedIn);

  if (req.cookies && req.cookies.loggedIn) {
    next();
  } else {
    res.redirect('/login.html');
  }
}

const testMiddleware = (req, res, next) => {
  console.log('a second middleware...');
  next();
}

app.use(authenticator);
app.use(testMiddleware);

/*
app.get('/protected(.html)?', (req, res) => {
  res.sendFile('protected.html', {root: './private'});
});

app.get('/private(.html)?', (req, res) => {
  res.sendFile('private.html', {root: './private'});
});
*/

app.get('/private/*', (req, res) => {
  res.sendFile(req.url, { root: '.'});
});

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile('404.html', {root: './public'});
  } else if (req.accepts('json')) {
    res.json({ "error": "404 Not Found" });
  } else {
    res.type('txt').send("404 Not Found");
  }
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

