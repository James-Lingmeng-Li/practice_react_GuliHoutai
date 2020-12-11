/* 
    应用的根组件(一个react项目至少有一个根组件，一般叫App.js(x))
*/
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

import Login from './pages/login/login';
import Admin from './pages/admin/admin';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/login' component={Login}></Route>
                    <Route path='/' component={Admin}></Route>
                    <Redirect to='/login' />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default App;