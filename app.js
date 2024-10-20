const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cronReminder = require('./helpers/cronUserReminder')
const cors = require('cors');
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, 
}));
mongoose.set('strictQuery', false);

const users_routes = require('./routes/user');
const task_routes = require('./routes/task');
const authenticateToken = require('./middleware/auth');

mongoose.connect('mongodb+srv://'+process.env.DB_ACCESS+':'+process.env.DB_PASSWORD+'@cluster0.aoxy6.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connection to MongoDB successful !'))
  .catch(() => console.log('Connection to MongoDB failed !'));


app.listen(3001, () => {console.log('Server running on port 3000');});


app.use('/api/user', users_routes);
app.use('/api/task', task_routes);



app.get('/api/me', authenticateToken, (req, res) =>{
  res.send(req.user);
});

cronReminder.reminder()