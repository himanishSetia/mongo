var express = require('express');
var mongo = require('mongodb').MongoClient;
var faker = require('faker');
var cors = require('cors');
var bodyParser = require('body-parser');
var request = require('request');



var url = "mongodb://himanish_setia:himanish0694@ds213053.mlab.com:13053/m_db"

const app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors({
    origin:"*"
}))

app.use('/api/v1',router);

router.get('/insert/:db/:collection',function(req,res){

    mongo.connect(url,{ useNewUrlParser: true },function(err,db){
        if(err) throw err;
        var dbo = db.db(req.params.db);
        var i,obj,users=[];
        for(i=0;i<10;i++){
            obj = {name:faker.name.findName(),email1:faker.internet.email(),company:faker.company.companyName(),salary:faker.finance.amount()}
            users.push(obj)
        }
            dbo.collection(req.params.collection).insertMany(users,function(){
                if (err) throw err;
                console.log("Data Added")
                db.close();
                res.status(200).send({
                    success:'true',
                    message:'Data Added successfully'
                })
            })
        
        
    })


})

router.get('/find/:db/:collection',function(req,res){

    mongo.connect(url,{ useNewUrlParser: true },function(err,db){
        if(err) throw err;
        var dbo = db.db(req.params.db);
        
            dbo.collection(req.params.collection).find({}).toArray(function(err,result){
                if (err) throw err;
                console.log("Data Fetched")
                db.close();
                res.status(200).send({
                    success:'true',
                    data:result,
                    total:result.length
                })
            })
        
        
    })


})

router.get('/find/:db/:collection/:count',function(req,res){

    mongo.connect(url,{ useNewUrlParser: true },function(err,db){
        if(err) throw err;
        var dbo = db.db(req.params.db);
        
            dbo.collection(req.params.collection).find().limit(parseInt(req.params.count)).toArray(function(err,result){
                if (err) throw err;
                console.log("Data Fetched")
                db.close();
                res.status(200).send({
                    success:'true',
                    data:result,
                    total:result.length
                })
            })
        
        
    })


})

router.get('/insert/:db/:collection/:name/:token',function(req,res){
    console.log("ENTERED INSIDE API")
        mongo.connect(url,{ useNewUrlParser: true },function(err,db){
            console.log("Mongo Connected")
            if(err) throw err;
            var dbo = db.db(req.params.db);
            var i,obj,users=[];
            dbo.collection(req.params.collection).find({token:req.params.token}).toArray(function(err,result){
                if (err) throw err;
                if(!result.length){
                    dbo.collection(req.params.collection).insertOne({name:req.params.name,token:req.params.token},function(){
                        if (err) throw err;
                        console.log("User Token Data Added")
                        db.close();
                        res.status(200).send({
                            success:'true',
                            message:'User Token Data Added'
                        })
                    })
                }else{
                    res.status(200).send({
                        success:'true',
                        message:'User Already Registered'
                    })
                }
            })        
        })
    
    
    })

router.post('/insert/:db/:collection',function(req,res){
console.log("ENTERED INSIDE API")
    mongo.connect(url,{ useNewUrlParser: true },function(err,db){
        console.log("Mongo Connected")
        if(err) throw err;
        var dbo = db.db(req.params.db);
        var i,obj,users=[];
        console.log("REACHED HERE ",req.body)
        dbo.collection(req.params.collection).find({name:req.body.name}).toArray(function(err,result){
            if (err) throw err;
            if(!result.length){
                dbo.collection(req.params.collection).insertOne({name:req.body.name,token:req.body.token},function(){
                    if (err) throw err;
                    console.log("User Token Data Added")
                    db.close();
                    res.status(200).send({
                        success:'true',
                        message:'User Token Data Added'
                    })
                })
            }else{
                res.status(200).send({
                    success:'true',
                    message:'User Already Registered'
                })
            }
        })        
    })


})

router.post('/sendPush',function(req,res){
    
    var i,obj,tokens=[],users=[];

    mongo.connect(url,{ useNewUrlParser: true },function(err,db){
        var dbo = db.db("m_db");
        if(err) throw err;
            dbo.collection("user_data").find({}).toArray(function(err,result){
                if (err) throw err;
                console.log("Result ",result)
                for(var val of result) {

                    
            console.log("token ",req.body)
            const options = {
                method: 'POST',
                url: 'https://fcm.googleapis.com/fcm/send',
                headers: {
              Authorization: 'key=AAAARnBrXk4:APA91bFqwKz9OX2ZZ3DBuKrBZZB_4z8aI9e21dexXfwnhdapz5kbD0-zh5nEqUcUNnjP9oTKWawXLZUcTsMEqQc-ptsjr6gFcH7VsrIw3d5Plu1IA5yFKvSoVK0If1NJFlj7UqJyX8A7',
              'Content-Type': 'application/json'
                },
                body:  { 
                    "notification": {
                     "title": req.body.title, 
                     "body": req.body.message,
                     "icon":"http://cdn.onlinewebfonts.com/svg/img_383214.png"
                    },
                    "to" : val.token
                   },
                json: true  // JSON stringifies the body automatically
              }
              
              request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("BODY ",body);
                    users.push(val.token);
                    
                }
            });
            console.log("Inside Loop ",users)
                    
                }
                db.close();
            })
    })


    
    
    })




const port = process.env.PORT || 8000;

app.listen(port, function(){
    console.log("Server started on port "+port)
})