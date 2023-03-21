require('dotenv').config();

const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

const posts = [
  {
    username: 'zhang',
    title: 'post 1',
  },
  {
    username: 'chen',
    title: 'post 2',
  },
];

app.use(express.json()); // use json from body

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // 'Bearer Token'
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

app.listen(3000);
