import e, { Request, Response } from 'express';
//import { homePageStrStart } from './indexWebPage';
import { User } from './models/User';

const app = e(); //call the express function and get a completed application

//app .use matches every single http verb (get, post, and delete)
//if I don't specify a path, that's the same as every path
app.use(e.json()); //this is an example of middleware
//takes the request and turns it into a json object and then lets it pass to the next request

app.get('/users', (req:Request, res:Response)=>{
    res.json(users);
});

app.post('/users', (req:Request, res:Response)=>{
     console.log(req.body);
     let {userId, username, password, firstName, lastName, email, role} = req.body
     if(userId && username && password && firstName && lastName && email && role){
         users.push({userId, username, password, firstName, lastName, email, role});
         res.sendStatus(201)
     }else{
         res.status(400).send("Please enter all required information.");
        //throw new UserInputError();
     }
     res.sendStatus(501);
})

app.listen(2006, ()=>{
    console.log('Server has started.');
});

/*app.use('/', (req, res)=>{
    res.send(homePageStrStart);
    //res.send(homePageStrEnd);
}); */

let users:User[] = [
    {
        userId: 101,
        username: "lauras",
        password: "password",
        firstName: "Laura",
        lastName: "Fakelaname",
        email: "lauras@fakemail.com",
        role: [{
            roleId: 1, 
            role: "owner,developer,mathematician"
        }]
    },
    {
        userId: 102,
        username: "emmas",
        password: "password",
        firstName: "Emma",
        lastName: "Fakelaname",
        email: "emmas@fakemail.com",
        role: [{
            roleId: 3, 
            role: "developer,sales"
        }]
    },
    {
        userId: 103,
        username: "joboah",
        password: "password",
        firstName: "Joboa",
        lastName: "Fakelaname",
        email: "joboah@fakemail.com",
        role: [{
            roleId: 2, 
            role: "networkAdmin,developer"
        }]
    },
    {
        userId: 104,
        username: "rachelr",
        password: "password",
        firstName: "Rachel",
        lastName: "Fakelaname",
        email: "rachelr@fakemail.com",
        role: [{
            roleId: 3, 
            role: "developer, mathematician"
        }]
    },
    {
        userId: 105,
        username: "firdevsy",
        password: "password",
        firstName: "Firdevs",
        lastName: "Fakelaname",
        email: "firdevsy@fakemail.com",
        role: [{
            roleId: 3, 
            role: "developer,tester"
        }]
    },
    {
        userId: 106,
        username: "taniquea",
        password: "password",
        firstName: "Tanique",
        lastName: "Fakelaname",
        email: "taniquea@fakemail.com",
        role: [{
            roleId: 3, 
            role: "developer,writer"
        }]
    },
    {
        userId: 107,
        username: "rebap",
        password: "password",
        firstName: "Reba",
        lastName: "Fakelaname",
        email: "rebap@fakemail.com",
        role: [{
            roleId: 1, 
            role: "developer,human resources"
        }]
    },
    {
        userId: 108,
        username: "chrishp",
        password: "password",
        firstName: "Chrish",
        lastName: "Fakelaname",
        email: "chrishp@fakemail.com",
        role: [{
            roleId: 3, 
            role: "developer,writer"
        }]
    }
]