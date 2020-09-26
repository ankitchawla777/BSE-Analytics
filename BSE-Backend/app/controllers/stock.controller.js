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

// (async ()=>{
//     let data = [
//         {
//           "date": "1-Jan-18",
//           "open": 10983.51,
//           "close": 10902.6
//         },
//         {
//           "date": "2-Jan-18",
//           "open": 10932.14,
//           "close": 10891.2
//         },
//         {
//           "date": "3-Jan-18",
//           "open": 10927.1,
//           "close": 10893.89
//         },
//         {
//           "date": "4-Jan-18",
//           "open": 10930.53,
//           "close": 10958.75
//         },
//         {
//           "date": "5-Jan-18",
//           "open": 10978.28,
//           "close": 11021.69
//         },
//         {
//           "date": "8-Jan-18",
//           "open": 11043.29,
//           "close": 11089.03
//         },
//         {
//           "date": "9-Jan-18",
//           "open": 11110.87,
//           "close": 11105.85
//         },
//         {
//           "date": "10-Jan-18",
//           "open": 11132.13,
//           "close": 11099.28
//         },
//         {
//           "date": "11-Jan-18",
//           "open": 11110.38,
//           "close": 11118.83
//         },
//         {
//           "date": "12-Jan-18",
//           "open": 11141.25,
//           "close": 11146.29
//         },
//         {
//           "date": "15-Jan-18",
//           "open": 11176.57,
//           "close": 11211.49
//         },
//         {
//           "date": "16-Jan-18",
//           "open": 11227.52,
//           "close": 11175.27
//         },
//         {
//           "date": "17-Jan-18",
//           "open": 11175.34,
//           "close": 11265.1
//         },
//         {
//           "date": "18-Jan-18",
//           "open": 11340.73,
//           "close": 11287.45
//         },
//         {
//           "date": "19-Jan-18",
//           "open": 11312.71,
//           "close": 11370.96
//         },
//         {
//           "date": "22-Jan-18",
//           "open": 11399.55,
//           "close": 11451.42
//         },
//         {
//           "date": "23-Jan-18",
//           "open": 11477.89,
//           "close": 11565.5
//         },
//         {
//           "date": "24-Jan-18",
//           "open": 11574.48,
//           "close": 11570.11
//         },
//         {
//           "date": "25-Jan-18",
//           "open": 11583.81,
//           "close": 11539.81
//         },
//         {
//           "date": "29-Jan-18",
//           "open": 11557.24,
//           "close": 11604.76
//         },
//         {
//           "date": "30-Jan-18",
//           "open": 11603.11,
//           "close": 11528.6
//         },
//         {
//           "date": "31-Jan-18",
//           "open": 11509.49,
//           "close": 11506.88
//         },
//         {
//           "date": "1-Feb-18",
//           "open": 11533.76,
//           "close": 11492.93
//         },
//         {
//           "date": "2-Feb-18",
//           "open": 11433.48,
//           "close": 11223.13
//         },
//         {
//           "date": "5-Feb-18",
//           "open": 11116.2,
//           "close": 11131.25
//         },
//         {
//           "date": "6-Feb-18",
//           "open": 10818.93,
//           "close": 10948.3
//         },
//         {
//           "date": "7-Feb-18",
//           "open": 11065.22,
//           "close": 10918.68
//         },
//         {
//           "date": "8-Feb-18",
//           "open": 10954.24,
//           "close": 11026.92
//         },
//         {
//           "date": "9-Feb-18",
//           "open": 10895.4,
//           "close": 10910.74
//         },
//         {
//           "date": "12-Feb-18",
//           "open": 10968.86,
//           "close": 10992.24
//         },
//         {
//           "date": "14-Feb-18",
//           "open": 11038.41,
//           "close": 10955.5
//         },
//         {
//           "date": "15-Feb-18",
//           "open": 10975.31,
//           "close": 11003.66
//         },
//         {
//           "date": "16-Feb-18",
//           "open": 11043.34,
//           "close": 10904.87
//         },
//         {
//           "date": "19-Feb-18",
//           "open": 10918.77,
//           "close": 10824.48
//         },
//         {
//           "date": "20-Feb-18",
//           "open": 10861.31,
//           "close": 10814.84
//         },
//         {
//           "date": "21-Feb-18",
//           "open": 10850.86,
//           "close": 10856.65
//         },
//         {
//           "date": "22-Feb-18",
//           "open": 10844.21,
//           "close": 10839.48
//         },
//         {
//           "date": "23-Feb-18",
//           "open": 10848.71,
//           "close": 10947.46
//         },
//         {
//           "date": "26-Feb-18",
//           "open": 10977.6,
//           "close": 11048.06
//         },
//         {
//           "date": "27-Feb-18",
//           "open": 11083.37,
//           "close": 11017.7
//         },
//         {
//           "date": "28-Feb-18",
//           "open": 10951.23,
//           "close": 10959.52
//         },
//         {
//           "date": "1-Mar-18",
//           "open": 10947.99,
//           "close": 10920.73
//         },
//         {
//           "date": "5-Mar-18",
//           "open": 10914.35,
//           "close": 10816.08
//         },
//         {
//           "date": "6-Mar-18",
//           "open": 10901.72,
//           "close": 10700.26
//         },
//         {
//           "date": "7-Mar-18",
//           "open": 10687.8,
//           "close": 10613.1
//         },
//         {
//           "date": "8-Mar-18",
//           "open": 10675.06,
//           "close": 10697.36
//         },
//         {
//           "date": "9-Mar-18",
//           "open": 10728.87,
//           "close": 10683.77
//         },
//         {
//           "date": "12-Mar-18",
//           "open": 10734.19,
//           "close": 10879.19
//         },
//         {
//           "date": "13-Mar-18",
//           "open": 10849.57,
//           "close": 10883.81
//         },
//         {
//           "date": "14-Mar-18",
//           "open": 10850.37,
//           "close": 10880.17
//         },
//         {
//           "date": "15-Mar-18",
//           "open": 10878.81,
//           "close": 10828.17
//         },
//         {
//           "date": "16-Mar-18",
//           "open": 10829.21,
//           "close": 10664.19
//         },
//         {
//           "date": "19-Mar-18",
//           "open": 10688.8,
//           "close": 10560.97
//         },
//         {
//           "date": "20-Mar-18",
//           "open": 10534.2,
//           "close": 10583.97
//         },
//         {
//           "date": "21-Mar-18",
//           "open": 10618.12,
//           "close": 10620.28
//         },
//         {
//           "date": "22-Mar-18",
//           "open": 10640.38,
//           "close": 10578.02
//         },
//         {
//           "date": "23-Mar-18",
//           "open": 10461.6,
//           "close": 10457.25
//         },
//         {
//           "date": "26-Mar-18",
//           "open": 10441.43,
//           "close": 10598.48
//         },
//         {
//           "date": "27-Mar-18",
//           "open": 10639.12,
//           "close": 10651.19
//         },
//         {
//           "date": "28-Mar-18",
//           "open": 10627.49,
//           "close": 10591.7
//         },
//         {
//           "date": "2-Apr-18",
//           "open": 10616.31,
//           "close": 10683.88
//         },
//         {
//           "date": "3-Apr-18",
//           "open": 10665.39,
//           "close": 10715.5
//         },
//         {
//           "date": "4-Apr-18",
//           "open": 10742.27,
//           "close": 10597.7
//         },
//         {
//           "date": "5-Apr-18",
//           "open": 10681.39,
//           "close": 10791.67
//         },
//         {
//           "date": "6-Apr-18",
//           "open": 10793.71,
//           "close": 10804
//         },
//         {
//           "date": "9-Apr-18",
//           "open": 10818.06,
//           "close": 10852.61
//         },
//         {
//           "date": "10-Apr-18",
//           "open": 10888.08,
//           "close": 10882.03
//         },
//         {
//           "date": "11-Apr-18",
//           "open": 10909.8,
//           "close": 10892.44
//         },
//         {
//           "date": "12-Apr-18",
//           "open": 10905.32,
//           "close": 10938.92
//         },
//         {
//           "date": "13-Apr-18",
//           "open": 10963.91,
//           "close": 10967.65
//         },
//         {
//           "date": "16-Apr-18",
//           "open": 10894.36,
//           "close": 11012.61
//         },
//         {
//           "date": "17-Apr-18",
//           "open": 11036.26,
//           "close": 11039.15
//         },
//         {
//           "date": "18-Apr-18",
//           "open": 11058.38,
//           "close": 11022.71
//         },
//         {
//           "date": "19-Apr-18",
//           "open": 11043.83,
//           "close": 11060.4
//         },
//         {
//           "date": "20-Apr-18",
//           "open": 11058.31,
//           "close": 11062.87
//         },
//         {
//           "date": "23-Apr-18",
//           "open": 11090.41,
//           "close": 11073.66
//         },
//         {
//           "date": "24-Apr-18",
//           "open": 11073.8,
//           "close": 11105.15
//         },
//         {
//           "date": "25-Apr-18",
//           "open": 11098.7,
//           "close": 11054.92
//         },
//         {
//           "date": "26-Apr-18",
//           "open": 11065.78,
//           "close": 11115.93
//         },
//         {
//           "date": "27-Apr-18",
//           "open": 11128.53,
//           "close": 11188.63
//         },
//         {
//           "date": "30-Apr-18",
//           "open": 11207.67,
//           "close": 11244.63
//         },
//         {
//           "date": "2-May-18",
//           "open": 11293.19,
//           "close": 11217.36
//         },
//         {
//           "date": "3-May-18",
//           "open": 11238.36,
//           "close": 11178.49
//         },
//         {
//           "date": "4-May-18",
//           "open": 11191.05,
//           "close": 11120.57
//         },
//         {
//           "date": "7-May-18",
//           "open": 11144.51,
//           "close": 11212.9
//         },
//         {
//           "date": "8-May-18",
//           "open": 11252.5,
//           "close": 11220.25
//         },
//         {
//           "date": "9-May-18",
//           "open": 11207.92,
//           "close": 11241.63
//         },
//         {
//           "date": "10-May-18",
//           "open": 11253.41,
//           "close": 11216.82
//         },
//         {
//           "date": "11-May-18",
//           "open": 11234.93,
//           "close": 11314.19
//         },
//         {
//           "date": "14-May-18",
//           "open": 11320.5,
//           "close": 11309.36
//         },
//         {
//           "date": "15-May-18",
//           "open": 11300.66,
//           "close": 11306.81
//         },
//         {
//           "date": "16-May-18",
//           "open": 11279.16,
//           "close": 11253.89
//         },
//         {
//           "date": "17-May-18",
//           "open": 11283.26,
//           "close": 11190.84
//         },
//         {
//           "date": "18-May-18",
//           "open": 11189.49,
//           "close": 11090.84
//         },
//         {
//           "date": "21-May-18",
//           "open": 11097.01,
//           "close": 11011.38
//         },
//         {
//           "date": "22-May-18",
//           "open": 11004.09,
//           "close": 11030.03
//         },
//         {
//           "date": "23-May-18",
//           "open": 11024.87,
//           "close": 10918.68
//         },
//         {
//           "date": "24-May-18",
//           "open": 10939.78,
//           "close": 11003.08
//         },
//         {
//           "date": "25-May-18",
//           "open": 11032.52,
//           "close": 11102.24
//         },
//         {
//           "date": "28-May-18",
//           "open": 11156.65,
//           "close": 11185.05
//         },
//         {
//           "date": "29-May-18",
//           "open": 11197.34,
//           "close": 11124.5
//         },
//         {
//           "date": "30-May-18",
//           "open": 11100.66,
//           "close": 11107.59
//         },
//         {
//           "date": "31-May-18",
//           "open": 11156.26,
//           "close": 11227.57
//         },
//         {
//           "date": "1-Jun-18",
//           "open": 11245.94,
//           "close": 11193.7
//         },
//         {
//           "date": "4-Jun-18",
//           "open": 11272.69,
//           "close": 11124.42
//         },
//         {
//           "date": "5-Jun-18",
//           "open": 11128.17,
//           "close": 11086.32
//         },
//         {
//           "date": "6-Jun-18",
//           "open": 11096.19,
//           "close": 11182.05
//         },
//         {
//           "date": "7-Jun-18",
//           "open": 11210.18,
//           "close": 11267.18
//         },
//         {
//           "date": "8-Jun-18",
//           "open": 11249.19,
//           "close": 11270.05
//         },
//         {
//           "date": "11-Jun-18",
//           "open": 11276.41,
//           "close": 11288.62
//         },
//         {
//           "date": "12-Jun-18",
//           "open": 11303.35,
//           "close": 11347.12
//         },
//         {
//           "date": "13-Jun-18",
//           "open": 11388.1,
//           "close": 11365.31
//         },
//         {
//           "date": "14-Jun-18",
//           "open": 11365,
//           "close": 11319.12
//         },
//         {
//           "date": "15-Jun-18",
//           "open": 11335,
//           "close": 11322.9
//         },
//         {
//           "date": "18-Jun-18",
//           "open": 11347.15,
//           "close": 11305.38
//         },
//         {
//           "date": "19-Jun-18",
//           "open": 11304.69,
//           "close": 11219.84
//         },
//         {
//           "date": "20-Jun-18",
//           "open": 11233.35,
//           "close": 11285.59
//         },
//         {
//           "date": "21-Jun-18",
//           "open": 11313.57,
//           "close": 11247.22
//         },
//         {
//           "date": "22-Jun-18",
//           "open": 11246.53,
//           "close": 11329.62
//         },
//         {
//           "date": "25-Jun-18",
//           "open": 11353.1,
//           "close": 11267.95
//         },
//         {
//           "date": "26-Jun-18",
//           "open": 11232.04,
//           "close": 11278.63
//         },
//         {
//           "date": "27-Jun-18",
//           "open": 11293.46,
//           "close": 11181.87
//         },
//         {
//           "date": "28-Jun-18",
//           "open": 11173.47,
//           "close": 11097.91
//         },
//         {
//           "date": "29-Jun-18",
//           "open": 11125.17,
//           "close": 11224.18
//         },
//         {
//           "date": "2-Jul-18",
//           "open": 11259.57,
//           "close": 11172.54
//         },
//         {
//           "date": "3-Jul-18",
//           "open": 11194.34,
//           "close": 11215.21
//         },
//         {
//           "date": "4-Jul-18",
//           "open": 11217.23,
//           "close": 11285.66
//         },
//         {
//           "date": "5-Jul-18",
//           "open": 11300.99,
//           "close": 11263.69
//         },
//         {
//           "date": "6-Jul-18",
//           "open": 11256.83,
//           "close": 11285.61
//         },
//         {
//           "date": "9-Jul-18",
//           "open": 11337.85,
//           "close": 11369.17
//         },
//         {
//           "date": "10-Jul-18",
//           "open": 11413.12,
//           "close": 11464.41
//         },
//         {
//           "date": "11-Jul-18",
//           "open": 11479.84,
//           "close": 11470.32
//         },
//         {
//           "date": "12-Jul-18",
//           "open": 11527.17,
//           "close": 11547.86
//         },
//         {
//           "date": "13-Jul-18",
//           "open": 11576.38,
//           "close": 11537.23
//         },
//         {
//           "date": "16-Jul-18",
//           "open": 11565.38,
//           "close": 11459.42
//         },
//         {
//           "date": "17-Jul-18",
//           "open": 11483.58,
//           "close": 11535.52
//         },
//         {
//           "date": "18-Jul-18",
//           "open": 11595.35,
//           "close": 11500.65
//         },
//         {
//           "date": "19-Jul-18",
//           "open": 11538.47,
//           "close": 11480.44
//         },
//         {
//           "date": "20-Jul-18",
//           "open": 11487.73,
//           "close": 11529.45
//         },
//         {
//           "date": "23-Jul-18",
//           "open": 11538.38,
//           "close": 11597.66
//         },
//         {
//           "date": "24-Jul-18",
//           "open": 11640.19,
//           "close": 11653.12
//         },
//         {
//           "date": "25-Jul-18",
//           "open": 11681.52,
//           "close": 11651.15
//         },
//         {
//           "date": "26-Jul-18",
//           "open": 11668.85,
//           "close": 11687.55
//         },
//         {
//           "date": "27-Jul-18",
//           "open": 11764.3,
//           "close": 11802.36
//         },
//         {
//           "date": "30-Jul-18",
//           "open": 11847.41,
//           "close": 11845.01
//         },
//         {
//           "date": "31-Jul-18",
//           "open": 11857.5,
//           "close": 11882.71
//         },
//         {
//           "date": "1-Aug-18",
//           "open": 11898.32,
//           "close": 11870.19
//         },
//         {
//           "date": "2-Aug-18",
//           "open": 11873.86,
//           "close": 11772.03
//         },
//         {
//           "date": "3-Aug-18",
//           "open": 11825.48,
//           "close": 11883.89
//         },
//         {
//           "date": "6-Aug-18",
//           "open": 11928.69,
//           "close": 11914.71
//         },
//         {
//           "date": "7-Aug-18",
//           "open": 11963.35,
//           "close": 11912.16
//         },
//         {
//           "date": "8-Aug-18",
//           "open": 11942.63,
//           "close": 11975.82
//         },
//         {
//           "date": "9-Aug-18",
//           "open": 12016.6,
//           "close": 12007
//         },
//         {
//           "date": "10-Aug-18",
//           "open": 12017.24,
//           "close": 11959.43
//         },
//         {
//           "date": "13-Aug-18",
//           "open": 11911.43,
//           "close": 11889.62
//         },
//         {
//           "date": "14-Aug-18",
//           "open": 11921.32,
//           "close": 11965.06
//         },
//         {
//           "date": "16-Aug-18",
//           "open": 11952.06,
//           "close": 11913.95
//         },
//         {
//           "date": "17-Aug-18",
//           "open": 11982.35,
//           "close": 12007.54
//         },
//         {
//           "date": "20-Aug-18",
//           "open": 12046.5,
//           "close": 12097
//         },
//         {
//           "date": "21-Aug-18",
//           "open": 12123.03,
//           "close": 12109.85
//         },
//         {
//           "date": "23-Aug-18",
//           "open": 12150.17,
//           "close": 12132.31
//         },
//         {
//           "date": "24-Aug-18",
//           "open": 12142.87,
//           "close": 12102.92
//         },
//         {
//           "date": "27-Aug-18",
//           "open": 12171.3,
//           "close": 12242.52
//         },
//         {
//           "date": "28-Aug-18",
//           "open": 12282.18,
//           "close": 12292.2
//         },
//         {
//           "date": "29-Aug-18",
//           "open": 12320.28,
//           "close": 12240.59
//         },
//         {
//           "date": "30-Aug-18",
//           "open": 12263.69,
//           "close": 12225.07
//         },
//         {
//           "date": "31-Aug-18",
//           "open": 12233.55,
//           "close": 12230.81
//         },
//         {
//           "date": "3-Sep-18",
//           "open": 12312.9,
//           "close": 12132.77
//         },
//         {
//           "date": "4-Sep-18",
//           "open": 12174.64,
//           "close": 12061.7
//         },
//         {
//           "date": "5-Sep-18",
//           "open": 12072.38,
//           "close": 12012.79
//         },
//         {
//           "date": "6-Sep-18",
//           "open": 12058.38,
//           "close": 12070.66
//         },
//         {
//           "date": "7-Sep-18",
//           "open": 12096.99,
//           "close": 12129.11
//         },
//         {
//           "date": "10-Sep-18",
//           "open": 12119.13,
//           "close": 11975.66
//         },
//         {
//           "date": "11-Sep-18",
//           "open": 12010.4,
//           "close": 11808.04
//         },
//         {
//           "date": "12-Sep-18",
//           "open": 11844.43,
//           "close": 11900.63
//         },
//         {
//           "date": "14-Sep-18",
//           "open": 11969.77,
//           "close": 12040.94
//         },
//         {
//           "date": "17-Sep-18",
//           "open": 12019.78,
//           "close": 11896.72
//         },
//         {
//           "date": "18-Sep-18",
//           "open": 11917.37,
//           "close": 11799.52
//         },
//         {
//           "date": "19-Sep-18",
//           "open": 11848.04,
//           "close": 11749.86
//         },
//         {
//           "date": "21-Sep-18",
//           "open": 11801.8,
//           "close": 11653.94
//         },
//         {
//           "date": "24-Sep-18",
//           "open": 11686.53,
//           "close": 11468.7
//         },
//         {
//           "date": "25-Sep-18",
//           "open": 11479.82,
//           "close": 11565.89
//         },
//         {
//           "date": "26-Sep-18",
//           "open": 11661.29,
//           "close": 11542.99
//         },
//         {
//           "date": "27-Sep-18",
//           "open": 11587.8,
//           "close": 11469.08
//         },
//         {
//           "date": "28-Sep-18",
//           "open": 11511.14,
//           "close": 11418.76
//         },
//         {
//           "date": "1-Oct-18",
//           "open": 11434.2,
//           "close": 11513.21
//         },
//         {
//           "date": "3-Oct-18",
//           "open": 11532.02,
//           "close": 11356.77
//         },
//         {
//           "date": "4-Oct-18",
//           "open": 11304.87,
//           "close": 11084.73
//         },
//         {
//           "date": "5-Oct-18",
//           "open": 11041.24,
//           "close": 10798.92
//         },
//         {
//           "date": "8-Oct-18",
//           "open": 10808.56,
//           "close": 10825.32
//         },
//         {
//           "date": "9-Oct-18",
//           "open": 10878.3,
//           "close": 10770.95
//         },
//         {
//           "date": "10-Oct-18",
//           "open": 10833.01,
//           "close": 10932.12
//         },
//         {
//           "date": "11-Oct-18",
//           "open": 10704.66,
//           "close": 10709.28
//         },
//         {
//           "date": "12-Oct-18",
//           "open": 10803.15,
//           "close": 10940.38
//         },
//         {
//           "date": "15-Oct-18",
//           "open": 11018.07,
//           "close": 10989.67
//         },
//         {
//           "date": "16-Oct-18",
//           "open": 11035.37,
//           "close": 11074.4
//         },
//         {
//           "date": "17-Oct-18",
//           "open": 11189.48,
//           "close": 10933.7
//         },
//         {
//           "date": "19-Oct-18",
//           "open": 10875.7,
//           "close": 10775.01
//         },
//         {
//           "date": "22-Oct-18",
//           "open": 10885.01,
//           "close": 10718.81
//         },
//         {
//           "date": "23-Oct-18",
//           "open": 10654.76,
//           "close": 10620.12
//         },
//         {
//           "date": "24-Oct-18",
//           "open": 10734.1,
//           "close": 10703.86
//         },
//         {
//           "date": "25-Oct-18",
//           "open": 10626.12,
//           "close": 10593
//         },
//         {
//           "date": "26-Oct-18",
//           "open": 10617.5,
//           "close": 10493.16
//         },
//         {
//           "date": "29-Oct-18",
//           "open": 10557.03,
//           "close": 10725.41
//         },
//         {
//           "date": "30-Oct-18",
//           "open": 10733.91,
//           "close": 10679.66
//         },
//         {
//           "date": "31-Oct-18",
//           "open": 10701.97,
//           "close": 10871.49
//         },
//         {
//           "date": "1-Nov-18",
//           "open": 10936.33,
//           "close": 10864.04
//         },
//         {
//           "date": "2-Nov-18",
//           "open": 10963.02,
//           "close": 11033.9
//         },
//         {
//           "date": "5-Nov-18",
//           "open": 11063.23,
//           "close": 11003.79
//         },
//         {
//           "date": "6-Nov-18",
//           "open": 11040.89,
//           "close": 11002.21
//         },
//         {
//           "date": "7-Nov-18",
//           "open": 11095.42,
//           "close": 11078.82
//         },
//         {
//           "date": "9-Nov-18",
//           "open": 11091.27,
//           "close": 11062.46
//         },
//         {
//           "date": "12-Nov-18",
//           "open": 11097.33,
//           "close": 10953.1
//         },
//         {
//           "date": "13-Nov-18",
//           "open": 10963.56,
//           "close": 11056.81
//         },
//         {
//           "date": "14-Nov-18",
//           "open": 11115.55,
//           "close": 11055.67
//         },
//         {
//           "date": "15-Nov-18",
//           "open": 11055.62,
//           "close": 11091.79
//         },
//         {
//           "date": "16-Nov-18",
//           "open": 11131.1,
//           "close": 11158.48
//         },
//         {
//           "date": "19-Nov-18",
//           "open": 11215.77,
//           "close": 11244.76
//         },
//         {
//           "date": "20-Nov-18",
//           "open": 11236.45,
//           "close": 11140.82
//         },
//         {
//           "date": "21-Nov-18",
//           "open": 11162.87,
//           "close": 11074.55
//         },
//         {
//           "date": "22-Nov-18",
//           "open": 11100.42,
//           "close": 11003.8
//         },
//         {
//           "date": "26-Nov-18",
//           "open": 11052.35,
//           "close": 11112.1
//         },
//         {
//           "date": "27-Nov-18",
//           "open": 11123.8,
//           "close": 11167.34
//         },
//         {
//           "date": "28-Nov-18",
//           "open": 11200.57,
//           "close": 11213.62
//         },
//         {
//           "date": "29-Nov-18",
//           "open": 11300.42,
//           "close": 11350.2
//         },
//         {
//           "date": "30-Nov-18",
//           "open": 11391.39,
//           "close": 11364.07
//         },
//         {
//           "date": "3-Dec-18",
//           "open": 11425.01,
//           "close": 11389.77
//         },
//         {
//           "date": "4-Dec-18",
//           "open": 11403.06,
//           "close": 11369.48
//         },
//         {
//           "date": "5-Dec-18",
//           "open": 11337.38,
//           "close": 11279.1
//         },
//         {
//           "date": "6-Dec-18",
//           "open": 11222.38,
//           "close": 11086.91
//         },
//         {
//           "date": "7-Dec-18",
//           "open": 11143.41,
//           "close": 11180.41
//         },
//         {
//           "date": "10-Dec-18",
//           "open": 11037.84,
//           "close": 10969.21
//         },
//         {
//           "date": "11-Dec-18",
//           "open": 10858.76,
//           "close": 11039.42
//         },
//         {
//           "date": "12-Dec-18",
//           "open": 11075.48,
//           "close": 11232.03
//         },
//         {
//           "date": "13-Dec-18",
//           "open": 11308.06,
//           "close": 11290.31
//         },
//         {
//           "date": "14-Dec-18",
//           "open": 11302.39,
//           "close": 11307.11
//         },
//         {
//           "date": "17-Dec-18",
//           "open": 11354.94,
//           "close": 11402.46
//         },
//         {
//           "date": "18-Dec-18",
//           "open": 11392.28,
//           "close": 11423.46
//         },
//         {
//           "date": "19-Dec-18",
//           "open": 11454.66,
//           "close": 11476.43
//         },
//         {
//           "date": "20-Dec-18",
//           "open": 11427.4,
//           "close": 11459.77
//         },
//         {
//           "date": "21-Dec-18",
//           "open": 11464.65,
//           "close": 11252.38
//         },
//         {
//           "date": "24-Dec-18",
//           "open": 11286.82,
//           "close": 11163
//         },
//         {
//           "date": "26-Dec-18",
//           "open": 11154.58,
//           "close": 11222.37
//         },
//         {
//           "date": "27-Dec-18",
//           "open": 11321.23,
//           "close": 11271.23
//         },
//         {
//           "date": "28-Dec-18",
//           "open": 11305.1,
//           "close": 11363.71
//         },
//         {
//           "date": "31-Dec-18",
//           "open": 11411.84,
//           "close": 11367.43
//         }
//       ];
//     let promiseArray = [];
//     promiseArray = await data.map((d)=>{
//         d.date = new Date(d.date);
//         let stock = new Stock(d);
//         return stock.save();
//     })
//     let resp = Promise.all(promiseArray);
//     console.log("data",resp)
// })()