import React, { useState, useEffect } from "react";
import { enumState, applySearchSortGroupOnData, EntryWindowMode, sortData } from "../../utils/constants";
import "./TaskList.scss";
import { connect } from "react-redux";
import { actions as taskActions } from "../../reducers/actions/tasks";
import { Button } from "react-bootstrap";
import ModalPopup from '../Modal/ModalPopup';
import Task from '../Tasks/Task';
import Form from 'react-bootstrap/Form'

const enumClick = {
  Edit: "Edit",
  Delete: "Delete",
  Done: "Done",
  ReOpen: "ReOpen",
  View: "View"
};

const TaskList = (props) => {


  const [groupBy, setGroupBy] = useState("");
  const [data, setData] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [status, setStatus] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [sort, setSort] = useState({
    column: null,
    direction: "desc",
  });

  useEffect(() => {
    props.getListOfTasks();
  }, []);

  useEffect(() => {
    setData(applySearchSortGroupOnData(props.tasksList, searchVal, props.configData.AllowGlobalSearchProps, groupBy, sort, status));
  }, [props.tasksList]);


  const onSort = (column) => {

    if (props.configData.AllowSortProps.indexOf(column) <= -1) return;

    let sortDetails = {
      column,
      direction: sort.column
        ? sort.direction === "asc"
          ? "desc"
          : "asc"
        : "desc"
    }
    setSort(sortDetails);
    setData(applySearchSortGroupOnData(props.tasksList, searchVal, props.configData.AllowGlobalSearchProps, groupBy, sortDetails, status));
  };

  const setArrow = (column) => {

    if (props.configData.AllowSortProps.indexOf(column) <= -1) return;

    let className = "sort-direction";

    if (sort.column === column) {
      className += sort.direction === "asc" ? " asc" : " desc";
    }

    return className;
  };

  const onGroupSelect = (event) => {
    setGroupBy(event.target.value);
    setData(applySearchSortGroupOnData(props.tasksList, searchVal, props.configData.AllowGlobalSearchProps, event.target.value, sort, status));
  };

  const handleClick = (event, item, clickType) => {
    event.persist();
    event.stopPropagation();
    switch (clickType) {
      case enumClick.Edit:
        setShowEdit(true);
        setSelectedItem(item);
        break;
      case enumClick.View:
        setShowView(true);
        setSelectedItem(item);
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
    setSearchVal(event.target.value);
    setData(applySearchSortGroupOnData(props.tasksList, event.target.value, props.configData.AllowGlobalSearchProps, groupBy, sort, status));
  };

  const onSetStatusChange = (selectedStatus) => {
    setStatus(selectedStatus);
    setData(applySearchSortGroupOnData(props.tasksList, searchVal, props.configData.AllowGlobalSearchProps, groupBy, sort, selectedStatus));
  };

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
              props.configData.AllowGroupByProps.map(groupProp => (
                <option value={groupProp}>{groupProp}</option>
              ))
            }
          </Form.Control>
        </Form.Group>
      </div>

      <div className="tabs">
        <Button variant={status === "" ? "primary" : "light"} onClick={() => onSetStatusChange("")}>All</Button>{' '}
        <Button variant={status === enumState.Open ? "primary" : "light"} onClick={() => onSetStatusChange(enumState.Open)}>Pending</Button>{' '}
        <Button variant={status === enumState.Done ? "primary" : "light"} onClick={() => onSetStatusChange(enumState.Done)}>Completed</Button>
      </div>

      <div className="content-box">
        <ListGrid
          tasksList={data}
          onSort={onSort}
          setArrow={setArrow}
          groupBy={groupBy}
          handleClick={handleClick}
        />
      </div>
      <ModalPopup showModal={showEdit} onClose={() => setShowEdit(false)}>
        <Task mode={EntryWindowMode.Edit} taskItem={selectedItem} onClose={setShowEdit} />
      </ModalPopup>
      <ModalPopup showModal={showView} onClose={() => setShowView(false)}>
        <Task mode={EntryWindowMode.View} taskItem={selectedItem} onClose={setShowView} />
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
