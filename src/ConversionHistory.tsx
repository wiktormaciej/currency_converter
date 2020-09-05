import React from 'react'
interface ConversionHistoryProps {
    records: ConversionRecord[],
    onClearHistory: Function
}
export interface ConversionRecord {
    value: number;
    currFrom: string;
    currTo: string;
    result: number;
    date: string;
    time: string;
    exchangeRate: number;
}


const ConversionHistory = (props: ConversionHistoryProps): JSX.Element => {
    const renderHistoryRecords = (records: ConversionRecord[]) => {
        if (!records || records.length == 0) {
            return (
                <tr className="emptyRow">
                    <td colSpan={6}>No records to display.</td>
                </tr>)
        }
        return ([...records].reverse().map((record: ConversionRecord) => {
            const { value, currFrom, currTo, result, date, time } = record
            return (
                <tr className="historyRecord">
                    <td>{value.toFixed(2)}</td>
                    <td>{currFrom}</td>
                    <td>{currTo}</td>
                    <td>{result.toFixed(2)}</td>
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