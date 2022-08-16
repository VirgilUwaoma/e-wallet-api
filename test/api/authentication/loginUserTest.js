const expect = require("chai").expect;
const request = require("supertest");
const server = require("../../../server");
const knex = require("../../../database/db_config");

describe("GET /auth/login", () => {
  describe("request body is empty", () => {
    beforeEach(function () {
      return knex.migrate
        .rollback()
        .then(function () {
          return knex.migrate.latest();
        })
        .then(function () {
          return knex.seed.run();
        });
    });
    const req = {};
    it("should return status 400 and success-false", (done) => {
      request(server)
        .get("/api/v1/auth/login")
        .send(req)
        .then((res) => {
          expect(res.status).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal("empty request body");
          done();
        })
        .catch(done);
    });
  });
  describe("request email is missing", () => {
    beforeEach(function () {
      return knex.migrate
        .rollback()
        .then(function () {
          return knex.migrate.latest();
        })
        .then(function () {
          return knex.seed.run();
        });
    });
    const req = {
      email: null,
      password: "1",
    };
    it("should return status 400 and success-false", (done) => {
      request(server)
        .get("/api/v1/auth/login")
        .send(req)
        .then((res) => {
          expect(res.status).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal("email required");
          done();
        })
        .catch(done);
    });
  });
  describe("request password is missing", () => {
    beforeEach(function () {
      return knex.migrate
        .rollback()
        .then(function () {
          return knex.migrate.latest();
        })
        .then(function () {
          return knex.seed.run();
        });
    });
    const req = {
      email: "user1@user.com",
      password: null,
    };
    it("should return status 400 and success-false", (done) => {
      request(server)
        .get("/api/v1/auth/login")
        .send(req)
        .then((res) => {
          expect(res.status).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal("password required");
          done();
        })
        .catch(done);
    });
  });
  describe("user email doen't exist", () => {
    beforeEach(function () {
      return knex.migrate
        .rollback()
        .then(function () {
          return knex.migrate.latest();
        })
        .then(function () {
          return knex.seed.run();
        });
    });
    const req = {
      email: "user14@user.com",
      password: "1",
    };
    it("should return status 400 and success-false", (done) => {
      request(server)
        .get("/api/v1/auth/login")
        .send(req)
        .then((res) => {
          expect(res.status).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal("user email doesn't exist");
          done();
        })
        .catch(done);
    });
  });
  describe("proper email and password", () => {
    beforeEach(function () {
      return knex.migrate
        .rollback()
        .then(function () {
          return knex.migrate.latest();
        })
        .then(function () {
          return knex.seed.run();
        });
    });
    const req = {
      email: "user1@user.com",
      password: "1",
    };
    it("should return status 200, success-true,json with token", (done) => {
      request(server)
        .get("/api/v1/auth/login")
        .send(req)
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to.equal("login successful");
          expect(res.body).to.contain.property("token");
          done();
        })
        .catch((e) => {
          console.log(e);
        });
    });
  });
});
