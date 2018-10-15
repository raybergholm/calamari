const { describe, it } = require("mocha");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const expect = chai.expect;

const { compose } = require("../src/compose");

describe("calamari.compose unit tests", () => {

    it("Empty input should throw an error", () => {
        expect(compose()).to.eventually.be.rejectedWith("calamari.compose expects an array as an input");
    });

    it("Non-array input should throw an error", () => {
        expect(compose("hi")).to.eventually.be.rejectedWith("calamari.compose expects an array as an input");
        expect(compose({
            hello: "world"
        })).to.eventually.be.rejectedWith("calamari.compose expects an array as an input");
    });
});