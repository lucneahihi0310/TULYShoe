require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const morgan = require('morgan');
const cors = require('cors');
const { cleanExpiredTokens } = require('./config/cronJobs');


app.use(
    cors({
        origin: ["http://localhost:5173", "https://tulyshoe-front.onrender.com"],
        credentials: true,
    })
);
app.use(morgan('dev'));

app.get('/', async (req, res) => {
    try {
        res.send({ message: 'Hello World' });
    } catch (error) {
        res.send({ error: error.message });
    }
});

app.use('/account', require('./routes/account.route'));
app.use('/address', require('./routes/address_shipping.route'));
app.use('/products', require('./routes/product.route'));
app.use('/productDetail', require('./routes/productDetail.route'));
app.use('/orders', require('./routes/order.route'));
app.use('/orderDetail', require('./routes/orderDetail.route'));
app.use('/cartItem', require('./routes/cartItem.route'));
app.use('/api/filters', require('./routes/filter.route'));
app.use('/reviews', require('./routes/review.route'));
app.use("/vnpay", require("./routes/vnpay.route"));


app.use('/manager', require('./routes/category.route'));


app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /

Sitemap: https://tulyshoe.onrender.com/sitemap.xml`);
});
app.use('/sitemap.xml', require('./routes/sitemap.route'));
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
    cleanExpiredTokens(); // Start cron job to clean expired reset tokens
});