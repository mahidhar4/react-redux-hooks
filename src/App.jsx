import React, { useState, useEffect } from 'react';
import Home from './components/Home/Home';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { connect } from "react-redux";
import Spinner from 'react-bootstrap/Spinner'

function App(props) {

  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    setShowSpinner(props.isFetching);
  }, [props.isFetching]);

  return (
    <Router>
      <div>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        {
          showSpinner && (
            <div className='custom-modal-overlay'>
              <Spinner animation="grow" variant="primary" />
            </div>
          )
        }
      </div>
    </Router>
  );
};


const mapStateToProps = (state) => ({
  isFetching: state.shared.isFetching
});

export default connect(mapStateToProps, null)(App);
