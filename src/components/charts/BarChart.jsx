import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";
import styles from "./BarChart.module.css";

const BarChart = ({ 
  chartData, 
  chartOptions, 
  title, 
  subtitle, 
  height = "400px",
  loading = false,
  error = null,
  onRetry = null
}) => {
  const { t, i18n } = useTranslation();
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    if (chartData && chartOptions) {
      setIsChartReady(true);
    }
  }, [chartData, chartOptions]);

  // Memoize chart options for performance
  const enhancedChartOptions = useMemo(() => {
    if (!chartOptions) return {};

    const isRTL = i18n.language === 'ar';

    return {
      ...chartOptions,
      chart: {
        ...chartOptions.chart,
        toolbar: {
          show: false,
        },
        background: 'transparent',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, system-ui, sans-serif',
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          horizontal: false,
          columnWidth: '60%',
          dataLabels: {
            position: "top",
          },
          distributed: false,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => {
          return val ? val.toLocaleString() : '0';
        },
        offsetY: -25,
        style: {
          fontSize: "13px",
          fontWeight: 700,
          colors: ["#2c5282"],
        },
        background: {
          enabled: true,
          foreColor: '#ffffff',
          padding: 8,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#63b3ed',
          opacity: 0.95,
          dropShadow: {
            enabled: true,
            top: 2,
            left: 2,
            blur: 4,
            color: '#000',
            opacity: 0.15
          }
        }
      },
      xaxis: {
        categories: chartOptions.xaxis?.categories || [],
        position: "bottom",
        axisBorder: {
          show: true,
          color: "#63b3ed",
          height: 2,
        },
        axisTicks: {
          show: true,
          color: "#63b3ed",
          height: 6,
        },
        labels: {
          style: {
            colors: ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#f56565', '#38b2ac', '#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#f56565', '#38b2ac'],
            fontSize: "14px",
            fontWeight: 700,
            cssClass: 'month-label',
          },
          rotate: -45,
          rotateAlways: false,
          trim: false,
          hideOverlappingLabels: false,
          offsetY: 0,
          offsetX: 0,
        },
        tooltip: {
          enabled: true
        },
        crosshairs: {
          show: true,
          stroke: {
            color: '#63b3ed',
            width: 2,
            dashArray: 0
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: ["#63b3ed"],
            fontSize: "13px",
            fontWeight: 600,
          },
          formatter: (val) => {
            return val ? val.toLocaleString() : '0';
          }
        },
        title: {
          text: t('dashboard.charts.userCount') || 'Users',
          rotate: -90,
          offsetX: 0,
          offsetY: 0,
          style: {
            color: '#4299e1',
            fontSize: '14px',
            fontWeight: 700,
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: ['#63b3ed', '#4299e1'],
          inverseColors: false,
          opacityFrom: 0.95,
          opacityTo: 0.85,
          stops: [0, 100],
        },
      },
      tooltip: {
        theme: 'light',
        marker: {
          show: true,
        },
        y: {
          formatter: (val) => {
            return val ? val.toLocaleString() : '0';
          }
        },
        style: {
          fontSize: '13px',
          fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, system-ui, sans-serif',
        }
      },
      grid: {
        borderColor: "#bee3f8",
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          top: 0,
          right: 10,
          bottom: 0,
          left: 10
        }
      },
      colors: ['#63b3ed'],
      states: {
        hover: {
          filter: {
            type: 'lighten',
            value: 0.1,
          }
        },
        active: {
          filter: {
            type: 'darken',
            value: 0.1,
          }
        }
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '70%'
              }
            },
            xaxis: {
              labels: {
                rotate: -45,
                style: {
                  fontSize: '11px'
                }
              }
            }
          }
        },
        {
          breakpoint: 480,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '80%'
              }
            },
            dataLabels: {
              style: {
                fontSize: '10px'
              }
            }
          }
        }
      ]
    };
  }, [chartOptions, i18n.language]);

  // Display loading state
  if (loading) {
    return (
      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>
            {title || t('dashboard.charts.userRegistrationGrowth')}
          </h2>
          <p className={styles.chartSubtitle}>
            {subtitle || t('dashboard.charts.registrationStats')}
          </p>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>
            {title || t('dashboard.charts.userRegistrationGrowth')}
          </h2>
          <p className={styles.chartSubtitle}>
            {subtitle || t('dashboard.charts.registrationStats')}
          </p>
        </div>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          {onRetry && (
            <button className={styles.retryButton} onClick={onRetry}>
              {t('common.tryAgain')}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Display chart
  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h2 className={styles.chartTitle}>
          {title || t('dashboard.charts.userRegistrationGrowth')}
        </h2>
        <p className={styles.chartSubtitle}>
          {subtitle || t('dashboard.charts.registrationStats')}
        </p>
      </div>
      <div className={styles.chartWrapper}>
        {isChartReady && (
          <Chart
            options={enhancedChartOptions}
            series={chartData}
            type="bar"
            width="100%"
            height={height}
          />
        )}
      </div>
    </div>
  );
};

BarChart.propTypes = {
  chartData: PropTypes.array.isRequired,
  chartOptions: PropTypes.object.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  height: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
};

export default BarChart;
