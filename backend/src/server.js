const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/users', userRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
