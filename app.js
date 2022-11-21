const { use } = require("chai");
const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.get("/", (req, res) => {
    res.status(200).json("Hello World");
});

const { Client, Account, Transaction } = require("./src/db/models/");

// get all clients
app.get("/clients", (req, res) => {
    Client.findAll()
        .then((clients) => {
            res.status(200).json(clients);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

// create a client
app.post("/clients", async function (req, res) {
    let { name, surname, dni } = req.body;

    console.log(req.body);
    let valid = validateClient(req);
    let searchCLient = await Client.findOne({ where: { dni: dni } });

    if (!valid || searchCLient !== null) {
        res.status(200).json("Could not create Clinet");
    } else {
        try {
            Client.create({
                name: name,
                surname: surname,
                dni: dni,
            }).then(async (client) => {
                await createNewAccount(client.id);
                res.status(201).json("Client created");
            });
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }
});

// update a client
app.put("/clients/:id", async function (req, res) {
    let { name, surname, dni, accountId } = req.body;
    let userId = req.params.id;

    let valid = validateClient(req);

    if (!valid) {
        res.status(200).json("Missing parameters");
    } else {
        try {
            let client = await Client.findByPk(userId);

            if (client) {
                client.update({
                    name: name,
                    surname: surname,
                    dni: dni,
                    accountId: accountId,
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
app.delete("/clients/:id", async function (req, res) {
    let userId = req.params.id;

    if (!userId) {
        res.status(200).json("Missing parameters");
    }

    try {
        Client.destroy({
            where: {
                id: userId,
            },
        })
            .then(() => {
                res.status(201).json("Client deleted");
            })
            .catch((err) => {
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

    while (accountExists) {
        // let accountNumber = Math.floor(Math.random() * 1000000000);
        let accountNumber =
            (Math.random() + "").substring(2, 10) +
            (Math.random() + "").substring(2, 10);

        let account = await Account.findOne({
            where: { number: accountNumber.toString() },
        });

        if (account === null) {
            accountExists = false;

            let newAccount = await Account.create({
                number: accountNumber,
                balance: 0,
                clientId: clientId,
            });

            return newAccount;
        }
    }
};

// Transactions

// get transactions from an account
const { Op } = require("sequelize");

app.get("/transactions/:clientId", async function (req, res) {
    let clientId = req.params.clientId;

    try {
        if (!clientId || clientId === "" || clientId < 0) {
            res.status(200).json("Missing parameters");
        }

        let account = await Account.findOne({ where: { clientId: clientId } });

        if (account) {
            // get reccords sent by Client and Received by Client

            let transactions = await Transaction.findAll({
                where: {
                    [Op.or]: [
                        { fromAccount: account.number },
                        { toAccount: account.number },
                    ],
                },
                limit: 10,
                order: [["createdAt", "DESC"]],
            });

            res.status(200).json(transactions);
        } else {
            res.status(200).json("Missing parameters");
        }
    } catch (error) {
        res.status(400).json("Error");
    }
});

// create an extraction from an account
app.post("/accounts/withdraw", async function (req, res) {
    let { accountId, amount } = req.body;

    try {
        if (!accountId || !amount || accountId === "" || amount === "") {
            res.status(200).json("Missing parameters");
        }

        if (amount <= 1000) {
            let account = await Account.findOne({ where: { id: accountId } });

            if (account.balance >= amount) {
                account.balance = account.balance - amount;
                await account.save();

                res.status(201).json("Withdrawal made");
            }
        } else {
            // res.status(200).json("Only $1.000 Patacones per withdrawal");
            throw new Error("Only $1.000 Patacones per withdrawal");
        }
    } catch (error) {
        res.status(200).json(error.message);
    }
});

// make a transaction to an account
app.post("/accounts/transfer", async function (req, res) {
    let { fromAccountId, toAccountId, amount } = req.body;

    let myAccount = await Account.findOne({ where: { number: fromAccountId } });
    let toAccount = await Account.findOne({ where: { number: toAccountId } });

    try {
        if (
            !fromAccountId ||
            !toAccountId ||
            !amount ||
            fromAccountId === "" ||
            toAccountId === "" ||
            amount === ""
        ) {
            res.status(200).json("Missing parameters");
        }

        if (myAccount.balance >= amount) {
            myAccount.balance = myAccount.balance - amount;
            await myAccount.save();

            toAccount.balance = toAccount.balance + amount;
            await toAccount.save();

            await Transaction.create({
                fromAccount: fromAccountId,
                toAccount: toAccountId,
                amount: amount,
                description: "Transfer",
            });

            res.status(201).json("Transferencia realizada");
        } else {
            throw new Error("Fondos Insuficientes");
        }
    } catch (error) {
        res.status(200).json(error.message);
    }
});

const validateClient = (req) => {
    let client = req.body;
    let valid = false;

    if (
        !client.name ||
        !client.surname ||
        !client.dni ||
        client.name === "" ||
        client.surname === "" ||
        client.dni === "" ||
        client.dni < 0 ||
        client.name.length > 50 ||
        client.surname.length > 50
    ) {
        valid = false;
    } else {
        valid = true;
    }
    return valid;
};

// port
app.listen(process.env.PORT, () => {
    console.log(`Servidor:  http://localhost:${process.env.PORT}`);
});
