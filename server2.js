const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'Notification';

const client = require('socket.io').listen(4000).sockets;


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
var path    = require("path");
app.use(express.static(__dirname));

router.route('/AddTicketNotification')
    // create a bear (accessed at POST http://localhost:8080/AddTicketNotification)
    .post(function(req, res) {
        console.log('hello');
        // mongo.connect('mongodb://localhost:27017/Notification', function(err, db){
        //     console.log('hello1');
        //     // Connect to Socket.io
        //     console.log(client);
           
        //         console.log('hello connected...');
        //         var chat = db.collection('Notification');
        //         //req.body.read = false;
        //         console.log(req.body);
        //         chat.insert(req.body, function(){                   
        //             client.emit('output', req.body);                   
        //         });
        //         // Get chats from mongo collection               
            
        //     console.log('ASDFAV');
        // });
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
           
            const db = client.db(dbName);
           
            insertDocuments(db, function() {
              client.close();
            });
          });
        console.log(req.body);     
      
             res.json({ message: 'true' });
        // });
    
    });
    
// Use connect method to connect to the server
