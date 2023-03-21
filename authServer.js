require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

let refreshTokens = [];

app.use(express.json()); // use json from body

app.post('/token', (req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken == null) return res.sendStatus(401);

  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken({ name: user.name });

    res.json({ accessToken });
  });
});

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post('/login', (req, res) => {
  // auth
  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

app.listen(4000);
