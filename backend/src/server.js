import express from 'express';

const app = express();
app.get('/health', (_, res) => res.send('OK'));

const PORT = process.env.PORT || 3000;   // Passenger ustawi PORT
app.listen(PORT, () => {
  console.log(`Server running on :${PORT}`);
});
