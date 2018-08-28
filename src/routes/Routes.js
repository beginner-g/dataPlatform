import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Login from 'components/Login/Login'
import Layouts from 'components/Layouts/Layouts'
import '../styles/styles.less'
class Routes extends Component {
  render() {
    return (
      <Router>
        <div style={{height: '100%'}}>
          <Route exact path="/" component={Login}/>
          <Route path="/home" render={() => {
            if (!JSON.parse(localStorage.getItem('user'))) {
              return <Redirect to='/' />
            } else {
              return <Layouts/>
            }
          }}/>
        </div>
      </Router>
    );
  }
}

export default Routes
