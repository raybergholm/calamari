const settle = async (promises) => {
    if (!(promises instanceof Array)) {
        throw Error("calamari.settle expects an array as an input");
    }

    const results = await Promise.all(promises.map(async (entry) => {
        const promise = entry.then ? entry : Promise.resolve(entry);

        try {
            return { success: await promise };
        } catch (error) {
            return { error };
        }
    }));

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
        }
    );
};

module.exports = settle;
