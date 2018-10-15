const { describe, it } = require("mocha");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const expect = chai.expect;

const { compose } = require("../src/compose");

describe("calamari.compose unit tests", () => {
    const returnWithEcho = (input) => input;
    const resolveDoubler = (input) => Promise.resolve(input * 2);
    const rejectWithEcho = (input) => Promise.reject(input);
    const resolveWithAppend = (input) => {
        input.push(input.length);
        return Promise.resolve(input);
    };

    it("Empty input should throw an error", () => {
        expect(compose()).to.throw("calamari.compose expects an array as an input");
    });

    it("Non-array input should throw an error", () => {
        expect(compose("hi")).to.throw("calamari.compose expects an array as an input");
        expect(compose({
            hello: "world"
        })).to.throw("calamari.compose expects an array as an input");
    });

    it("The result of compose is a function", () => {
        expect(compose([
            resolveDoubler,
            resolveDoubler,
            resolveDoubler
        ])).to.be.a("function");
    });

    it("Synchronous functions are ok", () => {
        const composedFunction = compose([
            returnWithEcho,
            returnWithEcho
        ]);

        expect(composedFunction(42)).to.eventually.equal(42);
    });

    it("Basic chain test with string", () => {
        const composedFunction = compose([
            returnWithEcho,
            returnWithEcho,
            returnWithEcho,
            returnWithEcho,
            returnWithEcho,
            returnWithEcho
        ]);

        expect(composedFunction("hi")).to.eventually.equal("hi");
    });

    it("Basic chain test with object", () => {
        const composedFunction = compose([
            returnWithEcho,
            returnWithEcho,
            returnWithEcho,
            returnWithEcho,
            returnWithEcho,
            returnWithEcho
        ]);

        const payload = { message: "hello world" };

        expect(composedFunction(payload)).to.eventually.equal(payload);
    });

    it("An unbroken chain of resolves should work", () => {
        const composedFunction = compose([
            resolveDoubler,
            resolveDoubler,
            resolveDoubler
        ]);

        expect(composedFunction(2)).to.eventually.equal(16);
    });

    it("Chain with an array input preserves the original ref", () => {
        const composedFunction = compose([
            resolveWithAppend,
            resolveWithAppend,
            resolveWithAppend,
            resolveWithAppend,
            resolveWithAppend
        ]);

        expect(composedFunction([0])).to.eventually.eql([0, 1, 2, 3, 4, 5]);
    });

    it("The chain should stop if something rejects", () => {
        const composedFunction = compose([
            resolveDoubler,
            resolveDoubler,
            rejectWithEcho,
            resolveDoubler
        ]);

        expect(composedFunction(3)).to.eventually.be.rejectedWith(12);
    });
});