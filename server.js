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

app.get('/home1', function(req,res){
    console.log('home1');    
    res.render('home.html');  
    //res.sendFile('index.html', {root : __dirname });
});
// more routes for our API will happen here
    const mongo = require('mongodb').MongoClient;
    var ObjectID = require('mongodb').ObjectID;


// Connect to mongo
mongo.connect('mongodb://ticketSystemUser:tIcKet1L5j8A7N@10.80.30.186:27017,10.80.40.253:27017,10.80.30.187:27017/?authSource=TicketSystem;readPreference=secondaryPreferred;connectTimeoutms=40000&amp;socketTimeoutMS=40000;replicaSet=rs3', function(err, db){
    if(err){
        throw err;
    }

    console.log('MongoDB connected...');

    // Connect to Socket.io
    client.on('connection', function(socket){
        var chat = db.collection('Notification');

        // Create function to send status
        sendStatus = function(s){
            socket.emit('status', s);
        }
        // Get chats from mongo collection
        // chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
        //     if(err){
        //         throw err;
        //     }
        //     // Emit the messages
        //     socket.emit('output', res);
        // });
       
        socket.on('GetMyData', function(data){
            //let name = data.UserID;          
            console.log(data);
            var _date=new Date();
            _date.setDate(_date.getMinutes()-120);
           // _date = parseString(_date);
            var _strDate=_date.toString();
            // ,ts:{$gt:_strDate}
            var query = {uid: data.eid, read:false};
            console.log(query);
            chat.find(query).limit(100).sort({_id:1}).toArray(function(err, res){
                if(err){
                    throw err;
                }
                console.log(res);
                // Emit the messages
                socket.emit('output', res);
            });

        });

        socket.on('MarkRead', function(data){                   
           
            // db.collection( 'students' ).update (
            //     { _id : doc._id },
            //     { $set : { scores:zz } },
            //     function( err, result ) {
            //         if ( err ) throw err;
            //     }
            // );
            try{
                //console.log(data._id);  
            chat.update({ '_id' : data._id },{$set : { 'read':true,'ld': new Date(),'uby':req.body.uby  }},function(err, res){
                if(err){
                    console.log(res);
                }
                //console.log(res);  
                // console.log(res);
                // // Emit the messages
                // socket.emit('output', res);
            });
        }
        catch(e){console.log(e);  }
        });
    });
});
    router.route('/AddTicketNotification')
    // create a bear (accessed at POST http://10.0.11.69:8080/AddTicketNotification)
    .post(function(req, res) {
        console.log('hello');
        mongo.connect('mongodb://ticketSystemUser:tIcKet1L5j8A7N@10.80.30.186:27017,10.80.40.253:27017,10.80.30.187:27017/?authSource=TicketSystem;readPreference=secondaryPreferred;connectTimeoutms=40000&amp;socketTimeoutMS=40000;replicaSet=rs3', function(err, db){
            console.log('hello1');
            // Connect to Socket.io
            console.log(client);
           
                console.log('hello connected...');
                var chat = db.collection('Notification');
                //req.body.read = false;
                req.body.forEach(element => {
                    element.cd= new Date();
                    element.ld= new Date();
                    element.uby= 0;
                });
               // req.body.cd= new Date();
                console.log(req.body);
                chat.insert(req.body, function(){                   
                    client.emit('output', req.body);     
                   console.log("success");              
                });
                // Get chats from mongo collection               
            
            console.log('ASDFAV');
        });
        console.log(req.body);     
      
             res.json({ message: 'true' });
        // });
    
    });
    router.route('/GetAllDataByUserID')
    // create a bear (accessed at POST http://10.0.11.69:8080/AddTicketNotification)
    .post(function(req, res) {        
        mongo.connect('mongodb://ticketSystemUser:tIcKet1L5j8A7N@10.80.30.186:27017,10.80.40.253:27017,10.80.30.187:27017/?authSource=TicketSystem;readPreference=secondaryPreferred;connectTimeoutms=40000&amp;socketTimeoutMS=40000;replicaSet=rs3', function(err, db){
                   
              
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
    // create a bear (accessed at POST http://10.0.11.69:8080/api/bears)
    .post(function(req, res) {
        console.log('MarkTicketAsRead');
        mongo.connect('mongodb://ticketSystemUser:tIcKet1L5j8A7N@10.80.30.186:27017,10.80.40.253:27017,10.80.30.187:27017/?authSource=TicketSystem;readPreference=secondaryPreferred;connectTimeoutms=40000&amp;socketTimeoutMS=40000;replicaSet=rs3', function(err, db){           
                var chat = db.collection('Notification');               
                console.log(req.body);
                try{
                    //  element.ld= new Date();
                    //  element.uby= 0;
                    console.log(req.body._id);  
                chat.update({ '_id' : req.body._id },{$set : { 'read':true,'ld': new Date(),'uby':req.body.uby }},function(err, res){
                    if(err){
                        console.log(res);
                    }
                });
            }
            catch(e){console.log(e);  }                
        });
        console.log(req.body);           
        res.json({ message: 'true' });
        // });
    
    });
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

