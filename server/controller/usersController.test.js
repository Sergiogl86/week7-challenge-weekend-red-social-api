const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");
const { addUser, loginUser } = require("./usersController");

jest.mock("../../database/models/user");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Given a addUser function", () => {
  describe("When it receives new user", () => {
    test("Then it should invoke res.json() function with a new user", async () => {
      const req = {
        body: {
          username: "Sergio_gl",
          name: "Sergio",
          password: "entrar",
          age: "35",
          bio: "Algo de mi!",
        },
        file: {
          fieldname: "img",
          originalname: "User_de_prueba.jpg",
          encoding: "7bit",
          mimetype: "image/jpeg",
          destination: "IMG",
          filename: "API_Sergio-User_de_prueba-1636806280063-.jpg",
          path: "IMG\\API_Sergio-User_de_prueba-1636806280063-.jpg",
          size: 6332,
          fileURL:
            "https://storage.googleapis.com/skylab-sergio-red-social-api.appspot.com/API_Sergio-User_de_prueba-1636806280063-.jpg",
        },
      };

      const user = {
        userName: "Usuario_Admin",
        password:
          "$2b$10$.xShGXjq4bjeueI7/9/DquWq5AIJ0d.mBxYs/lmMnf9FFollI4pMC",
        id: "618c181075e76774517f1aa0",
      };

      const res = {
        json: jest.fn(),
      };

      const next = jest.fn();

      bcrypt.hash = jest.fn().mockResolvedValue(user.password);
      User.create = jest.fn().mockResolvedValue(user);

      await addUser(req, res, next);

      expect(res.json).toHaveBeenCalledWith(user);
    });
  });
  describe("When it receives new user with wrong user", () => {
    test("Then it should invoke next() function with a error", async () => {
      const req = {
        body: {
          username: "Sergio_gl",
          name: "Sergio",
          password: "entrar",
          age: "35",
          bio: "Algo de mi!",
        },
        file: {
          fieldname: "img",
          originalname: "User_de_prueba.jpg",
          encoding: "7bit",
          mimetype: "image/jpeg",
          destination: "IMG",
          filename: "API_Sergio-User_de_prueba-1636806280063-.jpg",
          path: "IMG\\API_Sergio-User_de_prueba-1636806280063-.jpg",
          size: 6332,
          fileURL:
            "https://storage.googleapis.com/skylab-sergio-red-social-api.appspot.com/API_Sergio-User_de_prueba-1636806280063-.jpg",
        },
      };

      const user = {
        userName: "Usuario_Admin",
        password:
          "$2b$10$.xShGXjq4bjeueI7/9/DquWq5AIJ0d.mBxYs/lmMnf9FFollI4pMC",
        isAdmin: true,
        id: "618c181075e76774517f1aa0",
      };

      const res = {
        json: jest.fn(),
      };

      const next = jest.fn();

      const expectedError = {
        message: "Datos erroneos!",
        code: 400,
      };

      bcrypt.hash = jest.fn().mockResolvedValue(user.password);
      User.create = jest.fn().mockRejectedValue({});

      await addUser(req, res, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});
