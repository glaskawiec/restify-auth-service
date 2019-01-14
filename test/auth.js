const chai = require("chai");
const chaiHttp = require("chai-http");
const supertest = require("supertest");
const { expect } = require("chai");
const httpStatus = require("http-status");
const config = require("config");
const server = require("../src/server");
const User = require("../src/models/User");

// During the test the env variable is set to test
process.env.NODE_ENV = "test";

chai.use(chaiHttp);
// Our parent block
describe("Auth routes", () => {
  let dbUser;
  let user;

  beforeEach(async () => {
    dbUser = {
      email: "test@gmail.com",
      password: "test",
      displayName: "Tests User"
    };

    user = {
      email: "branstark@gmail.com",
      password: "mypassword",
      displayName: "Bran Stark"
    };

    await User.deleteMany({});
    await User.create(dbUser);
  });

  describe("POST /v1/auth/register", () => {
    it("should register a new user and return success code when request is valid.", () =>
      supertest(server)
        .post("/v1/auth/register")
        .send(user)
        .expect(httpStatus.CREATED)
        .then(res => {
          expect(res.body.code).to.be.equal("Created");
          expect(res.body.message).to.be.equal(
            "User was successfully created."
          );
        }));

    it("should return error when email provided is not valid.", () => {
      user.email = "this_is_not_an_email";
      return supertest(server)
        .post("/v1/auth/register")
        .send(user)
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.code).to.be.equal("BadRequest");
          expect(res.body.message).to.be.equal('"email" must be a valid email');
        });
    });

    it("should return error when request body is empty.", () =>
      supertest(server)
        .post("/v1/auth/register")
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.code).to.be.equal("BadRequest");
          expect(res.body.message).to.be.equal('"password" is required');
        }));

    it("should return error when email is not provided.", () => {
      delete user.email;
      return supertest(server)
        .post("/v1/auth/register")
        .send(user)
        .expect(400)
        .then(res => {
          expect(res.body.code).to.be.equal("BadRequest");
          expect(res.body.message).to.be.equal('"email" is required');
        });
    });

    it("should return error when password is not provided.", () => {
      delete user.password;
      return supertest(server)
        .post("/v1/auth/register")
        .send(user)
        .expect(400)
        .then(res => {
          expect(res.body.code).to.be.equal("BadRequest");
          expect(res.body.message).to.be.equal('"password" is required');
        });
    });

    it("should return error when displayName is not provided.", () => {
      delete user.displayName;
      return supertest(server)
        .post("/v1/auth/register")
        .send(user)
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.code).to.be.equal("BadRequest");
          expect(res.body.message).to.be.equal('"displayName" is required');
        });
    });

    it("should return error when email already exists.", () =>
      supertest(server)
        .post("/v1/auth/register")
        .send(dbUser)
        .expect(httpStatus.CONFLICT)
        .then(res => {
          expect(res.body.code).to.be.equal("Conflict");
          expect(res.body.message).to.be.equal("User Already Exists");
        }));
  });

  describe("POST /v1/auth/login", () => {
    it("should return an accessToken and user info when email and password matches.", () => {
      delete dbUser.displayName;
      return supertest(server)
        .post("/v1/auth/login")
        .send(dbUser)
        .expect(httpStatus.OK)
        .then(res => {
          delete dbUser.password;
          expect(res.body).to.have.a.property("accessToken");
          expect(res.body.user).to.include(dbUser);
        });
    });

    it("should return error when request body is empty.", () =>
      supertest(server)
        .post("/v1/auth/login")
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.code).to.be.equal("BadRequest");
          expect(res.body.message).to.be.equal('"email" is required');
        }));

    it("should return error when password is not provided.", () => {
      delete dbUser.displayName;
      delete dbUser.password;
      return supertest(server)
        .post("/v1/auth/login")
        .send(dbUser)
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.code).to.be.equal("BadRequest");
          expect(res.body.message).to.be.equal('"password" is required');
        });
    });

    it("should return error when email is not provided.", () => {
      delete dbUser.displayName;
      delete dbUser.email;
      return supertest(server)
        .post("/v1/auth/login")
        .send(dbUser)
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.code).to.be.equal("BadRequest");
          expect(res.body.message).to.be.equal('"email" is required');
        });
    });

    it("should return error when the email provided is not registered.", () => {
      delete user.displayName;
      return supertest(server)
        .post("/v1/auth/login")
        .send(user)
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.code).to.be.equal("NotFound");
          expect(res.body.message).to.be.equal(
            "User with provided email not found."
          );
        });
    });

    it("should return error when the password provided do not match.", () => {
      delete dbUser.displayName;
      dbUser.password = "notValid";
      return supertest(server)
        .post("/v1/auth/login")
        .send(dbUser)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body.code).to.be.equal("Unauthorized");
          expect(res.body.message).to.be.equal("Can not authorize.");
        });
    });
  });

  describe("POST /v1/auth/forgot-password", () => {
    it("should send reset password link when provided email is valid.", () => {
      delete dbUser.displayName;
      delete dbUser.password;
      return supertest(server)
        .post("/v1/auth/forgot-password")
        .send(dbUser)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.code).to.be.equal("OK");
          expect(res.body.message).to.be.equal(
            `User password reset token was sent to ${dbUser.email}`
          );
        });
    });

    it("should return error when provided email is not found.", () => {
      delete user.displayName;
      delete user.email;
      return supertest(server)
        .post("/v1/auth/forgot-password")
        .send(user)
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.code).to.be.equal("BadRequest");
          expect(res.body.message).to.be.equal(`"email" is required`);
        });
    });

    it("should return error when provided email is not valid.", () => {
      delete user.displayName;
      user.email = "not_valid";
      return supertest(server)
        .post("/v1/auth/forgot-password")
        .send(user)
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.code).to.be.equal("BadRequest");
          expect(res.body.message).to.be.equal('"email" must be a valid email');
        });
    });

    it("should return error when email is not provided.", () =>
      supertest(server)
        .post("/v1/auth/forgot-password")
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.code).to.be.equal("BadRequest");
          expect(res.body.message).to.be.equal('"email" is required');
        }));
  });
});
