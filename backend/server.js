import http from 'http'
import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();

let server=http.createServer(app);
let PORT=process.env.PORT;

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

