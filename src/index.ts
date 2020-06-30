import e from 'express';
//import { homePageStrStart } from './indexWebPage';
import { userRouter } from './routers/user-router';

const app = e(); //call the express function and get a completed application

app.use(e.json()); //this is an example of middleware

app.use('/users', userRouter);


/*app.use('/', (req, res)=>{
    res.send(homePageStrStart);
    //res.send(homePageStrEnd);
}); */

//The following code catch the user errors generated above which prevents the user from getting a bunch of
//technicalities in addition to our simple message.  We want them to get a simple message so they can fix their error.  The following
//If there is an error that does not get caught from above, then the else gets activated.
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
