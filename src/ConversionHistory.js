import React from 'react'
const ConversionHistory = (props) => {
    const renderHistoryRecords = (records) => {
        if (!records || records.length == 0) {
            return (
                <tr className="emptyRow">
                    <td colSpan={6}>No records to display.</td>
                </tr>)
        }
        return (records.map((record) => {
            const { value, currFrom, currTo, result, date, time } = record
            return (
                <tr>
                    <td>{value}</td>
                    <td>{currFrom}</td>
                    <td>{currTo}</td>
                    <td>{result}</td>
                    <td>{date}</td>
                    <td>{time}</td>
                </tr>)
        }))
    }

    const renderHistory = () => {
        const { records } = props
        return (
            <table>
                <thead>
                    <tr>

                        <th className="firstCol">Value</th>
                        <th>From</th>
                        <th>To</th>
                        <th >Result</th>
                        <th >Date</th>
                        <th className="lastCol">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {renderHistoryRecords(records)}
                </tbody>
            </table>
        )

    }
    const renderClearButton = () => {
        const { clearHistory } = props
        return <button onClick={clearHistory}>Clear history</button>

    }
    return (<div className="conversionHistory" >
        {renderHistory()}
        {renderClearButton()}
    </div>)
}
export default ConversionHistory