
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, NavLink, useHistory } from 'react-router-dom'
import ConversionHistory from './ConversionHistory'
import Converter, { ConverterFormData } from './Converter'
import { Currency, ConversionRecord } from './types'
import './app.css'
import CONFIG from '../config/config'
const { EXCHANGE_RATE_API, CURRENCIES_API, MAX_HISTORY_LENGHT } = CONFIG

//Fetch functions
const fetchCurrencies = (): Promise<Currency[] | never> => {
    return new Promise((resolve, reject) => {
        fetch(CURRENCIES_API)
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
            })
            .catch((e) => {
                reject(new Error('External server is down, try again later.'))
            })
    })
}
const fetchExchangeRate = (from: string, to: string): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
        fetch(EXCHANGE_RATE_API + `&symbols=${from},${to}`)
            .then(response => response.json())
            .then(data => resolve((data.rates[to] / data.rates[from]))) //calculate rate from two rates based on USD - it may be not as precise as it should be
            .catch((e) => {
                reject(new Error('External server is down, try again later.'))
            })
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

    const onConverterSubmit = (formData: ConversionRecord) => {
        //Get exchange rate
        fetchExchangeRate(formData.currFrom, formData.currTo).then((exchangeRate: number) => {
            //Parse current date and time to string
            const date = new Date()
            const prependZero = (number: number) => {
                return String(number).padStart(2, '0');
            }
            const composedDate = prependZero(date.getDate()) + "-" + prependZero(date.getMonth()) + "-" + prependZero(date.getFullYear())
            const composedTime = prependZero(date.getHours()) + ":" + prependZero(date.getMinutes())
            //Create new record
            const newHistoryRecord: ConversionRecord = {
                ...formData,
                exchangeRate,
                result: (Math.round(formData.value * exchangeRate * 1000) / 1000),
                date: composedDate,
                time: composedTime,
                value: (Math.round(formData.value * 100) / 100)
            }
            //Update state and redirect to history
            const newConversionHistory: ConversionRecord[] = [...conversionHistory]
            newConversionHistory.push(newHistoryRecord)
            //Trim an array if needed
            if (newConversionHistory.length > MAX_HISTORY_LENGHT) {
                newConversionHistory.shift()
            }
            setConversionHistory(newConversionHistory)
            routerHistory.push("/history")
        }).catch((error: Error) => {
            setError(error)
        })
    }
    const onClearHistory = () => {
        setConversionHistory([])
    }

    //Returns
    if (error) {
        return (
            <div className="routerBody">
                <span className="error">
                    {error.message}
                </span>
            </div>)
    }
    return (
        <div className="routerBody">
            <Switch>
                <Route path="/history">
                    <ConversionHistory records={conversionHistory} onClearHistory={onClearHistory} />
                </Route>
                <Route path="/">
                    <Converter currencies={currencies} onSubmit={onConverterSubmit} />
                </Route>
            </Switch>
        </div>)
}

ReactDOM.render(
    <App></App>,
    document.getElementById('root')
)
