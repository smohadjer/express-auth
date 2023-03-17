import express from 'express';
import login from './api/login.js';
import register from './api/register.js';
//import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

const port = 8000;
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

app.post('/api/login.js', (req, res) => {
  login(req, res);
});

app.post('/api/register.js', (req, res) => {
  register(req, res);
});
