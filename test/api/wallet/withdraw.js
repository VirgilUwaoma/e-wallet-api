const expect = require("chai").expect;
const request = require("supertest");
const server = require("../../../server");
const knex = require("../../../database/db_config");

describe("POST /wallet/withdraw", () => {
  describe("request doesn't have a bearer token", () => {
    const req = { amount: 1000 };
    it("should return status 403 success-false", (done) => {
      request(server)
        .post("/api/v1/wallet/withdraw")
        .send(req)
        .then((res) => {
          expect(res.status).to.equal(403);
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal("no authorization token");
          done();
        })
        .catch(done);
    });
  });
  describe("request bearer token doesn't have payload", () => {
    const req = { amount: 1000 };
    const token = "Bearer";
    it("should return status 403 success-false", (done) => {
      request(server)
        .post("/api/v1/wallet/withdraw")
        .set("Authorization", token)
        .send(req)
        .then((res) => {
          expect(res.status).to.equal(403);
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal("invalid token");
          done();
        })
        .catch(done);
    });
  });
  describe("request bearer token payload invalid", () => {
    req = { amount: 1000 };
    const token = "Bearer eyJhbGci.eyJpZIm1vYmlsZm.PKySv5";
    it("should return status 403 success-false", (done) => {
      request(server)
        .post("/api/v1/wallet/withdraw")
        .set("Authorization", token)
        .send(req)
        .then((res) => {
          expect(res.status).to.equal(403);
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal("invalid token");
          done();
        })
        .catch(done);
    });
  });
  describe("proper request token and amount", () => {
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
    const req = { amount: 200 };
    const token =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyMUB1c2VyLmNvbSIsIm1vYmlsZV9udW1iZXIiOjEsImFjdGlvbnMiOiJhbGwiLCJpYXQiOjE2NjA2ODkzMDR9.pejQQj4Em62Da0rWh5-C_1thRhjn-pT4OxZ86_2FElM";
    it("should return status 200, success-true, transaction_id", (done) => {
      request(server)
        .post("/api/v1/wallet/withdraw")
        .set("Authorization", token)
        .send(req)
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to.equal(`withdraw successful`);
          expect(res.body).to.contain.property("transaction_id");
          done();
        })
        .catch(done);
    });
  });
  describe("proper request token, amount not a number or null ", () => {
    const req = { amount: null };
    const token =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyMUB1c2VyLmNvbSIsIm1vYmlsZV9udW1iZXIiOjEsImFjdGlvbnMiOiJhbGwiLCJpYXQiOjE2NjA2ODkzMDR9.pejQQj4Em62Da0rWh5-C_1thRhjn-pT4OxZ86_2FElM";
    it("should return status 400 success-false", (done) => {
      request(server)
        .post("/api/v1/wallet/withdraw")
        .set("Authorization", token)
        .send(req)
        .then((res) => {
          expect(res.status).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal("withdrawal amount required");
          done();
        })
        .catch(done);
    });
  });
  describe("proper request token, amount is negative", () => {
    const req = { amount: -1000 };
    const token =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyMUB1c2VyLmNvbSIsIm1vYmlsZV9udW1iZXIiOjEsImFjdGlvbnMiOiJhbGwiLCJpYXQiOjE2NjA2ODkzMDR9.pejQQj4Em62Da0rWh5-C_1thRhjn-pT4OxZ86_2FElM";
    it("should return status 400 success-false", (done) => {
      request(server)
        .post("/api/v1/wallet/fund")
        .set("Authorization", token)
        .send(req)
        .then((res) => {
          expect(res.status).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal(
            "amount cannot be zero or negative"
          );
          done();
        })
        .catch(done);
    });
  });
  describe("proper request token, amount is greater than balance", () => {
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
    const req = { amount: 2000 };
    const token =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyMUB1c2VyLmNvbSIsIm1vYmlsZV9udW1iZXIiOjEsImFjdGlvbnMiOiJhbGwiLCJpYXQiOjE2NjA2ODkzMDR9.pejQQj4Em62Da0rWh5-C_1thRhjn-pT4OxZ86_2FElM";
    it("should return status 400 success-false, insufficient funds", (done) => {
      request(server)
        .post("/api/v1/wallet/withdraw")
        .set("Authorization", token)
        .send(req)
        .then((res) => {
          expect(res.status).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal("insufficient funds");
          done();
        })
        .catch(done);
    });
  });
});
