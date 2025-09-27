const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const express = require('express');
const cors = require('cors');

const agentController = require('./controllers/agentController');

const geminiApiKey = defineSecret('GEMINI_API_KEY');

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
    credentials: true,
  })
);
app.use(express.json());

const rateBuckets = new Map();
function rateLimiter(limit = 60, windowMs = 60 * 1000) {
  return (req, res, next) => {
    const key = req.ip || 'anonymous';
    const now = Date.now();
    const bucket = rateBuckets.get(key) || { count: 0, start: now };
    if (now - bucket.start > windowMs) {
      bucket.count = 0;
      bucket.start = now;
    }
    bucket.count += 1;
    rateBuckets.set(key, bucket);
    if (bucket.count > limit) {
      return res.status(429).json({ success: false, error: 'Too many requests' });
    }
    return next();
  };
}

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Agent API is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Agent API is running',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/agent/act', rateLimiter(30, 60 * 1000), agentController.act);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

exports.api = onRequest({
  secrets: [geminiApiKey],
}, app);
