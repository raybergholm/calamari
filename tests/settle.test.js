const { describe, it } = require("mocha");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const expect = chai.expect;
const should = chai.should;

const { settle } = require("../src/settle");

describe("calamari.settle unit tests", () => {
    const return200 = () => 200;
    const instantResolve = () => Promise.resolve(200);
    const instantReject = () => Promise.reject(400);

    it("", () => {

    });
});
