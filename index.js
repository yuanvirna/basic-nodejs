/*jshint esversion: 6 */
const debug = require('debug')('app:mulai');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const buatLogger = require('./log');
const joi = require('joi');
const app = express();
//ini tidak dibutuhkan lagi karena sudah di letakkan di bawah app.use helmet . 
// console.log(
//     `NODE_ENV: ${process.env.NODE_ENV}`
// ); hasilnya undefined
// console.log(
//     `app: ${app.get('env')}`
// ); hasilnya app development saja 

console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));


app.use(express.json());
app.use(express.urlencoded( {extended: true}));
app.use(express.static('public'));

// app.use(helmet());
//ini adalah kondisi agar kita tahu kode kita running pada development atau testing, atau staging, atau production machine
//want to enable logging in http request only on the development machine
if (app.get('env') === 'development') {

    app.use(morgan('tiny'));
//and for debugging
debug('morgan nya hidup...!');
    //setelah nodemon di cancel. kemudian untuk memberhentikan morgan . ketik pada terminal 
    //export NODE_ENV=production
    //kemudian jalankan lagi nodemon
}

app.use(buatLogger);

const tryIts = [
    {
        id: 1,
        name : 'course 1',
    },
    {
        id: 2,
        name : 'course 2',
    },
    {
        id: 2,
        name : 'course 2',
    }
];
app.get('/', (req, res)=> {
    res.send('hai dunia :) ');
});
app.get('/api/tryIts', (req, res)=>{
    res.send(tryIts);
});
app.get('/api/tryIts/:id', (req, res)=>{
    const tryIt = tryIts.find(t => t.id === parseInt(req.params.id));
    if (!tryIt) {
        return res.status(404).send('neng fungsi tryiT id ne rk ono ki?..');
   } 
});

app.post('/api/tryIts/posts', (req, res )=> {
    const {error} = validasiTryIts(req.body);    
if (error) {
    return res.status(404).send(error.details[0].message);
}
    const tryIt = {
        id: tryIts.length + 1,
        name: req.body.name
    };
    tryIts.push(tryIt);
    res.send(tryIt);
});
app.put('/api/tryIts/:id', (req, res)=> {
    const tryIt = tryIts.find(t => t.id === parseInt(req.params.id));
    if (!tryIt) {
        return res.status(404).send('neng fungsi tryiT id ne rk ono ki?..');
    }
    const {error} = validasiTryIts(req.body);
    if (error) {
        return res.status(404).send('');
    }
        tryIt.name = req.body.name;
        res.send(tryIt);
    
      
});

app.delete('/api/tryIts/:id', (req, res)=> {
    const tryIt = tryIts.find(t => t.id === parseInt(req.params.id));
    if (!tryIt) 
      return  res.status(404).send('neng fungsi tryiT id ne rk ono ki?..');
    
    const index = tryIts.indexOf(tryIt);
    tryIts.splice(index, 1);
    res.send(tryIt);
});


function validasiTryIts(tryIt) {
  
 const schema = {
    name: joi.string().min(3).required() 
 };
return joi.validate(tryIt, schema);
 }
const serverPort = process.env.serverPort || 3000;
app.listen(serverPort, ()=> console.log(`Wes mlaku servere ning port ${serverPort}`)); 

