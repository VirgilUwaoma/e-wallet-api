const expect = require("chai").expect;
const request = require("supertest");
const server = require("../../../server");
const knex = require("../../../database/db_config");
const { should } = require("chai");

describe("POST /auth/register", () => {
  describe("request body is empty", () => {
    const req = {};
    it("should return status 400", (done) => {
      request(server)
        .post("/api/v1/auth/register")
        .send(req)
        .then((res) => {
          expect(res.status).to.equal(400);
          done();
        })
        .catch(done);
    });
    it("should return json with message 'empty request body'", (done) => {
      request(server)
        .post("/api/v1/auth/register")
        .send(req)
        .then((res) => {
          expect(res.body).to.contain.property("message");
          expect(res.body.message).to.equal("empty request body");
          expect(typeof res.body).to.equal("object");
          done();
        })
        .catch(done);
    });
  });
  describe("request missing a required field", () => {
    const list = [
      {
        first_name: "User 1",
        last_name: "Users",
        email: "user1@user.com",
        password: "1",
        //no mobile
      },
      {
        first_name: "User 1",
        last_name: "Users",
        email: "user1@user.com",
        mobile_number: 1,
        //no password
      },
      {
        first_name: "User 1",
        last_name: "Users",
        password: "1",
        mobile_number: 1,
        //no email
      },
      {
        first_name: "User 1",
        email: "user1@user.com",
        password: "1",
        mobile_number: 1,
        //no last_name
      },
      {
        last_name: "Users",
        email: "user1@user.com",
        password: "1",
        mobile_number: 1,
        //no first_name
      },
    ];
    list.forEach((req) => {
      it("should return status 400", (done) => {
        request(server)
          .post("/api/v1/auth/register")
          .send(req)
          .then((res) => {
            expect(res.status).to.equal(400);
            done();
          })
          .catch(done);
      });
    });
    list.forEach((req) => {
      it("should return json with message 'required field missing'", (done) => {
        request(server)
          .post("/api/v1/auth/register")
          .send(req)
          .then((res) => {
            expect(res.body).to.contain.property("message");
            expect(res.body.message).to.equal("required field missing");
            expect(typeof res.body).to.equal("object");
            done();
          })
          .catch(done);
      });
    });
  });
  describe("proper request body", () => {
    req = {
      first_name: "User-1",
      last_name: "User",
      email: "user1@user.com",
      password: "password",
      mobile_number: 1,
    };
    beforeEach(function () {
      return knex.migrate.rollback(true).then(function () {
        return knex.migrate.latest();
      });
    });
    after(function () {
      return knex.migrate.rollback(true).then(function () {
        return knex.migrate.latest();
      });
    });
    it("should return status 201", (done) => {
      request(server)
        .post("/api/v1/auth/register")
        .send(req)
        .then((res) => {
          expect(res.status).to.equal(201);
          done();
        })
        .catch(done);
    });
    it("should return json with success - true", (done) => {
      request(server)
        .post("/api/v1/auth/register")
        .send(req)
        .then((res) => {
          expect(res.body.sucess).to.equal(true);
          expect(res.body.message).to.equal(
            `created account for ${req.first_name}`
          );
          done();
        })
        .catch(done);
    });
  });
  describe("email already exists", () => {
    const req = {
      first_name: "User 11",
      last_name: "Users",
      email: "user1@user.com", //same email as User-1
      password: "11",
      mobile_number: 11,
    };

    before(function () {
      return knex.migrate
        .rollback()
        .then(function () {
          return knex.migrate.latest();
        })
        .then(function () {
          return knex.seed.run();
        });
    });

    it("should return status 409", (done) => {
      request(server)
        .post("/api/v1/auth/register")
        .send(req)
        .then((res) => {
          expect(res.status).to.equal(409);
          done();
        })
        .catch(done);
    });
    it("should return json with success false", (done) => {
      request(server)
        .post("/api/v1/auth/register")
        .send(req)
        .then((res) => {
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal("user with email already exists");
          done();
        })
        .catch(done);
    });
  });
  describe("mobile number already exists", () => {
    const req = {
      first_name: "User 10",
      last_name: "Users",
      email: "user10@user.com",
      password: "10",
      mobile_number: 1, //same email as User-1
    };

    before(function () {
      return knex.migrate
        .rollback()
        .then(function () {
          return knex.migrate.latest();
        })
        .then(function () {
          return knex.seed.run();
        });
    });

    it("should return status 409", (done) => {
      request(server)
        .post("/api/v1/auth/register")
        .send(req)
        .then((res) => {
          expect(res.status).to.equal(409);
          done();
        })
        .catch(done);
    });
    it("should return json with success false", (done) => {
      request(server)
        .post("/api/v1/auth/register")
        .send(req)
        .then((res) => {
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal(
            "user with mobile number already exists"
          );
          done();
        })
        .catch(done);
    });
  });
});
