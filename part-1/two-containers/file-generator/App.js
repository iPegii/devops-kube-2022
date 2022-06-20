import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Homepage from './src/components/Homepage';

const App = () => {
    return (
      <Router>
        <Route path="/" exact element={<Homepage/>} />
    </Router>
    );
  }

export default App;