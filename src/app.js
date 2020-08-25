
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import ConversionHistory from './ConversionHistory.js'
import Converter from './Converter.js'


const App = () => (

    <React.StrictMode>
        <BrowserRouter>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/history">About</Link>
                        </li>
                    </ul>
                </nav>

                <Switch>
                    <Route path="/history">
                        <ConversionHistory />
                    </Route>
                    <Route path="/">
                        <Converter />
                    </Route>
                </Switch>
            </div>
        </BrowserRouter>
    </React.StrictMode>

)
ReactDOM.render(
    <App></App>,
    document.getElementById('root')
)