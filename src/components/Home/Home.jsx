import React from 'react';
import './Home.scss';
import TaskList from '../Tasks/TaskList';
import AddTask from '../Tasks/AddTask';

const Home = () => {

    return (
        <>
            <AddTask />
            <TaskList />
        </>
    );
};

export default Home;