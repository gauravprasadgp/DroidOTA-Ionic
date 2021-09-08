
    const { MongoClient } = require("mongodb");
    // Replace the uri string with your MongoDB deployment's connection string.
    const url = `{your mongo atlas uri}`;
    
    MongoClient.connect(url, {useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myobj = { name: "Company Inc", address: "Highway 37" };
        dbo.collection("customers").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });