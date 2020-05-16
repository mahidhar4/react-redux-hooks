import React, { useState } from 'react';
import './Task.scss';
import ModalPopup from '../Modal/ModalPopup';
import Task from './Task';
import PlusICon from '../Icon/PlusIcon';
import { EntryWindowMode } from '../../utils/constants';

const AddTask = () => {

    const [showAdd, setShowAdd] = useState(false);

    return (
        <>
            <div className="add-task">
                <PlusICon width="42px" fill="#32BEA6" onClick={() => setShowAdd(true)} />
            </div>
            <ModalPopup showModal={showAdd} onClose={() => setShowAdd(false)}>
                <Task mode={EntryWindowMode.Add} onClose={setShowAdd} />
            </ModalPopup>
        </>
    );
};

export default AddTask;