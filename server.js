const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/passport');
require("./config/database").connect();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
var http = require('http').createServer(app);
var io = require('socket.io')(http,{
    cors: {
        origin: '*',
    }
});

// //mongo db connected
// const uri = process.env.ATLAS_URI;
// mongoose.connect(uri);
// const connection = mongoose.connection;
// connection.once('open', () => {
//     console.log('mongoose connected successfully');
// })


const usersRouter = require('./routes/users');
const homeRouter = require('./routes/home');
const documentRouter = require('./routes/documents');
const roleRouter = require('./routes/role');
app.use('/users',usersRouter);
app.use('/document',documentRouter);
app.use('/role',roleRouter);
app.use('/',homeRouter);



http.listen(port , ()=>{
    console.log(`server is running on port ${port}`);
}); 


// io.on('connection', (socket) => { 
//     console.log('new client connected' , socket.id);
//     socket.on(socket.username ,(payload) =>{
//         console.log("what is payload",payload);
//         io.emit(socket.username,payload);
//     });
// });



