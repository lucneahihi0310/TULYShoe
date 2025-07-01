require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const morgan = require('morgan');
const cors = require('cors');
const { cleanExpiredTokens } = require('./config/cronJobs');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));

// Routes
app.get('/', async (req, res) => {
    try {
        res.send({ message: 'Hello World' });
    } catch (error) {
        res.send({ error: error.message });
    }
});

app.use('/account', require('./routes/account.route'));
app.use('/address', require('./routes/address_shipping.route'));
app.use('/manager', require('./routes/category.route'));
app.use('/inventory', require('./routes/inventory.routes'));
app.use('/orders', require('./routes/order.routes'));
app.use('/schedules', require('./routes/workSchedule.route'));
app.use('/notifications', require('./routes/notification.router'))
app.use('/upload', require('./routes/upload'))
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
        cleanExpiredTokens(); // Cronjob chỉ chạy khi server đã kết nối DB
    });
}).catch((error) => {
    console.error('MongoDB connection failed:', error);
});
