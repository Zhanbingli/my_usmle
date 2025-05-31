export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Medical AI Platform API is running',
    timestamp: new Date().toISOString()
  });
} 