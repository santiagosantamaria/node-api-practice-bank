const axios = require("axios");
const { use } = require("chai");
const chai = require("chai");
const { DESCRIBE } = require("sequelize");
const { Client } = require("../src/db/models/");
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
