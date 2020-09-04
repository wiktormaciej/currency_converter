
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, NavLink, useHistory } from 'react-router-dom'
import ConversionHistory from './ConversionHistory'
import Converter, { ConverterFormData } from './Converter'
import { Currency, ConversionRecord } from './types'
import './app.css'
import CONFIG from '../config/config'


//Fetch functions
const fetchCurrencies = (): Promise<Currency[] | never> => {
    return new Promise(resolve => {
        fetch(CONFIG["currenciesApi"])
            .then(response => response.json())
            .then(data => {
                //Parse currencies response
                const newCurrencies: Currency[] = []
                const sortedIDs = Object.keys(data).sort(((a, b) => { return a.localeCompare(b) }))
                for (const id of sortedIDs) {
                    newCurrencies.push({
                        id: id,
                        fullName: data[id]
                    })
                }
                resolve(newCurrencies)
            }).catch((e) => {
                throw new Error('External server is down, try again later.')
            })
    })
}
const fetchExchangeRate = (from: string, to: string): Promise<number> => {
    return new Promise<number>(resolve => {
        fetch(CONFIG["converterApi"] + `&symbols=${from},${to}`)
            .then(response => response.json())
            .then(data => resolve((data.rates[to] / data.rates[from]))) //calculate rate from two rates based on USD - it may be not as precise as it should be
    }).catch((e) => {
        throw new Error('External server is down, try again later.')
    })
}

//Main app function
const App = () => {
    return (
        < React.StrictMode >
            <BrowserRouter>
                <RouterHeader />
                <RouterBody />
            </BrowserRouter>
        </React.StrictMode >)
}


//Header component
const RouterHeader = (): JSX.Element => {
    return (
        <div className="routerHeader">
            <nav>
                <ul>
                    <li>
                        <NavLink exact to="/">Converter</NavLink>
                    </li>
                    <li>
                        <NavLink exact to="/history">Conversion history</NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

//Body component
const RouterBody = (): JSX.Element => {
    const [currencies, setCurrencies] = useState<Currency[]>(null)
    const [conversionHistory, setConversionHistory] = useState<ConversionRecord[]>([])
    const [error, setError] = useState<Error>(null)
    const routerHistory = useHistory()

    useEffect(() => {
        //Load currencies and conversion history from  local storage
        localStorage.conversionHistory && setConversionHistory(JSON.parse(localStorage.conversionHistory))
        localStorage.currencies && setCurrencies(JSON.parse(localStorage.currencies))
        //Fetch currencies
        fetchCurrencies().then((data: Currency[]) => {
            setCurrencies([...data])
        }).catch((error: Error) => {
            setError(error)
        })
    }, [])

    //Set localStorage data whenever state values change
    useEffect(() => {
        localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory))
    }, [conversionHistory])
    useEffect(() => {
        localStorage.setItem('currencies', JSON.stringify(currencies))
    }, [currencies])

    const onConverterSubmit = (data: ConversionRecord) => {
        if (data) {
            const newConversionHistory: ConversionRecord[] = [...conversionHistory]
            newConversionHistory.push(data)
            setConversionHistory(newConversionHistory)
            routerHistory.push("/history")
        }
    }
    const onClearHistory = () => {
        setConversionHistory([])
    }
    if (error) {
        return (<div>
            {error.message}
        </div>)
    }
    return (
        <div className="routerBody">
            <div className="wrapper">
                <Switch>
                    <Route path="/history">
                        <ConversionHistory records={conversionHistory} onClearHistory={onClearHistory} />
                    </Route>
                    <Route path="/">
                        <Converter currencies={currencies} onSubmit={onConverterSubmit} getExchangeRate={fetchExchangeRate} />
                    </Route>
                </Switch>
            </div>
        </div>)
}

ReactDOM.render(
    <App></App>,
    document.getElementById('root')
)
