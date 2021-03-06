import React from "react";
import { enumState, hasValue } from "../../utils/constants";
import { Button } from "react-bootstrap";

const enumClick = {
    Edit: "Edit",
    Delete: "Delete",
    Done: "Done",
    ReOpen: "ReOpen",
    View: "View"
};

const filterAndAttachRow = (header, innerItem, search) => {
    let strData = (header.type === "date" ?
        new Date(innerItem[header.field]).toLocaleDateString() :
        innerItem[header.field]);

    if (header.filterable && hasValue(search) && hasValue(strData)) {
        const start = strData.toLowerCase().indexOf(search.toLowerCase());
        const middle = search.length;
        const end = start + middle;
        if (start > -1) {
            strData = <>
                <span>{strData.substr(0, start)}</span>
                <span className="higlight">{strData.substr(start, middle)}</span>
                <span>{strData.substr(end)}</span>
            </>;
        }
    }

    return strData;
};

// usage
/* <GridList
          tasksList={data}
          gridColumns={props.configData.GridColumns}
          onSort={onSort}
          setArrow={setArrow}
          groupBy={groupBy}
          handleClick={handleClick} /> */

export const GridList = (props) => {
    return (
        <>
            <table>
                <thead>
                    <tr key={`grid-header`}>
                        {props.gridColumns.map((header, headerIndex) => {
                            return !header.hidden ? <th key={`grid-header-${headerIndex}`}
                                onClick={() => header.sortable ? props.onSort(header.field) : null}>
                                {/*...(header.sortable && { onClick: props.onSort(header.field) })} */}
                                <span>{header.title}</span>
                                {header.sortable ? <span className={props.setArrow(header.field)}></span> : <></>}
                            </th> : null
                        })}
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(props.tasksList).map((item) => {
                        return props.tasksList[item].map((innerItem, innerIndex) => {
                            return (
                                <>
                                    {item !== undefined && innerIndex === 0 && props.groupBy && (
                                        <tr className="grouping-headers">
                                            <td colSpan={props.gridColumns.filter(item => item.hidden !== true).length}>
                                                {props.groupBy && props.gridColumns.filter(item => item.field === props.groupBy)[0].type === "date"
                                                    ? new Date(item).toLocaleDateString()
                                                    : item}
                                            </td>
                                        </tr>
                                    )}

                                    <tr className={innerItem.state === enumState.Done ? "done" : ""}
                                        onClick={(event) => props.handleClick(event, innerItem, enumClick.View)}>

                                        {props.gridColumns.map((header, headerIndex) => {
                                            return !header.template ?
                                                (!header.hidden ? <td key={`grid-data-${headerIndex}-${innerIndex}`}>
                                                    {filterAndAttachRow(header, innerItem, props.filterVal)}
                                                </td> : <></>) : (
                                                    <td>
                                                        {innerItem.state === enumState.Open ? (
                                                            <>
                                                                <Button size="sm" variant="secondary" onClick={(event) => props.handleClick(event, innerItem, enumClick.Edit)}>
                                                                    Edit
                                                             </Button>{" "}
                                                                <Button size="sm" variant="danger" onClick={(event) => props.handleClick(event, innerItem, enumClick.Delete)}>
                                                                    Delete
                                                             </Button>{" "}
                                                                <Button size="sm" variant="primary" onClick={(event) => props.handleClick(event, innerItem, enumClick.Done)}>
                                                                    Done
                                                             </Button>
                                                            </>
                                                        ) : (
                                                                <Button size="sm" variant="primary" onClick={(event) => props.handleClick(event, innerItem, enumClick.ReOpen)}>
                                                                    Re-open
                                                                </Button>
                                                            )}
                                                    </td>
                                                )
                                        })}

                                    </tr>
                                </>
                            );
                        });
                    })}
                </tbody>
            </table>
        </>
    );
};
