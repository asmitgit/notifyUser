// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');




//var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://10.0.8.62:27017/test";
const sql = require("mssql");
const msconfig = {
    user: 'BackofficeSys',
    password: 'MT#123#C@re',
    server: 'PBAGL01.ETECHACES.COM',
    database: 'PBCroma',
    options: {
        encrypt: false,
        enableArithAbort: true
    },
    pool: {
        max: 100,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// const msconfig = {
//     user: 'UATUSER',
//     password: 'UAT123User',
//     server: '10.0.10.43',
//     database: 'PBCroma',
//     options: {
//         encrypt: false,
//         enableArithAbort: true
//     },
//     pool: {
//         max: 100,
//         min: 0,
//         idleTimeoutMillis: 30000
//     }
// };


var cors = require('cors');
//app.use(cors({ credentials: false, origin: 'https://notificationsocket.policybazaar.com' }));



app.use(function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "https://notificationsocket.policybazaar.com");
    res.header('Access-Control-Allow-Origin', req.header('origin'));

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});
app.use(cors({
    origin: function (origin, callback) {
        return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true
}));

var expressSocket = require('express');
var appSocket = expressSocket();

appSocket.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.header('origin'));

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});
var serverSocket = appSocket.listen(4000);
const client = require('socket.io').listen(serverSocket);//require('socket.io').listen(4000).sockets;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine('html', require('ejs').renderFile);

app.set('views', __dirname + '/views');
var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
var path = require("path");
app.use(express.static(__dirname));

// test route to make sure everything is working (accessed at GET http://10.0.11.69:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

app.get('/home', function (req, res) {
    //console.log('home');
    res.render('index.html');
    //res.sendFile('index.html', {root : __dirname });
});


app.get('/flashmsg', function (req, res) {
    //console.log('flashmsg');
    res.render('flashmsg.html');
    //res.sendFile('index.html', {root : __dirname });
});

app.get('/luckydraw', function (req, res) {
    //console.log('lottery');
    res.render('lottery.html');
    //res.sendFile('index.html', {root : __dirname });
});
app.get('/home1', function (req, res) {
    //console.log('home1');
    res.render('home.html');
    //res.sendFile('index.html', {root : __dirname });
});
app.get('/alert', function (req, res) {
    //console.log('alert');
    res.render('alert.html');
    //res.sendFile('index.html', {root : __dirname });
});
// more routes for our API will happen here
const mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;


// Connect to mongo
// mongo.connect('mongodb://ticketSystemUser:tIcKet1L5j8A7N@10.80.30.186:27017,10.80.40.253:27017,10.80.30.187:27017/TicketSystem?readPreference=secondaryPreferred;replicaSet=rs3', function(err, db){
//     if(err){
//         throw err;
//     }

//     //console.log('MongoDB connected...');

//     // Connect to Socket.io
//     client.on('connection', function(socket){
//         var chat = db.collection('Notification');

//         // Create function to send status
//         sendStatus = function(s){
//             socket.emit('status', s);
//         }

//         socket.on('GetMyData', function(data){
//             //let name = data.UserID;
//             //console.log(data);
//             var _date=new Date();
//             _date.setDate(_date.getMinutes()-120);
//            // _date = parseString(_date);
//             var _strDate=_date.toString();
//             // ,ts:{$gt:_strDate}
//             var query = {uid: data.eid, read:false};
//             //console.log(query);
//             chat.find(query).limit(100).sort({_id:1}).toArray(function(err, res){
//                 if(err){
//                     throw err;
//                 }
//                 //console.log(res);
//                 // Emit the messages
//                 socket.emit('output', res);
//             });

//         });

//         socket.on('MarkRead', function(data){

//             // db.collection( 'students' ).update (
//             //     { _id : doc._id },
//             //     { $set : { scores:zz } },
//             //     function( err, result ) {
//             //         if ( err ) throw err;
//             //     }
//             // );
//             try{
//                 ////console.log(data._id);
//             chat.update({ '_id' :ObjectID( data._id) },{$set : { 'read':true,'ld': new Date(),'uby':req.body.uby  }},function(err, res){
//                 if(err){
//                     //console.log(res);
//                 }
//                 ////console.log(res);
//                 // //console.log(res);
//                 // // Emit the messages
//                 // socket.emit('output', res);
//             });
//         }
//         catch(e){//console.log(e);  }
//         });
//     });
// });

function fnKeepLog(_service, _body, _method, _res, _status, _error) {
    try {
        mongo.connect('mongodb://ticketSystemUser:tIcKet1L5j8A7N@10.80.30.186:27017,10.80.40.253:27017,10.80.30.187:27017/TicketSystem?readPreference=secondaryPreferred;replicaSet=rs3',
            function (err, db) {
                var chat = db.collection('ServiceLog');
                var _cd = new Date();
                var _jsonBody = { service: _service, body: _body, method: _method, res: { msg: _res }, status: _status, error: { msg: _error }, cd: _cd };




                chat.insert(_jsonBody, function () {
                });
            });
    } catch (err) {
        console.log(err);
    }
}



router.route('/TestRandom')
    .post(function (req, res) {
        console.log(1);
        var size, lowest, highest;
        size = req.body.size;
        lowest = 0;
        highest = req.body.highest;

        var numbers = [];
        var resnumbers = [];

        var _rem = highest % size;
        var _fac = highest / size;


        var _fr = 0, _to = _fac;

        _rem = 0

        for (var j = 0; j < size; j++) {

            _fr = j * _fac, _to = (j + 1) * _fac;

            if (j + 1 == size) {
                _to = _rem + _to;
            }
            for (var i = _fr; i < _to; i++) {
                var add = true;
                var randomNumber = Math.floor(Math.random() * highest) + 1;
                for (var y = 0; y < highest; y++) {
                    if (numbers[y] == randomNumber) {
                        add = false;
                    }
                }
                if (add) {
                    numbers.push(randomNumber);
                } else {
                    i--;
                }
            }

            var highestNumber = 0;
            for (var m = 0; m < numbers.length; m++) {
                for (var n = m + 1; n < numbers.length; n++) {
                    if (numbers[n] < numbers[m]) {
                        highestNumber = numbers[m];
                        numbers[m] = numbers[n];
                        numbers[n] = highestNumber;
                    }
                }
            }
            resnumbers = resnumbers.concat(highestNumber);

        }




        res.json({ message: 'true', data: numbers });

    });
router.route('/StartLuckydraw')
    .post(function (req, res) {
        //console.log(req);
        var _service = req.originalUrl, _body = req.body, _method = req.method, _res, _status, _error;
        //fnKeepLog(_service, _body, _method, _res, _status, _error)
        var _agent = [];
        var dbConn = new sql.ConnectionPool(msconfig);
        try {
            dbConn.connect().then(function () {
                var request = new sql.Request(dbConn);
                request.input('ProductID', sql.Int, req.body.pid).input('Type', sql.Int, 1).
                    input('ContestType', sql.Int, req.body.ctype)
                    .execute("mtx.UpdateContestDetails").then(function (recordSet) {
                        ////console.log(recordSet.recordset);
                        _agent = recordSet.recordset;
                        if (_agent.length > 0 && _agent.length > req.body.size) {
                            dbConn.close();

                            var size, lowest, highest;
                            size = req.body.size;
                            lowest = 0;
                            //highest=req.body.highest;

                            highest = recordSet.recordset.length - 1;

                            var numbers = [];
                            for (var i = 0; i < size; i++) {
                                var add = true;
                                var randomNumber = Math.floor(Math.random() * highest) + 1;
                                for (var y = 0; y < highest; y++) {
                                    if (numbers[y] == randomNumber) {
                                        add = false;
                                    }
                                }
                                if (add) {
                                    numbers.push(randomNumber);
                                } else {
                                    i--;
                                }
                            }

                            var highestNumber = 0;
                            for (var m = 0; m < numbers.length; m++) {
                                for (var n = m + 1; n < numbers.length; n++) {
                                    if (numbers[n] < numbers[m]) {
                                        highestNumber = numbers[m];
                                        numbers[m] = numbers[n];
                                        numbers[n] = highestNumber;
                                    }
                                }
                            }


                            var _result = [];
                            var xmldata = '<xml>';//<agent Sno="" EmpID="" /> </xml>;
                            numbers.forEach(element => {
                                _result.push(_agent[element]);
                                xmldata = xmldata + '<agent Sno="' + _agent[element].Sno + '" EmpID="' + _agent[element].EmpID + '" />'
                            });
                            xmldata = xmldata + '</xml>';

                            var dbConnUpdate = new sql.ConnectionPool(msconfig);
                            dbConnUpdate.connect().then(function () {

                                var requestUpdate = new sql.Request(dbConnUpdate);
                                requestUpdate.input('ProductID', sql.Int, req.body.pid)
                                    .input('Type', sql.Int, 2)
                                    .input('ContestType', sql.Int, req.body.ctype)
                                    .input('xml', sql.Xml, xmldata)
                                    .execute("mtx.UpdateContestDetails").then(function (recordSet) {
                                    });

                            });
                            var _emitRes = { "Lucky": _result, "AllUser": _agent, "ctype": req.body.ctype,"pid":req.body.pid };
                            client.emit('luckynumber', _emitRes);

                            //console.log(xmldata);
                            _res = _result;
                            _status = true;
                            _error.msg = "no error";
                            fnKeepLog(_service, _body, _method, _res, _status, _error);
                            res.json({ message: 'true', data: _result });
                        }
                        else {
                            _res = {};
                            _status = false;
                            _error.msg = "No record or Number of employee is less no. of winner";
                            //console.log(_error);
                            fnKeepLog(_service, _body, _method, _res, _status, _error);

                            res.json({ message: 'false', data: "No record or Number of employee is less no. of winner" });
                        }
                    }).catch(function (err) {
                        //console.log(err);
                        _status = false;
                        dbConn.close();
                        _error = err;
                        fnKeepLog(_service, _body, _method, _res, _status, _error);
                        res.json({ message: 'false', data: err });

                    });
            });
        }
        catch (error) {
            _error = error;
            _status = false;
            fnKeepLog(_service, _body, _method, _res, _status, _error);
            res.json({ message: 'false', data: error });
        }
        finally {
            //fnKeepLog(_service, _body, _method, _res, _status, _error);
        }

    });

router.route('/AddNewMsg')

    .post(function (req, res) {

        mongo.connect('mongodb://ticketSystemUser:tIcKet1L5j8A7N@10.80.30.186:27017,10.80.40.253:27017,10.80.30.187:27017/TicketSystem?readPreference=secondaryPreferred;replicaSet=rs3', function (err, db) {


            var chat = db.collection('PushMessage');

            req.body.forEach(element => {
                element.cd = new Date();
                element.ld = new Date();
                element.uby = 0;
            });

            chat.insert(req.body, function () {
                client.emit('newmessage', req.body);

            });



        });


        res.json({ message: 'true' });


    });

router.route('/MarkRead')
    .post(function (req, res) {

        mongo.connect('mongodb://ticketSystemUser:tIcKet1L5j8A7N@10.80.30.186:27017,10.80.40.253:27017,10.80.30.187:27017/TicketSystem?readPreference=secondaryPreferred;replicaSet=rs3', function (err, db) {
            var chat = db.collection('PushMessage');

            try {

                chat.update({ '_id': ObjectID(req.body._id) }, { $set: { 'read': true, 'ld': new Date(), 'uby': req.body.uby } }, function (err, res) {
                    if (err) {

                    }

                });
            }
            catch (e) { console.log(e); }
        });

        res.json({ message: 'true' });


    });


router.route('/AddTicketNotification')
    .post(function (req, res) {
        mongo.connect('mongodb://ticketSystemUser:tIcKet1L5j8A7N@10.80.30.186:27017,10.80.40.253:27017,10.80.30.187:27017/TicketSystem?readPreference=secondaryPreferred;replicaSet=rs3', function (err, db) {



            var chat = db.collection('Notification');

            req.body.forEach(element => {
                element.cd = new Date();
                element.ld = new Date();
                element.uby = 0;
            });

            chat.insert(req.body, function () {
                client.emit('output', req.body);

            });

        });


        res.json({ message: 'true' });


    });


router.route('/GetAllDataByUserID')
    .post(function (req, res) {
        mongo.connect('mongodb://ticketSystemUser:tIcKet1L5j8A7N@10.80.30.186:27017,10.80.40.253:27017,10.80.30.187:27017/TicketSystem?readPreference=secondaryPreferred;replicaSet=rs3', function (err, db) {


            var chat = db.collection('Notification');

            var query = { uid: data.eid };
            //console.log(query);
            chat.find(query).limit(100).sort({ cd: -1 }).toArray(function (err, res) {
                if (err) {
                    throw err;
                }
                else {

                }
            });
        });
    });

router.route('/MarkTicketAsRead')
    .post(function (req, res) {

        mongo.connect('mongodb://ticketSystemUser:tIcKet1L5j8A7N@10.80.30.186:27017,10.80.40.253:27017,10.80.30.187:27017/TicketSystem?readPreference=secondaryPreferred;replicaSet=rs3', function (err, db) {
            var chat = db.collection('Notification');

            try {
                chat.update({ '_id': ObjectID(req.body._id) }, { $set: { 'read': true, 'ld': new Date(), 'uby': req.body.uby } }, function (err, res) {
                    if (err) {
                        //console.log(res);
                    }
                });
            }
            catch (e) { console.log(e); }
        });

        res.json({ message: 'true' });


    });
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Start now' + port);
