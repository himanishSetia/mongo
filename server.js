var express = require('express');
var mongo = require('mongodb').MongoClient;
var faker = require('faker');
var cors = require('cors');

var url = "mongodb://himanish_setia:himanish0694@ds213053.mlab.com:13053/m_db"

const app = express();
var router = express.Router();

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

    mongo.connect(url,{ useNewUrlParser: true },function(err,db){
        if(err) throw err;
        var dbo = db.db(req.params.db);
        var i,obj,users=[];

        dbo.collection(req.params.collection).find({name:req.params.name}).toArray(function(err,result){
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



const port = process.env.PORT || 5000;

app.listen(port, function(){
    console.log("Server started on port "+port)
})