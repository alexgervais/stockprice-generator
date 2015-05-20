'use strict';

var express = require('express');
var moment = require('moment');
var json2csv = require('json2csv');
var fs = require('fs');
var router = express.Router();

var generateDataPoints = function (initialValue, count, initialTimestamp) {

    var y = parseInt(initialValue);
    var dataPoints = [];

    for (var i = 0; i < count; i += 1) {
        var atTime = initialTimestamp.add(15, 'seconds');

        y += Math.random() * 10 - 5;
        var parsedValue = parseFloat(Math.abs(y).toFixed(3));
        dataPoints.push({
            x: atTime.unix(),
            y: parsedValue,
            time: atTime.format(),
            value: parsedValue
        });
    }

    return dataPoints;
};

router.get('/', function (req, res) {

    var initialValue = req.query.value || 100;
    var limit = req.query.points || 10;
    var timestamp = moment('2015-01-01');

    var data = [];
    var dataPoints = generateDataPoints(initialValue, limit, timestamp);
    var dataSeries = {type: 'line'};
    dataSeries.dataPoints = dataPoints;
    data.push(dataSeries);

    json2csv({data: dataPoints, fields: ['time', 'value']}, function (err, csv) {

        if (err) {
            console.log(err);
        }
        var csvFile = 'stockprices_' + moment().unix() + '.csv';
        fs.writeFile('public/' + csvFile, csv, function (err) {
            if (err) {
                console.log(err);
            }

            res.render('index', {title: 'Stockprice Generator', file: csvFile, points: limit, value: initialValue, data: data});
        });
    });

});

module.exports = router;
