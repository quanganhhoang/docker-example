import React from 'react'
import { Table } from 'reactstrap'

function ResultTable(props) {
    const result = props.data;
    let tableRows = [];
    let i = 1;
    
    for (const [key, value] of Object.entries(result)) {
        tableRows.push(
            <tr key={i}>
                <th scope="row">{i++}</th>
                <th>{key}</th>
                <th>{value}</th>
            </tr>
        )
    }

    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tweet</th>
                        <th>Classification Result</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </Table>
        </div>
    )
}

export default ResultTable
