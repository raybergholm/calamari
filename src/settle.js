export const settle = async (promises) => {
    if (!(promises instanceof Array)) {
        throw Error("calamari.settle expects an array as an input");
    }

    const results = await Promise.all(promises.map((entry) => entry.then(
        (success) => ({
            success
        }),
        (error) => ({
            error
        })
    )));

    return results.reduce((accumulator, entry) => {
        if (entry.error) {
            accumulator.error.push(entry.error);
        } else {
            accumulator.success.push(entry.success);
        }
        return accumulator;
    }, {
        success: [],
        error: []
    });
};