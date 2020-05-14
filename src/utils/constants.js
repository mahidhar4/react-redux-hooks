export const enumPriority = {
    None: "None",
    Low: "Low",
    Medium: "Medium",
    High: "High"
};

export const enumState = {
    Open: "Open",
    Done: "Done"
};

export const groupByFn = function(xs, key) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};