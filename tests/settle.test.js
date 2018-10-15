const { describe, it } = require("mocha");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const expect = chai.expect;
const should = chai.should;

const { settle } = require("../src/settle");

describe("calamari.settle unit tests", () => {
    const return42 = () => 42;
    const instantResolveEcho = (input) => Promise.resolve(input);
    const normalFunctionEcho = (input) => input;
    const instantReject = () => Promise.reject(500);
    const instantRejectWithEcho = (input) => Promise.reject(input);
    const throwAnErrorWithEcho = (input) => {
        throw new Error(input);
    };

    it("Empty input should throw an error", () => {
        expect(settle()).to.eventually.be.rejectedWith("calamari.settle expects an array as an input");
    });

    it("Non-array input should throw an error", () => {
        expect(settle("hi")).to.eventually.be.rejectedWith("calamari.settle expects an array as an input");
        expect(settle({
            hello: "world"
        })).to.eventually.be.rejectedWith("calamari.settle expects an array as an input");
    });

    it("Promise.resolve returns results to 'success'", () => {
        expect(settle([
            instantResolveEcho(100),
            instantResolveEcho(200),
            instantResolveEcho({ message: "hi" }),
        ])).to.eventually.eql({
            success: [100, 200, { message: "hi" }],
            error: []
        });
    });

    it("Synchronous methods are fine", () => {
        expect(settle([
            return42(),
            return42(),
            normalFunctionEcho("hello world")
        ])).to.eventually.eql({
            success: [42, 42, "hello world"],
            error: []
        });
    });

    it("Promise.reject get caught in 'error'", () => {
        expect(settle([
            instantReject(),
            instantRejectWithEcho({ message: "nope" })
        ])).to.eventually.eql({
            success: [],
            error: [500, { message: "nope" }]
        });
    });

    it("Thrown errors get evaluated before settle() so they will throw", () => {
        expect(() => settle([
            throwAnErrorWithEcho("crash")
        ])).to.throw("crash");
    });

    it("Kitchen sink", () => {
        expect(settle([
            return42(),
            instantResolveEcho("hello"),
            normalFunctionEcho("world"),
            instantRejectWithEcho({ message: "Internal Server Error" }),
            instantReject()
        ])).to.eventually.eql({
            success: [42, "hello", "world"],
            error: [{ message: "Internal Server Error" }, 500]
        });
    });
});
