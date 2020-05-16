import React, { useState, useReducer } from 'react';
import Form from 'react-bootstrap/Form'
import { EntryWindowMode, enumPriority, hasValue, createUUID, enumState } from '../../utils/constants';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './Task.scss';
import { actions as taskActions } from '../../reducers/actions/tasks';
import { connect } from "react-redux";

const initialState = {
    "taskId": "",
    "taskSummary": "",
    "taskDescription": "",
    "priority": enumPriority.None,
    "dueDate": "",
    "createdAt": "",
    "state": ""
};

function reducer(state, action) {
    if (hasValue(action.type)) {
        return { ...state, [action.type]: action.payload };
    }
    else {
        throw new Error();
    }

};

const Task = (props) => {

    const [validated, setValidated] = useState(false);

    const [state, dispatch] = useReducer(reducer, props.taskItem ?? initialState);


    const handleSubmit = (event) => {

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
            return;
        }

        setValidated(true);
        event.preventDefault();

        if (!window.confirm("Are you sure, Please confirm to save data!")) return;

        if (props.mode === EntryWindowMode.Add) {
            props.saveTask({
                ...state,
                taskId: createUUID(),
                createdAt: new Date().toISOString(),
                state: enumState.Open
            });
        }
        else {
            props.updateTask({ ...state });
        }
        props.onClose(false);
    };

    const handleChange = (event) => {
        dispatch({ type: event.target.name, payload: event.target.value });
    };

    const fieldSetProps = {

    };

    if (props.mode === EntryWindowMode.View) {
        fieldSetProps.disabled = "disabled";
    }

    return (
        <>
            <div className="form-header">
                {
                    props.mode === EntryWindowMode.Add ? "Add Task" :
                        (props.mode === EntryWindowMode.Edit ? "Edit Task" : "View Task Details")
                }
            </div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <fieldset {...fieldSetProps}>
                    <Form.Group controlId="Task.Summary">
                        <Form.Label>Summary</Form.Label>
                        <Form.Control name="taskSummary" value={state.taskSummary} type="text" placeholder="Summary" onChange={handleChange} required maxLength="140" minLength="10" />
                        <Form.Control.Feedback type="invalid">
                            Please enter atleast 10 characters.
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="Task.Description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" placeholder="Description" name="taskDescription" value={state.taskDescription} onChange={handleChange} required rows="2" maxLength="500" minLength="10" />
                        <Form.Control.Feedback type="invalid">
                            Please enter atleast 10 characters.
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Row>
                        <Form.Group as={Col} md="3" controlId="Task.Priority">
                            <Form.Label>Priority</Form.Label>
                            <Form.Control as="select" onChange={handleChange} name="priority" value={state.priority}>
                                <option>{enumPriority.None}</option>
                                <option>{enumPriority.Low}</option>
                                <option>{enumPriority.Medium}</option>
                                <option>{enumPriority.High}</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} md="3" controlId="Task.DueDate">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control type="date" placeholder="Due Date" required onChange={handleChange} name="dueDate" value={state.dueDate} />
                            <Form.Control.Feedback type="invalid">
                                Please select due date.
                        </Form.Control.Feedback>
                        </Form.Group>
                        {
                            (props.mode === EntryWindowMode.View) && (
                                <>
                                    <Form.Group as={Col} md="3" controlId="Task.CreatedAt">
                                        <Form.Label>Created On</Form.Label>
                                        <Form.Control type="text" value={state.createdAt} />
                                    </Form.Group>
                                    <Form.Group as={Col} md="3" controlId="Task.State">
                                        <Form.Label>Current State</Form.Label>
                                        <Form.Control type="text" value={state.state} />
                                    </Form.Group>
                                </>
                            )
                        }

                    </Form.Row>
                </fieldset>
                {
                    (props.mode !== EntryWindowMode.View) && (
                        <Button variant="primary" type="submit" className="btn-save">
                            {props.mode === EntryWindowMode.Add ? "Save" : "Update"}
                        </Button>
                    )
                }
                <Button variant="secondary" onClick={() => props.onClose(false)}>
                    {props.mode === EntryWindowMode.View ? "Close" : "Cancel"}
                </Button>
            </Form>
        </>
    );
};


const mapDispatchToProps = {
    ...taskActions,
};

export default connect(null, mapDispatchToProps)(Task);