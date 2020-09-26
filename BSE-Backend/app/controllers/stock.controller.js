const {Stock} = require('../models/stock.model');

const stock = {
    list: async function(req, res) {
        let skip = req.query.skip ? req.query.skip *1 : 0;
        let limit = req.query.limit ? req.query.limit *1 : 30;
        let data = await Stock.find({}).sort('-date').skip(skip).limit(limit).lean().exec()
        .catch(function(err){
            console.log('err',err)
            return res.status(400).send({
              error: true,
              message: err.message
            });
          });
        return res.status(200).send({
            error: false,
            message: 'Data fetched successfully',
            data: data
          });
    },
    create: function(req,res,io) {
        let body = req.body;
        body.date = new Date();
        let stock = new Stock(body);
        stock
        .save()
        .then((err,data) => {
            if (!err) {
                return res.status(400).send({
                    error: true,
                    message: err.message
                    });
            } else {
                res.status(200).send({
                    error: false,
                    message: 'success',
                    data: data
                    });
                io.sockets.emit('newStock',data);
            }
        })
    },
    getAnalytics: async function(req,res) {
        let data = await Stock.aggregate([
            {
               $addFields:
                {
                    year: {$year: {date : "$date", timezone: "+05:30"}},
                    month: {$month: {date : "$date", timezone: "+05:30"}},
                    value: "$close"
                }
            },
            {
               $group:
                {
                    _id : {
                        month :"$month",
                        year :"$year"
                    },
                    month: {$first : "$month"},
                    avgValue: { $avg: "$value" } 
                },
            },
            {
                $sort : {
                    "_id.year" : 1,
                    month : 1
                } 
            },
            {
                $addFields: {
                    month: {
                        $let: {
                            vars: {
                                monthsInString: [,'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
                            },
                            in: {
                                $arrayElemAt: ['$$monthsInString', '$month']
                            }
                        }
                    }
                }
            }
        ]).exec().catch(function(err){
            console.log('err',err)
            return res.status(400).send({
              error: true,
              message: err.message
            });
        });
        res.status(200).send({
            error: false,
            message: 'success',
            data: data
        });
    }
}

module.exports = {
    stock
};