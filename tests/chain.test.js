const { describe, it } = require("mocha");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const expect = chai.expect;

const chain = require("../src/chain");

describe("calamari.chain unit tests", () => {
    describe("test bad input", () => {
        it("Empty input should throw an error", () => {
            expect(chain()).to.throw("calamari.compose expects an array as an input");
        });

        it("Non-array input should throw an error", () => {
            expect(chain("hi")).to.throw("calamari.compose expects an array as an input");
            expect(chain({
                hello: "world"
            })).to.throw("calamari.compose expects an array as an input");
        });
    });

    describe("test normal use cases", () => {
        const returnWithEcho = (input) => input;
        const resolveDoubler = (input) => Promise.resolve(input * 2);
        const rejectWithEcho = (input) => Promise.reject(input);
        const resolveWithAppend = (input) => {
            input.push(input.length);
            return Promise.resolve(input);
        };
        it("The result of compose is a function", () => {
            expect(chain([
                resolveDoubler,
                resolveDoubler,
                resolveDoubler
            ])).to.be.a("function");
        });

        it("Synchronous functions are ok", () => {
            const composedFunction = chain([
                returnWithEcho,
                returnWithEcho
            ]);

            expect(composedFunction(42)).to.eventually.equal(42);
        });

        it("Basic chain test with string", () => {
            const composedFunction = chain([
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
            const composedFunction = chain([
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
            const composedFunction = chain([
                resolveDoubler,
                resolveDoubler,
                resolveDoubler
            ]);

            expect(composedFunction(2)).to.eventually.equal(16);
        });

        it("Chain with an array input preserves the original ref", () => {
            const composedFunction = chain([
                resolveWithAppend,
                resolveWithAppend,
                resolveWithAppend,
                resolveWithAppend,
                resolveWithAppend
            ]);

            expect(composedFunction([0])).to.eventually.eql([0, 1, 2, 3, 4, 5]);
        });

        it("The chain should stop if something rejects", () => {
            const composedFunction = chain([
                resolveDoubler,
                resolveDoubler,
                rejectWithEcho,
                resolveDoubler
            ]);

            expect(composedFunction(3)).to.eventually.be.rejectedWith(12);
        });
    });
});