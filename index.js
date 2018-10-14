const { settle } = require("./src/settle");
const { compose } = require("./src/compose");

const calamari = {
    settle,
    compose
};

module.exports = calamari;