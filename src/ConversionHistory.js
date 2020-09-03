import React from 'react'
const ConversionHistory = (props) => {
    const renderHistory = () => {
        const { records } = props
        return (
            <table>
                <thead>
                    <tr>
                        <th>Value</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Result</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record) => {
                        return (
                            <tr>
                                <td>{record.value}</td>
                                <td>{record.currFrom}</td>
                                <td>{record.currTo}</td>
                                <td>{record.result}</td>
                            </tr>)
                    })}
                </tbody>
            </table>
        )

    }
    const renderClearButton = () => {

    }
    return (<div className="conversionHistory" >
        {renderHistory()}
        {renderClearButton()}
    </div>)
}
export default ConversionHistory