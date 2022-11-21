const { use } = require('chai')
const express = require('express')
const app = express()
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

// routes
app.get('/', (req, res) => {
    res.status(200).json("Hello World")
});

const { Client, Account, Transaction }  = require('./src/db/models/');

// get all clients
app.get('/clients', (req, res) => {
    Client.findAll()
    .then(clients => {
        res.status(200).json(clients)
    })
    .catch(err => {
        res.status(500).json(err)
    })
});

// create a client
app.post('/clients', async function (req, res) {
    let { name, surname, dni } = req.body;
    
    console.log(req.body)
    let valid = validateClient(req);
    let searchCLient = await Client.findOne({ where: { dni: dni } });

    if(!valid || searchCLient!==null) {
        res.status(200).json("Could not create Clinet")
    } else {
        try {
            
            Client.create({
                    name: name,
                    surname: surname,
                    dni: dni,
            }).then(async client => {
                await createNewAccount(client.id);
                res.status(201).json("Client created");
            });
            
        } catch (error) {
            console.log(error);
            res.status(400).json(error)
        }
    } 

});

// update a client
app.put('/clients/:id', async function (req, res) {
    
    let { name, surname, dni, accountId } = req.body;
    let userId = req.params.id;
    
    let valid = validateClient(req);

    if(!valid) {
        res.status(200).json("Missing parameters")
    } else {
        try {
        
            let client = await Client.findByPk(userId);

            if(client) {
                client.update({
                    name: name,
                    surname: surname,
                    dni: dni,
                    accountId: accountId

                });
                res.status(201).json("Client updated");
            } else {
                res.status(404).json("Client not found");
            }
        
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }
});

// delete a client by id
app.delete('/clients/:id', async function (req, res) {
    
    let userId = req.params.id;
    
    if(!userId) {
        res.status(200).json("Missing parameters")
    }

    try {
        Client.destroy({
            where: {
                id: userId
            }
        }).then(() => {     
            res.status(201).json("Client deleted");
        }).catch(err => {
            console.log(err);
            res.status(400).json(err);
        });

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});

const createNewAccount = async (clientId) => {

    let accountExists = true;

    while(accountExists) {
        let accountNumber = Math.floor(Math.random() * 1000000000);
        let account = await Account.findOne({ where: { number: accountNumber } });
        
        if(account === null) {
            accountExists = false;
            
            let newAccount = await Account.create({
                number: accountNumber,
                balance: 0,
                clientId: clientId
            });

            return newAccount;
        }
    }

}


const validateClient =  (req) => {
    
    let client = req.body;
    let valid = false;
    
    if(!client.name || !client.surname || !client.dni 
        || client.name === "" || client.surname === "" || client.dni === "" 
        || client.dni < 0  || client.name.length > 50 || client.surname.length > 50) {
            valid = false;
        } else {
            valid = true;
        }
    return valid;
}

// port
app.listen(process.env.PORT, () => {
    console.log(`Servidor:  http://localhost:${process.env.PORT}`)
})
