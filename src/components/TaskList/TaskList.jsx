import React, { useEffect, useReducer } from "react";
import { enumState, applySearchSortGroupOnData, EntryWindowMode, hasValue } from "../../utils/constants";
import "./TaskList.scss";
import { connect } from "react-redux";
import { actions as taskActions } from "../../reducers/actions/tasks";
import { Button } from "react-bootstrap";
import ModalPopup from '../Modal/ModalPopup';
import Task from '../Tasks/Task';
import Form from 'react-bootstrap/Form'
import { GridList } from "../Grid/Grid"

const enumClick = {
  Edit: "Edit",
  Delete: "Delete",
  Done: "Done",
  ReOpen: "ReOpen",
  View: "View"
};

function reducer(state, action) {
  if (hasValue(action.type)) {
    return { ...state, [action.type]: action.payload };
  }
  else {
    throw new Error();
  }
};

const initialState = {
  selectedGroupBy: "",
  selectedStatus: "",
  selectedSort: {
    column: null,
    direction: "desc",
  },
  searchVal: "",
  data: {},
  showEdit: false,
  showView: false,
  selectedItem: null
};

const TaskList = ({ getListOfTasks, ...props }) => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const viewEditTask = (val) => {
    dispatch({ type: 'showEdit', payload: val });
  };

  const viewTaskDetails = (val) => {
    dispatch({ type: 'showView', payload: val });
  };

  useEffect(() => {
    getListOfTasks();
  }, [getListOfTasks]);

  useEffect(() => {
    dispatch({ type: 'data', payload: applySearchSortGroupOnData(props.tasksList, state.searchVal, getSearchPropsInGrid(), state.selectedGroupBy, state.selectedSort, state.selectedStatus) });
  }, [props.tasksList]);


  const onSort = (column) => {

    if (props.configData.GridColumns.filter(item => item.field === column && item.sortable).length === 0) return;

    let sortDetails = {
      column,
      direction: state.selectedSort.column
        ? state.selectedSort.direction === "asc"
          ? "desc"
          : "asc"
        : "desc"
    }

    dispatch({ type: 'selectedSort', payload: sortDetails });
    dispatch({ type: 'data', payload: applySearchSortGroupOnData(props.tasksList, state.searchVal, getSearchPropsInGrid(), state.selectedGroupBy, sortDetails, state.selectedStatus) });
  };

  const setArrow = (column) => {

    if (props.configData.GridColumns.filter(item => item.field === column && item.sortable).length === 0) return;

    let className = "sort-direction";

    if (state.selectedSort.column === column) {
      className += state.selectedSort.direction === "asc" ? " asc" : " desc";
    }

    return className;
  };

  const onGroupSelect = (event) => {
    dispatch({ type: 'selectedGroupBy', payload: event.target.value });
    dispatch({ type: 'data', payload: applySearchSortGroupOnData(props.tasksList, state.searchVal, getSearchPropsInGrid(), event.target.value, state.selectedSort, state.selectedStatus) });
  };

  const handleClick = (event, item, clickType) => {
    event.persist();
    event.stopPropagation();
    switch (clickType) {
      case enumClick.Edit:
        viewEditTask(true);
        dispatch({ type: 'selectedItem', payload: item });
        break;
      case enumClick.View:
        viewTaskDetails(true);
        dispatch({ type: 'selectedItem', payload: item });
        break;
      case enumClick.Delete:
        props.deleteTask(item);
        break;
      case enumClick.Done:
        props.updateTask({
          ...item,
          state: enumState.Done
        });
        break;
      case enumClick.ReOpen:
        props.updateTask({
          ...item,
          state: enumState.Open
        });
        break;
      default:
        throw new Error();
    }
  };

  const onSearchChange = (event) => {
    dispatch({ type: 'searchVal', payload: event.target.value });
    dispatch({ type: 'data', payload: applySearchSortGroupOnData(props.tasksList, event.target.value, getSearchPropsInGrid(), state.selectedGroupBy, state.selectedSort, state.selectedStatus) });
  };

  const onSetStatusChange = (selectedStatus) => {
    dispatch({ type: 'selectedStatus', payload: selectedStatus });
    dispatch({ type: 'data', payload: applySearchSortGroupOnData(props.tasksList, state.searchVal, getSearchPropsInGrid(), state.selectedGroupBy, state.selectedSort, selectedStatus) });
  };

  const getSearchPropsInGrid = () => {
    return props.configData.GridColumns.map(item => item.filterable ? item.field : "");
  }

  return (
    <>
      <div className="global-fields">
        <Form.Group className="search-section" controlId="search">
          <Form.Label>Global Search</Form.Label>
          <Form.Control type="text" placeholder="Search" onChange={(e) => onSearchChange(e)} />
        </Form.Group>


        <Form.Group className="grouping-section" controlId="group-by">
          <Form.Label className="groupby-text">Group By</Form.Label>
          <Form.Control as="select" className="groupby-dropdown" onChange={(e) => onGroupSelect(e)}>
            <option value="">None</option>
            {
              props.configData.GridColumns.map((groupProp, index) => (
                groupProp.groupable ? <option value={groupProp.field} key={index}>{groupProp.title}</option> : <></>
              ))
            }
          </Form.Control>
        </Form.Group>
      </div>

      <div className="tabs">
        <Button variant={state.selectedStatus === "" ? "primary" : "light"} onClick={() => onSetStatusChange("")}>All</Button>{' '}
        <Button variant={state.selectedStatus === enumState.Open ? "primary" : "light"} onClick={() => onSetStatusChange(enumState.Open)}>Pending</Button>{' '}
        <Button variant={state.selectedStatus === enumState.Done ? "primary" : "light"} onClick={() => onSetStatusChange(enumState.Done)}>Completed</Button>
      </div>

      <div className="content-box">
        {/* <ListGrid
          tasksList={state.data}
          onSort={onSort}
          setArrow={setArrow}
          groupBy={state.selectedGroupBy}
          handleClick={handleClick}
        /> */}
        <GridList
          tasksList={state.data}
          gridColumns={props.configData.GridColumns}
          onSort={onSort}
          setArrow={setArrow}
          groupBy={state.selectedGroupBy}
          handleClick={handleClick} />
      </div>
      <ModalPopup showModal={state.showEdit} onClose={() => viewEditTask(false)}>
        <Task mode={EntryWindowMode.Edit} taskItem={state.selectedItem} onClose={viewEditTask} />
      </ModalPopup>
      <ModalPopup showModal={state.showView} onClose={() => viewTaskDetails(false)}>
        <Task mode={EntryWindowMode.View} taskItem={state.selectedItem} onClose={viewTaskDetails} />
      </ModalPopup>
    </>
  );
};

const ListGrid = (props) => {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th onClick={() => props.onSort("taskSummary")}>
              <span>Summary</span>
              <span className={props.setArrow("taskSummary")}></span>
            </th>
            <th onClick={() => props.onSort("priority")}>
              <span>Priority</span>
              <span className={props.setArrow("priority")}></span>
            </th>
            <th onClick={() => props.onSort("createdAt")}>
              <span>Created on</span>
              <span className={props.setArrow("createdAt")}></span>
            </th>
            <th onClick={() => props.onSort("dueDate")}>
              <span> Due date</span>
              <span className={props.setArrow("dueDate")}></span>
            </th>
            <th onClick={() => props.onSort("state")}>
              <span>Actions</span>
              <span className={props.setArrow("state")}></span>
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(props.tasksList).map((item, index) => {
            return props.tasksList[item].map((innerItem, innerIndex) => {
              return (
                <>
                  {item !== "undefined" && innerIndex === 0 && (
                    <tr className="grouping-headers">
                      <td>
                        {props.groupBy === "createdAt" ||
                          props.groupBy === "dueDate"
                          ? new Date(item).toLocaleDateString()
                          : item}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}

                  <tr className={innerItem.state === enumState.Done ? "strikeout" : ""} onClick={(event) => props.handleClick(event, innerItem, enumClick.View)}>
                    <td>{innerItem.taskSummary}</td>
                    <td>{innerItem.priority}</td>
                    <td>
                      {new Date(innerItem.createdAt).toLocaleDateString()}
                    </td>
                    <td>{new Date(innerItem.dueDate).toLocaleDateString()}</td>
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
                            Re open
                          </Button>
                        )}
                    </td>
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

const mapDispatchToProps = {
  ...taskActions,
};

const mapStateToProps = (state) => ({
  tasksList: state.tasks.tasksList,
  configData: state.config.configData
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
