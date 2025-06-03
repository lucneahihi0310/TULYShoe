require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // domain của frontend
  credentials: true // nếu cần gửi cookie hoặc token
}));

app.get('/', async(req, res)=>{
    try {
        res.send({message: 'Hello World'});
    } catch (error) {
        res.send({error: error.message});
    }
});


app.use((req, res, next) => {
    const error = new Error('Path does not exist or is invalid!');
    error.status = 404;
    next(error);
});

app.use(require('./middlewares/errorHandler'));
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);
    connectDB();
});