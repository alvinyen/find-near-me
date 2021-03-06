const express = require('express');
let app = express();
const port = require('./nonCredentialConfiguration/configuration').port ;
const rootRoutes = require('./routes/rootRoutes');
const cronYoubikeData = require('./utils/cronTools').cronYoubikeData ;
const getYoubikeData = require('./utils/getRemoteData/tools').getYoubikeData ;
const mongoose = require('mongoose');
const dbConnectionString = require('./nonCredentialConfiguration/configuration').dbConnectionString ;
const YoubikeStation = require('./models/youbike');
const jsonResponDataGenerator = require('./utils/responseTools').jsonResponDataGenerator ;

console.log(`dbConnectionString: ${dbConnectionString}`);
mongoose.connect(dbConnectionString);
const db = mongoose.connection;
const IS_DB_CONNECTION_SUCCESS = require('./models/dbTools').IS_DB_CONNECTION_SUCCESS ;
let isDbConnectionSuccess = true ;

db.on('error', (err) => { 
    console.log('db connection failed!..', err); 
    isDbConnectionSuccess = false ;
    app.set(IS_DB_CONNECTION_SUCCESS, isDbConnectionSuccess);
    // set a db connection variable to indecate suceess or not, to response -3
} );

db.once('open', () => { 
    app.set(IS_DB_CONNECTION_SUCCESS, isDbConnectionSuccess);
    YoubikeStation.collection.ensureIndex({ location: '2d' });

    // //1. 創建實體
    // let user = new User({
    //     username: 'alvinnnn',
    //     password: 'cestlavi'
    // });
    // //2. 保存
    // user.save();

} );

rootRoutes(app) ;

app.listen(process.env.PORT || 5000, () => {
    console.log(`server is running on port ${process.env.PORT || 5000}`);
});