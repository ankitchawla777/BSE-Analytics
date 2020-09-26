const { mongoose } = require('./db');

var StockSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    open: {
        type: Number,
        required: true
    },
    close: {
        type: Number,
        required: true
    }
})

var Stock = mongoose.model('Stocks', StockSchema);
module.exports = { Stock }