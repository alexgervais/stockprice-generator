'use strict';

var express = require('express');
var moment = require('moment');
var json2csv = require('json2csv');
var fs = require('fs');
var router = express.Router();

router.get('/', function (req, res) {

    var limit = 100000;
    var timestamp = moment('2011-11-07');
    var y = 0;
    var data = [];
    var dataSeries = {type: 'line'};
    var dataPoints = [];
    for (var i = 0; i < limit; i += 1) {
        var atTime = timestamp.add(15, 'seconds');

        y += Math.random() * 10 - 5;
        dataPoints.push({
            x: atTime.unix(),
            y: Math.abs(y),
            time: atTime.format(),
            value: Math.abs(y)
        });
    }
    dataSeries.dataPoints = dataPoints;
    data.push(dataSeries);

    json2csv({data: dataPoints, fields: ['time', 'value']}, function (err, csv) {

        if (err) {
            console.log(err);
        }
        var csvFile = 'stockprices_' + moment().unix() + '.csv';
        fs.writeFile(csvFile, csv, function (err) {
            if (err) {
                console.log(err);
            }

            res.render('index', {title: 'Stockprice Generator', file: csvFile, data: data});
        });
    });

});

module.exports = router;
