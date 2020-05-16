import React from "react";
import Home from "./components/Home/Home";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/">
            <div class="header">
              <a href="/" class="logo">
                <h3>To Do</h3>
              </a>
            </div>
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
