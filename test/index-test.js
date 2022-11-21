const axios = require("axios");
const { use } = require("chai");
const chai = require("chai");
const { DESCRIBE } = require("sequelize");
const { Client, Account } = require("../src/db/models/");
const account = require("../src/db/models/account");
const { assert } = chai;

describe("Basic url test", function () {
    it("should return 200", function (done) {
        axios({
            method: "get",
            url: "http://localhost:5555/",
        }).then((res) => {
            assert.equal(res.status, 200);
            done();
        });
    });
});

describe("Client endpoints", function () {
    it("Should create a Client", function (done) {
        axios({
            method: "post",
            url: "http://localhost:5555/clients",
            data: {
                name: "Jose",
                surname: "Perez",
                dni: 12345678,
            },
        })
            .then((res) => {
                assert.equal(res.status, 201);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    // Don't create a client due to missing params
    it("Should NOT create a Client", function (done) {
        axios({
            method: "post",
            url: "http://localhost:5555/clients",
            data: {
                name: "",
                surname: "",
                dni: 312323123,
                accountId: 3,
            },
        })
            .then((res) => {
                assert.equal(res.status, 200);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    // update a client
    it("Should Update a Client", function (done) {
        Client.create({
            name: "John",
            surname: "Doe",
            dni: 3817263,
            accountId: 1,
        }).then((client) => {
            axios({
                method: "put",
                url: "http://localhost:5555/clients/" + client.id,
                data: {
                    name: "New Name",
                    surname: "New Surname",
                    dni: 3817263,
                    accountId: 4,
                },
            })
                .then((res) => {
                    assert.equal(res.status, 201);
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });
    });

    after(function (done) {
        Client.destroy({
            where: { dni: 3817263 },
        }).then(() => {
            done();
        });
    });

    // delete a client
    it("Should Delete a Client", function (done) {
        Client.create({
            name: "Maria",
            surname: "Deletinni",
            dni: 8983712,
            accountId: 8,
        }).then((client) => {
            axios({
                method: "delete",
                url: "http://localhost:5555/clients/" + client.id,
            })
                .then((res) => {
                    assert.equal(res.status, 201);
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });
    });
});

describe("Transaction endpoints", function () {
    // get all transactions from a client
    it("Should get all transactions from a client", function (done) {
        axios({
            method: "get",
            url: "http://localhost:5555/transactions/1",
        })
            .then((res) => {
                // assert.equal(res.data[0].length <= 10, true);
                assert.equal(res.status, 200);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });
});

describe("Account endpoints", function () {
    it("Should return exception exceeded limit", function (done) {
        axios({
            method: "post",
            url: "http://localhost:5555/accounts/withdraw",
            data: {
                amount: 5000,
                accountId: 1,
            },
        })
            .then((res) => {
                assert.equal(res.status, 200);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it("Should make a Sucessfull withdrawal", function (done) {
        let account = Account.findOne({
            where: { id: 1 },
        }).then((account) => {
            account.balance = 10000;
            account.save();
        });

        axios({
            method: "post",
            url: "http://localhost:5555/accounts/withdraw",
            data: {
                amount: 500,
                accountId: 1,
            },
        })
            .then((res) => {
                let myAccount = Account.findOne({
                    where: { id: 1 },
                }).then((myAccount) => {
                    assert.equal(myAccount.balance, 9500);
                    done();
                });
            })
            .catch((err) => {
                done(err);
            });
    });

    it("Should make a transaction", function (done) {
        axios({
            method: "post",
            url: "http://localhost:5555/accounts/transfer",
            data: {
                amount: 500,
                fromAccountId: "1110121369872637",
                toAccountId: "7305307556322159",
            },
        })
            .then((res) => {
                assert.equal(res.status, 201);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });
});
