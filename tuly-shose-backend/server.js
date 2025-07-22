require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const morgan = require('morgan');
const cors = require('cors');
const { cleanExpiredTokens } = require('./config/cronJobs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.set('trust proxy', 1);

app.use(
    cors({
        origin: ["http://localhost:5173", "https://tulyshoe-front.onrender.com"],
        credentials: true,
    })
);

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
app.use('/support', require('./routes/support.route'));
app.use('/categories', require('./routes/category.route'));
app.use('/brands', require('./routes/brand.route'));
app.use('/colors', require('./routes/color.route'));
app.use('/forms', require('./routes/form.route'));
app.use('/materials', require('./routes/material.route'));
app.use('/sizes', require('./routes/size.route'));
app.use('/genders', require('./routes/gender.route'));
app.use('/discounts', require('./routes/discount.route'));
app.use('/product_detail_status', require('./routes/product_detail_status.route'));
app.use('/product_details', require('./routes/product_detail.route'));
app.use('/staff/inventory', require('./routes/inventory.routes'));
app.use('/staff/orders', require('./routes/order.routes'));
app.use('/staff/schedules', require('./routes/workSchedule.route'));
app.use('/staff/notifications', require('./routes/notification.router'));
app.use('/upload', require('./routes/upload'));

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

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        cleanExpiredTokens();
    });
}).catch((error) => {
    console.error('MongoDB connection failed:', error);
});