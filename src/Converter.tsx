import React, { useState } from 'react'
import { Form, Field } from 'react-final-form'
import { ConversionRecord, Currency } from './types'

interface ConverterProps {
    currencies: Currency[],
    onSubmit: Function,
    getExchangeRate: Function
}
interface ConverterFormData {
    value: number,
    currFrom: string,
    currTo: string,
}

const Converter = (props: ConverterProps) => {
    const { currencies, onSubmit, getExchangeRate } = props

    const handleSubmit = (formData: ConverterFormData) => {
        //Get exchange rate and update state
        getExchangeRate(formData.currFrom, formData.currTo).then((exchangeRate: number) => {
            handleStateUpdate(formData, exchangeRate)

        })
    }
    const handleStateUpdate = (formData: ConverterFormData, exchangeRate: number) => {
        //Parse date and time to string
        const date = new Date()
        const prependZero = (number: number) => {
            return String(number).padStart(2, '0');
        }
        const composedDate = prependZero(date.getDate()) + "-" + prependZero(date.getMonth()) + "-" + prependZero(date.getFullYear())
        const composedTime = prependZero(date.getHours()) + ":" + prependZero(date.getMinutes())
        //Create new record
        let newRecord = {
            ...formData,
            exchangeRate,
            result: (formData.value * exchangeRate).toFixed(3),
            date: composedDate,
            time: composedTime
        }
        //Dispatch record
        onSubmit(newRecord)
    }

    const renderCurrencyOptions = (options: Currency[]) => {
        return (
            <React.Fragment>
                {options.map((key) => {
                    return (<option value={key.id} title={key.fullName}>{key.id}</option>)
                })}
            </React.Fragment>

            // <React.Fragment>
            //     {Object.keys(options).sort(((a, b) => { return a.localeCompare(b) })).map((key) => {
            //         return (<option value={options[key].id}>{options[key].id}</option>)
            //     })}
            // </React.Fragment>
        )
    }

    if (!currencies) {
        return (<div className="loader">Loading...</div>)
    }
    return (
        <div className="converter">
            <Form onSubmit={handleSubmit}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Field title="Value" pattern="^\d+(?:\.\d{1,2})?$" step="0.01" required max="1000000000" type="number" className="field" name="value" component="input" placeholder={"Value (i.e. 0.00)"} />
                        <Field className="field" name="currFrom" component="select" initialValue="PLN" >
                            {renderCurrencyOptions(currencies)}
                        </Field>
                        <Field className="field" name="currTo" component="select" initialValue="EUR" >
                            {renderCurrencyOptions(currencies)}
                        </Field>

                        <button className="submit" type="submit">{">"}</button>
                    </form>
                )}
            </Form>
        </div>)
}
export default Converter