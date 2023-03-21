import express from 'express';
import login from './api/login.js';
import register from './api/register.js';
//import cors from 'cors';
import bodyParser from 'body-parser';

// fix for missing __dirname when using ES modules in node.js
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8000;
const authenticator = (req, res, next) => {
  console.log('authenticating...');
  const userIsAuthenticated = true;
  if (userIsAuthenticated) {
    next();
  } else {
    res.redirect('/login.html');
  }
}

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(authenticator);

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

app.post('/api/login.js', (req, res) => {
  login(req, res);
});

app.post('/api/register.js', (req, res) => {
  register(req, res);
});

app.get('/protected-page(.html)?', (req, res) => {
  console.log('User is logged in!');
  res.sendFile('./views/protected-page.html', { root: __dirname });
});

app.get('/*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});
