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

app.use('/categories', require('./routes/category.route'));

app.use('/brands', require('./routes/brand.route'));

app.use('/colors', require('./routes/color.route'));

app.use('/forms', require('./routes/form.route'));

app.use('/materials', require('./routes/material.route'));

app.use('/sizes', require('./routes/size.route'));

app.use('/products', require('./routes/product.route'));

app.use('/product_details', require('./routes/product_detail.route'));

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