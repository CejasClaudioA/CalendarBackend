require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');


//BDD
const { dbConnection } = require('./database/config');
dbConnection();

//settings
app.set('port', process.env.PORT || 3001)

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/events', require('./routes/events.routes'));

//public
app.use(express.static(path.join(__dirname, 'public')));


//server
app.listen(app.get('port'), () => {
    console.log("Server on port", app.get('port'));
})