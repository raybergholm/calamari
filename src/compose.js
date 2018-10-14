export const compose = (functions) => {
    if (!(functions instanceof Array)) {
        throw Error("calamari.compose expects an array as an input");
    }

    if (functions.filter((entry) => typeof entry !== "function").length > 0) {
        throw Error("calamari.compose expects an array of functions");
    }

    return (initialArgs) => functions.reduce(async (previous, entry) => {
        const result = await previous;
        return entry(result);
    }, Promise.resolve(initialArgs));
};

export const composeThen = (functions, ...initialArgs) => {
    if (!(functions instanceof Array)) {
        throw Error("calamari.compose expects an array as an input");
    }

    if (functions.filter((entry) => typeof entry !== "function").length > 0) {
        throw Error("calamari.compose expects an array of functions");
    }

    return functions.reduce((previous, entry) => previous.then((result) => entry(result)), Promise.resolve(...initialArgs));
};