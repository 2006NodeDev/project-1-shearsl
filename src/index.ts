import express from 'express';
import { homePageStr } from './indexWebPage';

const app = express();

app.use('/', (req, res)=>{
    res.send(homePageStr);
});

app.listen(2006, ()=>{
    console.log('Server has started.');
});

