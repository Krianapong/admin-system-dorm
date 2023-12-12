import React from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./single.css";

const Single = (props) => {
  return (
    React.createElement("div", { className: "single" },
      React.createElement("div", { className: "view" },
        React.createElement("div", { className: "info" },
          React.createElement("div", { className: "topInfo" },
            props.img && React.createElement("img", { src: props.img, alt: "" }),
            React.createElement("h1", null, props.title),
            React.createElement("button", null, "Update")
          ),
          React.createElement("div", { className: "details" },
            Object.entries(props.info).map((item) =>
              React.createElement("div", { className: "item", key: item[0] },
                React.createElement("span", { className: "itemTitle" }, item[0]),
                React.createElement("span", { className: "itemValue" }, item[1])
              )
            )
          )
        ),
        React.createElement("hr", null),
        props.chart && React.createElement("div", { className: "chart" },
          React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
            React.createElement(LineChart, {
              width: 500,
              height: 300,
              data: props.chart.data,
              margin: {
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }
            },
              React.createElement(XAxis, { dataKey: "name" }),
              React.createElement(YAxis, null),
              React.createElement(Tooltip, null),
              React.createElement(Legend, null),
              props.chart.dataKeys.map((dataKey) =>
                React.createElement(Line, {
                  type: "monotone",
                  dataKey: dataKey.name,
                  stroke: dataKey.color,
                  key: dataKey.name
                })
              )
            )
          )
        )
      ),
      React.createElement("div", { className: "activities" },
        React.createElement("h2", null, "Latest Activities"),
        props.activities && React.createElement("ul", null,
          props.activities.map((activity) =>
            React.createElement("li", { key: activity.text },
              React.createElement("div", null,
                React.createElement("p", null, activity.text),
                React.createElement("time", null, activity.time)
              )
            )
          )
        )
      )
    )
  );
};

export default Single;
