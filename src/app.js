
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, NavLink, useHistory } from 'react-router-dom'
import ConversionHistory from './ConversionHistory.js'
import Converter from './Converter.js'
import './app.css'
import CONFIG from '../config/config.js'

const fetchCurrencies = () => {
    return new Promise(resolve => {
        fetch(CONFIG["currenciesApi"])
            .then(response => response.json())
            .then(data => resolve(data))
    })
}

const fetchExchangeRate = (currFrom, currTo) => {
    return new Promise(resolve => {
        fetch(CONFIG["converterApi"] + `&q=${currFrom}_${currTo}`)
            .then(response => response.json())
            .then(data => resolve(data[`${currFrom}_${currTo}`]))
    })
}

const App = () => {
    return (
        < React.StrictMode >
            <BrowserRouter>
                <RouterHeader />
                <RouterBody />
            </BrowserRouter>
        </React.StrictMode >)
}
const RouterHeader = () => {
    return (
        <div className="routerHeader">
            <nav>
                <ul>
                    <li>
                        <NavLink exact  to="/">Converter</NavLink>
                    </li>
                    <li>
                        <NavLink exact  to="/history">Conversion history</NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

const RouterBody = () => {
    const [currencies, setCurrencies] = useState(null)
    const [conversionHistory, setConversionHistory] = useState([])
    const routerHistory = useHistory()
    useEffect(() => {
        fetchCurrencies().then((data) => {
            setCurrencies({ ...data.results })
            console.log(currencies)
        })
    }, [])
    const onConverterSubmit = (data) => {
        if (data) {
            const newConversionHistory = [...conversionHistory]
            newConversionHistory.push(data)
            setConversionHistory(newConversionHistory)
            routerHistory.push("/history")
        }
    }
    return (
        <div className="routerBody">
            <div className="wrapper">
                <Switch>
                    <Route path="/history">
                        <ConversionHistory records={conversionHistory} />
                    </Route>
                    <Route path="/">
                        <Converter currencies={currencies} onSubmit={onConverterSubmit} />
                    </Route>
                </Switch>
            </div>
        </div>)
}

ReactDOM.render(
    <App></App>,
    document.getElementById('root')
)
