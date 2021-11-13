const { ValidationError } = require("express-validation");
const { noEncontradoHandler, finalErrorHandler } = require("./error");

describe("Given a noEncontradoHandler function,", () => {
  describe("When it receives a request and a response,", () => {
    test("Then it should invoke a res.json function with and object.", async () => {
      const res = (() => {
        const testedRes = {};
        testedRes.status = jest.fn().mockReturnValue(testedRes);
        testedRes.json = jest.fn().mockReturnValue(testedRes);

        return testedRes;
      })();

      await noEncontradoHandler(null, res);

      expect(res.status).toHaveBeenCalled();
    });
  });
});

describe("Given a finalErrorHandler function,", () => {
  describe("When it receives an error instance of ValidationError, a request, a response and a next function,", () => {
    test("Then it should return a response with status 400.", async () => {
      const error = new ValidationError("", "", 1, "", {});
      const res = (() => {
        const testedRes = {};
        testedRes.status = jest.fn().mockReturnValue(testedRes);
        testedRes.json = jest.fn().mockReturnValue(testedRes);

        return testedRes;
      })();

      await finalErrorHandler(error, null, res, null);

      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("When it receives an random error, a request, a response and a next function,", () => {
    test("Then it should return a response with status 500.", async () => {
      const error = {};
      const res = (() => {
        const testedRes = {};
        testedRes.status = jest.fn().mockReturnValue(testedRes);
        testedRes.json = jest.fn().mockReturnValue(testedRes);

        return testedRes;
      })();

      await finalErrorHandler(error, null, res, null);

      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});

// const error = new ValidationError("details", {
//   statusCode: 500,
//   error: new Error()
// })
