import React from 'react'
import { ConversionRecord } from './types'
interface ConversionHistoryProps {
    records: ConversionRecord[],
    onClearHistory: Function
}

const ConversionHistory = (props: ConversionHistoryProps) => {
    const renderHistoryRecords = (records: ConversionRecord[]) => {
        if (!records || records.length == 0) {
            return (
                <tr className="emptyRow">
                    <td colSpan={6}>No records to display.</td>
                </tr>)
        }
        return (records.map((record: ConversionRecord) => {
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
    //Render history table
    const renderHistory = (): JSX.Element => {
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
    //Render clear button
    const renderClearButton = () => {
        const { onClearHistory } = props
        return <button onClick={() => { onClearHistory() }}>Clear history</button>
    }

    //Main return
    return (
        <div className="conversionHistory" >
            {renderHistory()}
            {renderClearButton()}
        </div>)
}
export default ConversionHistory