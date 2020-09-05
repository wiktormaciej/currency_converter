import React from 'react'
import { Form, Field } from 'react-final-form'

interface ConverterProps {
    currencies: Currency[],
    onSubmit: Function
}
export interface ConverterFormData {
    value: number,
    currFrom: string,
    currTo: string,
}
export interface Currency {
    id: string;
    fullName: string;
}

const Converter = (props: ConverterProps): JSX.Element => {
    const { currencies, onSubmit } = props

    const handleSubmit = (formData: ConverterFormData) => {
        onSubmit(formData)
    }

    const renderCurrencyOptions = (options: Currency[]) => {
        return (
            <React.Fragment>
                {options.map((option) => {
                    return (<option value={option.id} title={option.fullName}>{option.id}</option>)
                })}
            </React.Fragment>
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