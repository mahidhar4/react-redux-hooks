import React from 'react';
import './Home.scss';
import TaskList from '../TaskList/TaskList';
import AddTask from '../Tasks/AddTask';

const Home = () => {

    return (
        <>
            <TaskList />
            <AddTask />
        </>
    );
};

export default Home;