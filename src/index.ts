import e from 'express';
//import e, { Router } from 'express';
//import { homePageStrStart } from './indexWebPage';
import { userRouter } from './routers/user-router';

const app = e(); //call the express function and get a completed application

app.use(e.json()); //this is an example of middleware

app.use('/users', userRouter);
//app.use('/reimbusements', reimbursement-router);


//The following code catches the user errors generated above which prevents the user from getting a bunch 
//of technicalities in addition to our simple message.  We want them to get a simple message so they can
// fix their error.  If there is an error that does not get caught above, then no status code is sent, so
//the else gets activated below.
app.use((err, req, res, next)=>{
    if (err.statusCode){
        res.status(err.statusCode).send(err.message);
    }else{
        console.log(err); //causes a log out
        res.status(500).send("Something went wrong!");
    }
});

app.listen(2006, ()=>{
    console.log('Server has started.');
});
