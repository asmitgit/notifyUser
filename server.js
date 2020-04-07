// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');



//var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://10.0.8.62:27017/test";

const client = require('socket.io').listen(4000).sockets;
var cors=require('cors');
//app.use(cors({ credentials: false, origin: 'https://notificationsocket.policybazaar.com' }));
app.use(cors({
    origin: function(origin, callback){
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true
  }));


// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "https://notificationsocket.policybazaar.com");
    
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//     next();
// });

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
var path    = require("path");
app.use(express.static(__dirname));

// test route to make sure everything is working (accessed at GET http://10.0.11.69:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

app.get('/home', function(req,res){
    console.log('home');
    res.render('index.html');
    //res.sendFile('index.html', {root : __dirname });
});


app.get('/flashmsg', function(req,res){
    console.log('flashmsg');    
    res.render('flashmsg.html');  
    //res.sendFile('index.html', {root : __dirname });
});

app.get('/luckydraw', function(req,res){
    console.log('lottery');    
    res.render('lottery.html');  
    //res.sendFile('index.html', {root : __dirname });
});
app.get('/home1', function(req,res){
    console.log('home1');
    res.render('home.html');
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

//     console.log('MongoDB connected...');

//     // Connect to Socket.io
//     client.on('connection', function(socket){
//         var chat = db.collection('Notification');

//         // Create function to send status
//         sendStatus = function(s){
//             socket.emit('status', s);
//         }
        
//         socket.on('GetMyData', function(data){
//             //let name = data.UserID;
//             console.log(data);
//             var _date=new Date();
//             _date.setDate(_date.getMinutes()-120);
//            // _date = parseString(_date);
//             var _strDate=_date.toString();
//             // ,ts:{$gt:_strDate}
//             var query = {uid: data.eid, read:false};
//             console.log(query);
//             chat.find(query).limit(100).sort({_id:1}).toArray(function(err, res){
//                 if(err){
//                     throw err;
//                 }
//                 console.log(res);
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
//                 //console.log(data._id);
//             chat.update({ '_id' :ObjectID( data._id) },{$set : { 'read':true,'ld': new Date(),'uby':req.body.uby  }},function(err, res){
//                 if(err){
//                     console.log(res);
//                 }
//                 //console.log(res);
//                 // console.log(res);
//                 // // Emit the messages
//                 // socket.emit('output', res);
//             });
//         }
//         catch(e){console.log(e);  }
//         });
//     });
// });

router.route('/StartLuckydraw')
    
    .post(function(req, res) {
        
        // mongo.connect('mongodb://ticketSystemUser:tIcKet1L5j8A7N@10.80.30.186:27017,10.80.40.253:27017,10.80.30.187:27017/TicketSystem?readPreference=secondaryPreferred;replicaSet=rs3', 
        // function(err, db){
            
        
        //         var chat = db.collection('PushMessage');
                
        //         req.body.forEach(element => {
        //             element.cd= new Date();
        //             element.ld= new Date();
        //             element.uby= 0;
        //         });
                
        //         chat.insert(req.body, function(){                   
        //             client.emit('newmessage', req.body);     

        //         });
                
            
            
        // });
        var size, lowest, highest;
        size=req.body.size;
        lowest=req.body.lowest;
        highest=req.body.highest;
        var numbers = [];
	for(var i = 0; i < size; i++) {
		var add = true;
		var randomNumber = Math.floor(Math.random() * highest) + 1;
		for(var y = 0; y < highest; y++) {
			if(numbers[y] == randomNumber) {
				add = false;
			}
		}
		if(add) {
			numbers.push(randomNumber);
		} else {
			i--;
		}
	}
  
	var highestNumber = 0;
	for(var m = 0; m < numbers.length; m++) {
		for(var n = m + 1; n < numbers.length; n++) {
			if(numbers[n] < numbers[m]) {
				highestNumber = numbers[m];
				numbers[m] = numbers[n];
				numbers[n] = highestNumber;
			}
		}
	}
          
    client.emit('luckynumber', numbers);
             res.json({ message: 'true',data:numbers });
    
    
    });

router.route('/AddNewMsg')
    
    .post(function(req, res) {
        
        mongo.connect('mongodb://ticketSystemUser:tIcKet1L5j8A7N@10.80.30.186:27017,10.80.40.253:27017,10.80.30.187:27017/TicketSystem?readPreference=secondaryPreferred;replicaSet=rs3', function(err, db){
            
        
                var chat = db.collection('PushMessage');
                
                req.body.forEach(element => {
                    element.cd= new Date();
                    element.ld= new Date();
                    element.uby= 0;
                });
                
                chat.insert(req.body, function(){                   
                    client.emit('newmessage', req.body);     

                });
                
            
            
        });
          
      
             res.json({ message: 'true' });
    
    
    });

    router.route('/MarkRead')    
    .post(function(req, res) {
        
        mongo.connect('mongodb://ticketSystemUser:tIcKet1L5j8A7N@10.80.30.186:27017,10.80.40.253:27017,10.80.30.187:27017/TicketSystem?readPreference=secondaryPreferred;replicaSet=rs3', function(err, db){           
                var chat = db.collection('PushMessage');               
                
                try{
                   
                chat.update({ '_id' :ObjectID( req.body._id) },{$set : { 'read':true,'ld': new Date(),'uby':req.body.uby }},function(err, res){
                    if(err){
                        
                    }
                   
                });
            }
            catch(e){console.log(e);  }                
        });
        
        res.json({ message: 'true' });
        
    
    });


    router.route('/AddTicketNotification')    
    .post(function(req, res) {        
        mongo.connect('mongodb://ticketSystemUser:tIcKet1L5j8A7N@10.80.30.186:27017,10.80.40.253:27017,10.80.30.187:27017/TicketSystem?readPreference=secondaryPreferred;replicaSet=rs3', function(err, db){
            

                
                var chat = db.collection('Notification');
                
                req.body.forEach(element => {
                    element.cd= new Date();
                    element.ld= new Date();
                    element.uby= 0;
                });
               
                chat.insert(req.body, function(){
                    client.emit('output', req.body);
                   
                });
                
        });
        

             res.json({ message: 'true' });
        

    });


    router.route('/GetAllDataByUserID')    
    .post(function(req, res) {
        mongo.connect('mongodb://ticketSystemUser:tIcKet1L5j8A7N@10.80.30.186:27017,10.80.40.253:27017,10.80.30.187:27017/TicketSystem?readPreference=secondaryPreferred;replicaSet=rs3', function(err, db){


                var chat = db.collection('Notification');

                var query = {uid: data.eid};
            console.log(query);
            chat.find(query).limit(100).sort({cd:-1}).toArray(function(err, res){
                if(err){
                    throw err;
                }
                else{

                }
        });
    });
});

    router.route('/MarkTicketAsRead')    
    .post(function(req, res) {
        
        mongo.connect('mongodb://ticketSystemUser:tIcKet1L5j8A7N@10.80.30.186:27017,10.80.40.253:27017,10.80.30.187:27017/TicketSystem?readPreference=secondaryPreferred;replicaSet=rs3', function(err, db){
                var chat = db.collection('Notification');
                
                try{
                chat.update({ '_id' : ObjectID(req.body._id) },{$set : { 'read':true,'ld': new Date(),'uby':req.body.uby }},function(err, res){
                    if(err){
                        console.log(res);
                    }
                });
            }
            catch(e){console.log(e);  }
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
