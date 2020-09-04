
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, NavLink, useHistory } from 'react-router-dom'
import ConversionHistory from './ConversionHistory'
import Converter from './Converter'
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
            })
    })
}

const fetchExchangeRate = (currFrom: string, currTo: string) => {
    return new Promise(resolve => {
        fetch(CONFIG["converterApi"] + `?base=${currFrom}&symbols=${currTo}`)
            .then(response => response.json())
            .then(data => resolve(data.rates[currTo]))
    }).catch((e) => {
        throw new Error('External server is down, try again later.')
    })
}
// const fetchExchangeRate = (currFrom: string, currTo: string) => {
//     return new Promise(resolve => {
//         fetch(CONFIG["converterApi"] + `&q=${currFrom}_${currTo}`)
//             .then(response => response.json())
//             .then(data => resolve(data[`${currFrom}_${currTo}`]))
//     }).catch((e) => {
//         throw new Error('External server is down, try again later.')
//     })
// }


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
    const routerHistory = useHistory()
    useEffect(() => {
        //Load conversion history from  local storage
        localStorage.conversionHistory && setConversionHistory(JSON.parse(localStorage.conversionHistory))
        //Fetch currencies
        fetchCurrencies().then((data: Currency[]) => {
            setCurrencies([...data])
        })
    }, [])
    useEffect(() => {
        localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory))
    }, [conversionHistory])

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
