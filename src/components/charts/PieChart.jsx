import React from "react";
import ReactApexChart from "react-apexcharts";
import { Box } from "@chakra-ui/react";

class PieChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  componentDidMount() {

    // Set state with the incoming props
    this.setState({
      chartData: this.props.chartData,
      chartOptions: this.props.chartOptions,
    }, () => {
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chartData !== this.props.chartData || prevProps.chartOptions !== this.props.chartOptions) {

      this.setState({
        chartData: this.props.chartData,
        chartOptions: this.props.chartOptions,
      }, () => {
      });
    }
  }

  render() {
    if (!this.state.chartData || this.state.chartData.length === 0) {
      return <div>No data to display</div>;
    }

    // Use the colors defined in the pie chart options
    const colors = this.state.chartOptions.colors || ["#FF4560", "#008FFB", "#00E396", "#775DD0", "#775DD0"]; // Default colors

    return (
        <ReactApexChart
          options={{
            ...this.state.chartOptions,
            colors: colors, // Apply the custom colors for each segment
            plotOptions: {
              pie: {
                expandOnClick: false,
                dataLabels: {
                  enabled: true,
                  formatter: (val, { seriesIndex }) => {
                    const total = this.state.chartData.reduce((acc, curr) => acc + curr, 0);
                    return `${val} (${Math.round((val / total) * 100)}%)`;
                  },
                  style: {
                    fontSize: '24px', // Increased font size for better visibility
                    fontWeight: 'bold',
                    colors: ['#000'], // Text color
                  },
                },
                donut: {
                  size: '30%', // Size of the inner donut hole
                },
              },
            },
    
            tooltip: {
              theme: 'dark',
              style: {
                fontSize: '20px', // Increased tooltip font size
              },
            },
          }}
          
          series={this.state.chartData}
          type='donut' // Donut chart for better visualization
          width='100%' // Maintain full width
          height='400px' // Set a fixed height for larger display
        />
    );
  }
}

export default PieChart;
