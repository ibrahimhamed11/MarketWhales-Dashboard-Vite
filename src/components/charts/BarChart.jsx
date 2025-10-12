import React, { Component } from "react";
import Chart from "react-apexcharts";

class ColumnChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  componentDidMount() {
    this.setState({
      chartData: this.props.chartData,
      chartOptions: {
        ...this.props.chartOptions,
        chart: {
          ...this.props.chartOptions.chart,
          toolbar: {
            show: false, // Hides the chart toolbar for a cleaner look
          },
          background: 'transparent', // Transparent background for better visuals
        },
        plotOptions: {
          bar: {
            borderRadius: 10, // Smooth rounded edges
            horizontal: false,
            dataLabels: {
              position: "top", // Show data labels at the top of the bars
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => {
            return val;
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#304758"], // Style data labels with a darker color for contrast
          },
        },
        xaxis: {
          categories: this.props.chartOptions.xaxis.categories,
          position: "bottom",
          axisBorder: {
            show: true,
            color: "#78909C",
          },
          axisTicks: {
            show: true,
            color: "#78909C",
          },
          labels: {
            style: {
              colors: "#546E7A", // Custom x-axis label color
              fontSize: "14px", // Font size for the x-axis labels
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#546E7A", // Custom y-axis label color
              fontSize: "14px", // Font size for the y-axis labels
            },
          },
        },
        fill: {
          colors: ['#1E90FF'], // New modern color for bars (use a gradient for a better effect)
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'horizontal',
            shadeIntensity: 0.25,
            gradientToColors: ['#00C9FF'], // Gradient transition color
            inverseColors: true,
            opacityFrom: 0.9,
            opacityTo: 0.9,
            stops: [0, 100],
          },
        },
        tooltip: {
          theme: 'dark', // Dark theme for tooltips for better visibility
          marker: {
            show: true,
          },
          x: {
            show: true,
          },
        },
        grid: {
          borderColor: "#E0E0E0", // Subtle grid lines for better visuals
        },
      },
    });
  }

  render() {
    return (
      <div style={{ padding: "20px", backgroundColor: "#f4f6f9", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", color: "#1E90FF", marginBottom: "10px" }}>User Registration Growth</h2>
        <Chart
          options={this.state.chartOptions}
          series={this.state.chartData}
          type="bar"
          width="100%"
          height="400px" 
        />
      </div>
    );
  }
}

export default ColumnChart;
