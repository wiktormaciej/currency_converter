import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Field } from 'react-final-form'
import CONFIG from '../config/config.js'


const Converter = (props) => {
    const { currencies, onSubmit } = props

    const handleSubmit = (formData) => {
        fetchExchangeRate(formData.currFrom, formData.currTo).then((exchangeRate) => { handleStateUpdate(formData, exchangeRate) })
    }
    const handleStateUpdate = (formData, exchangeRate) => {
        let newResult = {
            ...formData,
            exchangeRate,
            result: (formData.value * exchangeRate).toFixed(3)
        }
        onSubmit(newResult)
        routerHistory.push("/history")
    }
    const fetchExchangeRate = (currFrom, currTo) => {
        return new Promise(resolve => {
            fetch(CONFIG["converterApi"] + `&q=${currFrom}_${currTo}`)
                .then(response => response.json())
                .then(data => resolve(data[`${currFrom}_${currTo}`]))
        })
    }
    const renderCurrencyOptions = (options) => {
        return (
            <React.Fragment>
                {Object.keys(options).sort(((a, b) => { return a.localeCompare(b) })).map((key) => {
                    return (<option value={options[key].id}>{options[key].id}</option>)
                })}
            </React.Fragment>
        )
    }

    if (!currencies) {
        return (<div className="spinner-border"></div>)
    }
    return (
        <div className="converter">
            <Form onSubmit={handleSubmit}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Field className="field" name="value" component="input" placeholder={"Value (i.e. 0.00)"} />
                        <Field className="field" name="currFrom" component="select" initialValue="PLN" >
                            {renderCurrencyOptions(currencies)}
                        </Field>
                        <Field className="field" name="currTo" component="select" initialValue="EUR" >
                            {renderCurrencyOptions(currencies)}
                        </Field>

                        <button type="submit">{">"}</button>
                    </form>
                )}
            </Form>
        </div>)
}
export default Converter