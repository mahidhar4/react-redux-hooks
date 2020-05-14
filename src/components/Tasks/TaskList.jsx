import React, { useState, useEffect } from 'react';
import { enumState, groupByFn } from '../../utils/constants';
import './Tasks.scss';
import { connect } from 'react-redux';
import { actions as taskActions } from '../../reducers/actions/tasks';
import Button from 'react-bootstrap/Button';

const TaskList = (props) => {

    const [sort, setSort] = useState({
        column: null,
        direction: 'desc',
    });


    const [groupBy, setGroupBy] = useState("");

    const [data, setData] = useState({});

    useEffect(() => {
        props.getListOfTasks();
    }, []);

    useEffect(() => {
        if (sort.column !== null)
            onSort(sort.column);
        else
            setData(groupByFn(props.tasksList, groupBy));
    }, [props.tasksList]);


    const convertDate = (d) => {
        var p = d.split("/");
        return +(p[2] + p[1] + p[0]);
    }

    const onSort = (column, groupByColumn) => {
        const direction = sort.column ? (sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';

        const sortedData = props.tasksList.sort((a, b) => {
            if (column === 'taskSummary' || column === 'priority') {
                const nameA = a[column].toUpperCase();
                const nameB = b[column].toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            } else {
                return convertDate(new Date(a[column]).toLocaleDateString()) - convertDate(new Date(b[column]).toLocaleDateString());
            }
        });

        if (direction === 'desc') {
            sortedData.reverse();
        }
        if (groupByColumn !== null && groupByColumn !== undefined)
            setData(groupByFn(sortedData, groupByColumn));
        else
            setData(groupByFn(sortedData, groupBy));
        setSort({
            column,
            direction,
        });

    };

    const setArrow = (column) => {
        let className = 'sort-direction';

        if (sort.column === column) {
            className += sort.direction === 'asc' ? ' asc' : ' desc';
        }

        return className;
    };

    const onGroupSelect = (event) => {
        setGroupBy(event.target.value);
        if (sort.column !== null)
            onSort(sort.column, event.target.value);
        else
            setData(groupByFn(props.tasksList, event.target.value));
    };

    return (
        <>
            <select onChange={(e) => onGroupSelect(e)}>
                <option value="">None</option>
                <option value="createdAt">Created On</option>
                <option value="dueDate">Pending On</option>
                <option value="priority">Priority</option>
            </select>
            <ListGrid tasksList={data} onSort={onSort} setArrow={setArrow} groupBy={groupBy} />
        </>
    );
};

const ListGrid = (props) => {
    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => props.onSort('taskSummary')}>
                            Summary
                            <span className={props.setArrow('taskSummary')}></span>
                        </th>
                        <th onClick={() => props.onSort('priority')}>
                            Priority
                            <span className={props.setArrow('priority')}></span>
                        </th>
                        <th onClick={() => props.onSort('createdAt')}>
                            Created on
                            <span className={props.setArrow('createdAt')}></span>
                        </th>
                        <th onClick={() => props.onSort('dueDate')}>
                            Due date
                            <span className={props.setArrow('dueDate')}></span>
                        </th>
                        <th >
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(props.tasksList).map((item, index) => {
                            return props.tasksList[item].map((innerItem, innerIndex) => {
                                return (
                                    <>
                                        {(item !== "undefined" && innerIndex === 0) && (
                                            <tr>
                                                <td>{(props.groupBy === "createdAt" || props.groupBy === "dueDate") ? new Date(item).toLocaleDateString() : item}</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        )}

                                        <tr>
                                            <td>{innerItem.taskSummary}</td>
                                            <td>{innerItem.priority}</td>
                                            <td>{new Date(innerItem.createdAt).toLocaleDateString()}</td>
                                            <td>{new Date(innerItem.dueDate).toLocaleDateString()}</td>
                                            <td>{
                                                innerItem.state === enumState.Open ? (
                                                    <>
                                                        <Button size="sm" variant="secondary">Edit</Button>{' '}
                                                        <Button size="sm" variant="danger">Delete</Button>{' '}
                                                        <Button size="sm" variant="primary">Done</Button>
                                                    </>
                                                ) : (
                                                        <Button size="sm" variant="primary">Re open</Button>
                                                    )
                                            }</td>
                                        </tr>
                                    </>
                                )
                            })


                        })
                    }
                </tbody>
            </table>
        </>
    );
};

const mapDispatchToProps = {
    ...taskActions
};

const mapStateToProps = state => ({
    tasksList: state.tasks.tasksList
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);