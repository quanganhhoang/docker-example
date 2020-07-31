import React from "react";
// import Plot from "react-plotly.js";
import Plotly from "plotly.js-basic-dist";

import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

function ResultChart(props) {
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
  );
}

export default ResultChart;
