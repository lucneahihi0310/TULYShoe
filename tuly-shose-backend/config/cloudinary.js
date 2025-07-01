const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dp8lgundu',
  api_key: '852675917116556',
  api_secret: '4CqRv214VOH3-_uAu32CWai7AJg',
});

module.exports = { cloudinary };
