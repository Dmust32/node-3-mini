const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `./controllers/messages_controller` );
const session= require('express-session');
const createInitialSession = require ('./middleware/session')
const filter = require('./middleware/filter')
require('dotenv').config()

const app = express();

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../build` ) );
app.use( session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        maxAge:10000
    }
}))
app.use((req, res, next)=> createInitialSession(req, res, next))
app.use((req, res, next)=> {
    const {method} = req;
    if(method ==="PUT" || method ==="POST"){
        filter(req, res, next)
    }
    else{
        next()
    }
})

const messagesBaseUrl = "/api/messages";
app.post( messagesBaseUrl, mc.create );
app.get( messagesBaseUrl, mc.read );
app.put( `${messagesBaseUrl}`, mc.update );
app.delete( `${messagesBaseUrl}`, mc.delete );

app.get('/api/messages/history', mc.history)

const port = process.env.PORT || 3000
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );