const chain = (functions) => (initialArgs) => {
    if (!(functions instanceof Array)) {
        throw Error("calamari.compose expects an array as an input");
    }

    if (functions.filter((entry) => typeof entry !== "function").length > 0) {
        throw Error("calamari.compose expects an array of functions");
    }

    return functions.reduce(
        (previous, current) => previous.then((result) => current(result)),
        Promise.resolve(initialArgs)
    );
};

module.exports = chain;
