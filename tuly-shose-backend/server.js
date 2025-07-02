require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const morgan = require('morgan');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173', // domain của frontend
    credentials: true // nếu cần gửi cookie hoặc token
}));
app.use(morgan('dev'));

app.get('/', async (req, res) => {
    try {
        res.send({ message: 'Hello World' });
    } catch (error) {
        res.send({ error: error.message });
    }
});

app.use('/account', require('./routes/account.route'));

app.use('/manager', require('./routes/category.route'));

app.use('/manager', require('./routes/brand.route'));

app.use('/manager', require('./routes/color.route'));

app.use('/manager', require('./routes/form.route'));

app.use('/manager', require('./routes/material.route'));

app.use('/manager', require('./routes/size.route'));

app.use('/manager', require('./routes/product.route'));

app.use('/manager', require('./routes/product_detail.route'));

//-----------------------------------------------------------


app.use((req, res, next) => {
    const error = new Error('Path does not exist or is invalid!');
    error.status = 404;
    next(error);
});

app.use(require('./middlewares/errorHandler'));
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});