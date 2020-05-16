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

export const applySearchSortGroupOnData = function(dataSource, searchVal, propsToSearch, propToGroup, sortDetails, statusFilter) {

    if (hasValue(statusFilter))
        dataSource = dataSource.filter(item => item.state === statusFilter);

    dataSource = searchDataSource(dataSource, searchVal, propsToSearch);

    if (hasValue(sortDetails) && hasValue(sortDetails.column))
        dataSource = sortData(dataSource, sortDetails.column, sortDetails.direction);

    return dataSource.reduce(function(rv, x) {
        (rv[x[propToGroup]] = rv[x[propToGroup]] || []).push(x);
        return rv;
    }, {});
};

const searchDataSource = (dataSource, searchVal, propsToSearch) => {

    if (!hasValue(dataSource) || !hasValue(searchVal) || !hasValue(propsToSearch) || propsToSearch.length <= 0) return dataSource;

    return dataSource.filter((item) => {
        return propsToSearch.some((eachProp) => {
            return item[eachProp].toLowerCase().indexOf(searchVal.toLowerCase()) > -1;
        });
    });
};

export const EntryWindowMode = {
    Add: 1,
    Edit: 2,
    View: 3
};

export const hasValue = (val) => {
    return val !== null && val !== undefined && val.toString().trim().length > 0;
};

export function createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function sortData(dataSource, column, direction) {

    let sortedData = dataSource.sort((a, b) => {
        if (column === "taskSummary" || column === "priority" || column === "state") {
            const nameA = a[column].toUpperCase();
            const nameB = b[column].toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        } else {
            return (
                convertDate(new Date(a[column]).toLocaleDateString()) -
                convertDate(new Date(b[column]).toLocaleDateString())
            );
        }
    });

    if (direction === "desc") {
        sortedData.reverse();
    }
    return sortedData;
};


const convertDate = (d) => {
    var p = d.split("/");
    return +(p[2] + p[1] + p[0]);
};