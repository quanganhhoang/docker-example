import React, { useState } from "react";
// import Plot from "react-plotly.js";
import Plotly from "plotly.js-basic-dist";
import { Button } from 'reactstrap';

import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

function ResultChart(props) {
    const [toggle, setToggle] = useState(false);

    const toggleChart = (e) => {
        e.preventDefault();
        setToggle(!toggle);
    }

    const result = props.data;
    let numOffensive = 0;
    let numNonOffensive = 0;

    for (const [key, value] of Object.entries(result)) {
        if (value === "Not offensive speech") {
            numNonOffensive += 1;
        } else {
            numOffensive += 1;
        }
    }

    return (
        <div className="pie-chart">
            <Button
                outline
                color="primary"
                className="toggle-btn"
                onClick={e => toggleChart(e)}
            >
                Show result chart
            </Button>
            <div>
                { toggle ? 
                (
                
                    <Plot
                        data={[
                            {
                                values: [numNonOffensive, numOffensive],
                                labels: ["Not offensive speech", "Offensive speech"],
                                type: "pie",
                            },
                        ]}
                        layout={{ width: 500, height: 500}}
                    />
                ) : ''
                }
            </div>
        </div>
    );
}

export default ResultChart;
