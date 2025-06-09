const express = require('express');
const users = require('./users_data.js');

const app = express();
app.use(express.json());
//home route

app.get('/', (req, res) => {
    return res.status(200).send("Wellcome to API");
})

//get all customers

app.get('/api/users', (req, res) => {
    return res.status(200).send(users);
})

//get a single customer by id

app.get('/api/users/:id', (req, res) => {

    const userId = parseInt(req.params.id);

    if(isNaN(userId)) return res.status(400).send({error: "Id should be a number"})

    //check for presence of user

    const user = users.find(u => u.id === userId);

    if(!user) return res.status(404).send({message: "User not found!"});

    res.status(200).send({data: user});
})

//creating a user

app.post('/api/users', (req, res) => {

    const {name, email, age} = req.body;
    
    const {error} = inputValidation(name, email, age);

    if(error) return res.status(400).send({error});

    const newUser = {id: users[users.length - 1].id + 1, name, email, age};
    users.push(newUser);

    res.status(201).send({data: newUser});

})


app.put('/api/users/:id', (req, res) => {
    const {name, email, age} = req.body;
    const userId = parseInt(req.params.id);
    
    const {error} = inputValidation(name, email, age);

    if(error) return res.status(400).send({error});

    if(isNaN(userId)) return res.status(400).send({error: "Id should be a number"})

    //check for presence of user
    const index = users.findIndex(u => u.id === userId);
    if(index == -1) return res.status(404).send({message: "User not found!"});

    users[index] = {id: userId, name, email, age};

    res.status(200).send({data: users[index]});
})


app.delete('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    if(isNaN(userId)) return res.status(400).send({error: "Id should be a number"})

    const index = users.findIndex(u => u.id === userId);

    if(index == -1) return res.status(404).send({message: "User not found!"});
    const toBeDeleted = users[index];
    users.splice(index, 1);

    res.status(200).send({data: toBeDeleted});
})


function inputValidation(name, email, age){
    if(!name || name.trim().length <= 2) 
        return {error: "Name shoud be minimum of 3 characters" };

    if(!email || !email.includes("@") || !email.includes(".")) 
        return {error: "Invalid email"};

    if(isNaN(age) || age <= 0) 
        return {error: "Invalid age"};
    return {error: null}
}


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));

