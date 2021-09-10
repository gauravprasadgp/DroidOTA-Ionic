var express = require('express');
var app = express();
var fs = require('fs');
const process = require('process');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override')
var cors = require('cors');
var nodemailer = require('nodemailer');
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json())
var jwt = require('jsonwebtoken');
var MongoClient = require('mongodb').MongoClient;

const apk_generator = require('./apk-generater');

const url = `{Your Mongo Atlas uri}`;
const secret = '{Your secret Key here}'


async function queueApkGenerator(user, dataToPut, buildZipName) {
    await app.locals.queue.add(() => apk_generator(user, dataToPut, buildZipName));
    console.log(`Done: apk task bulding ${buildZipName}`);
};

app.use('/',express.static('frontend/dist/droid-ng'))

app.post("/login", (req, response) => {
    const name = req.body.displayName
    const email = req.body.email
    const photo = req.body.photo
    const phoneno = req.body.phoneno
    const accesstoken = req.body.accesstoken
    const idtoken = req.body.idtoken
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var mongo = require("mongodb");
        var ObjectID = mongo.ObjectID;
        var obj_id = new ObjectID();
        var event_id = mongo.ObjectId(obj_id);
        var dateUTC = new Date();
        var dateUTC = new Date().getTime();
        var dateIST = new Date(dateUTC);
        dateIST.setHours(dateIST.getHours() + 5);
        dateIST.setMinutes(dateIST.getMinutes() + 30);
        var dateCurrent = dateIST.toUTCString() + "+530";
        const token = jwt.sign({ iss: 'localhost:3000', role: 'user', email: email, name: name, _id: event_id }, secret, { expiresIn: 60 * 60 });
        // console.log(token);
        var myobj = { _id: obj_id, name: name, email: email, photo: photo, phoneno: phoneno, accesstoken: accesstoken, idtoken: idtoken, login_data: [{ 'accesstoken': accesstoken, 'idtoken': idtoken, 'last_login': dateCurrent }] };
        // console.log(myobj);
        dbo.collection("customers").findOne({ email: email }, function (err, result) {
            if (err) throw err;
            else {
                if (result == null) {


                    dbo.collection("customers").insertOne(myobj, function (err, res) {
                        if (err) throw err
                        else {
                            response.json({
                                success: true,
                                status: 200,
                                token: token
                            })

                            console.log("1 document inserted");
                        }
                    });
                }
                else {
                    var myquery = { email: email };
                    // var newvalues = {  };
                    console.log(myquery);
                    var relogin = { accesstoken: accesstoken, idtoken: idtoken, last_login: dateCurrent };
                    dbo.collection("customers").updateOne(myquery, { $push: { login_data: relogin } }, function (err, res) {
                        if (err) throw err
                        else {
                            response.json({
                                success: true,
                                status: 200,
                                token: token,
                                message: "you are already part of the community"
                            })
                        }
                        console.log("1 document updated from relogin");

                    });
                }
            }
        });
    });

})

app.post('/buildMyApp', async (req, res) => {
    var token = req.body.token;
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            res.json({
                status: 400,
                message: "Token Expired"
            });
        } else {
            var dataToPut = req.body.data;
            console.log(dataToPut);
            var user = decoded._id;
            var email= decoded.email;
            console.log("user ", user);
            var mongo = require("mongodb");
            var obj_id = mongo.ObjectId(user);
            var buildZipName = user + '-' + Date.now() + '.zip';
            var build_data_new={ 'build': dataToPut, 'buildZipName': buildZipName };
            MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("mydb");
                console.log(obj_id);
                dbo.collection("customers").findOne({email:email}, function (err, result) {
                    if (err) throw err;
                    else {
                        console.log("res find one",result);
                        if (result.build_data == undefined || result.build_data==null) {
                            dbo.collection("customers").updateOne({email:email},{ $push: { build_data: build_data_new }}, function (err, result1) {
                                if (err) throw err
                                else {
                                    const result = queueApkGenerator(user, dataToPut, buildZipName);
                                    res.json({
                                        status: 200,
                                        success: true,
                                        message: "Apk building started",
                                        url: buildZipName,
                                        QueueTime: app.locals.queue.pending
                                    })
                                    console.log("1 document inserted");
                                }
                            });
                        }
                        else {
                            console.log(result.build_data.length)
                            if (result.build_data.length <= 1) {
                                var myquery = {email:email};
                                console.log(myquery);
                                var rebuild = { build: dataToPut, buildZipName: buildZipName };
                                dbo.collection("customers").updateOne(myquery, { $push: { build_data: rebuild } }, function (err, result2) {
                                    if (err) throw err
                                    else {
                                        const result = queueApkGenerator(user, dataToPut, buildZipName);
                                        res.json({
                                            status: 200,
                                            success: true,
                                            message: "Apk building started",
                                            url: buildZipName,
                                            QueueTime: app.locals.queue.pending
                                        })
                                        console.log("1 document updated");
                                    }
                                 });
                            }
                            else {
                                res.json({
                                    success: true,
                                    status: 500,
                                    message: "you have already used your free builds"
                                })
                            }
                        }
                    }
                })
            });
        }
    })

})

app.get('/download/:path', (req, res) => {
    var path = req.params.path;
    const file = '/home/ubuntu/new_app/' + path;
    res.download(file);
})
app.listen(3000, () => {
    const { default: PQueue } = require('p-queue');
    const queue = new PQueue({ concurrency: 1 });
    app.locals.queue = queue;
    console.log('App is running on 3000')
});