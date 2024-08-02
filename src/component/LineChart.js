import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation'; 
import './LineChart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin 
);

const LineChart = () => {
  const [chart, setChart] = useState({});
  const [timePeriod, setTimePeriod] = useState('1w'); 

  const baseUrl = `https://api.coinranking.com/v2/coins/?limit=10&timeperiod=${timePeriod}`;
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const apiKey = "coinranking2274ed14b0d421db21bdc296daec5e23564c6958adc70294";

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(`${proxyUrl}${baseUrl}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': apiKey,
          },
        });

        if (response.ok) {
          const json = await response.json();
          setChart(json.data);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCoins();
  }, [baseUrl, proxyUrl, apiKey, timePeriod]);

  const coins = chart?.coins || [];
  const labels = coins.map((x) => x.name);
  const prices = coins.map((x) => parseFloat(x.price));

  const data = {
    labels,
    datasets: [
      {
        data: prices,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: '#4B40EE',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false, // Hide x-axis grid lines
        },
        ticks: {
          display: false, // Hide x-axis ticks
        },
      },
      y: {
        grid: {
          display: false, // Hide y-axis grid lines
        },
        ticks: {
          display: false, // Hide y-axis ticks
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: () => '',
        },
      },
      annotation: {
        annotations: {
          verticalLine: {
            type: 'line',
            borderColor: '#999999',
            borderWidth: 2,
            mode: 'vertical',
            scaleID: 'x',
            value: coins.length > 0 ? coins.length - 1 : 0,
            borderDash: [6, 6],
            label: {
              content: 'Vertical Line',
              enabled: true,
              position: 'top',
              backgroundColor: '#4B40EE',
              color: 'white',
              padding: 4,
            },
          },
          horizontalLine: {
            type: 'line',
            borderColor: '#999999',
            borderWidth: 2,
            mode: 'horizontal',
            scaleID: 'y',
            value: prices.length > 0 ? Math.max(...prices) : 0,
            borderDash: [6, 6],
            label: {
              content: 'Horizontal Line',
              enabled: true,
              position: 'left',
              backgroundColor: '#4B40EE',
              color: 'white',
              padding: 4,
            },
          },
          valueLabel: {
            type: 'label',
            xValue: coins.length > 0 ? coins.length - 1 : 0,
            yValue: prices.length > 0 ? prices[coins.length - 1] : 0,
            backgroundColor: '#4B40EE',
            borderColor: '#4B40EE',
            borderRadius: 4,
            borderWidth: 1,
            color: 'white',
            font: {
              size: 14,
              weight: 'bold',
            },
            padding: 6,
            position: 'end',
            content: `${prices.length > 0 ? prices[coins.length - 1].toFixed(2) : '0.00'}`,
            enabled: true,
          },
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <div className="header">
        <div className="header-left">
          <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} style={{color:'darkgray', padding:'10px'}}/>
          <span>Fullscreen</span>
          <FontAwesomeIcon icon={faSquarePlus} style={{color:'darkgray', padding:'10px'}}/>
          <span>Compare</span>
        </div>
        <div className="time-periods">
          {['1d', '3d', '1w', '1m', '6m', '1y', 'max'].map(period => (
            <div
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`time-period ${timePeriod === period ? 'selected' : ''}`}
            >
              {period}
            </div>
          ))}
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
