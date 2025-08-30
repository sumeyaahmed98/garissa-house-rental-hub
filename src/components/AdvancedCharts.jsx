import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiHome, FiUsers } from 'react-icons/fi';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdvancedCharts = ({ data, type = 'revenue' }) => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (data) {
            generateChartData();
        }
    }, [data, type]);

    const generateChartData = () => {
        setLoading(true);

        switch (type) {
            case 'revenue':
                setChartData({
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                        {
                            label: 'Monthly Revenue',
                            data: data.revenue || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true,
                            tension: 0.4,
                        },
                    ],
                });
                break;

            case 'properties':
                setChartData({
                    labels: ['Available', 'Rented', 'Maintenance'],
                    datasets: [
                        {
                            data: [
                                data.properties?.available || 0,
                                data.properties?.rented || 0,
                                data.properties?.maintenance || 0,
                            ],
                            backgroundColor: [
                                'rgba(34, 197, 94, 0.8)',
                                'rgba(59, 130, 246, 0.8)',
                                'rgba(245, 158, 11, 0.8)',
                            ],
                            borderColor: [
                                'rgb(34, 197, 94)',
                                'rgb(59, 130, 246)',
                                'rgb(245, 158, 11)',
                            ],
                            borderWidth: 2,
                        },
                    ],
                });
                break;

            case 'users':
                setChartData({
                    labels: ['Admins', 'Owners', 'Tenants'],
                    datasets: [
                        {
                            label: 'User Distribution',
                            data: [
                                data.users?.admins || 0,
                                data.users?.owners || 0,
                                data.users?.tenants || 0,
                            ],
                            backgroundColor: [
                                'rgba(239, 68, 68, 0.8)',
                                'rgba(59, 130, 246, 0.8)',
                                'rgba(34, 197, 94, 0.8)',
                            ],
                            borderColor: [
                                'rgb(239, 68, 68)',
                                'rgb(59, 130, 246)',
                                'rgb(34, 197, 94)',
                            ],
                            borderWidth: 2,
                        },
                    ],
                });
                break;

            case 'performance':
                setChartData({
                    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    datasets: [
                        {
                            label: 'Revenue',
                            data: data.performance?.revenue || [0, 0, 0, 0],
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            yAxisID: 'y',
                        },
                        {
                            label: 'Properties',
                            data: data.performance?.properties || [0, 0, 0, 0],
                            borderColor: 'rgb(34, 197, 94)',
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            yAxisID: 'y1',
                        },
                    ],
                });
                break;

            default:
                setChartData(null);
        }

        setLoading(false);
    };

    const getChartOptions = () => {
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                },
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                },
            },
        };

        if (type === 'performance') {
            return {
                ...baseOptions,
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false,
                },
            };
        }

        return baseOptions;
    };

    const renderChart = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            );
        }

        if (!chartData) {
            return (
                <div className="flex items-center justify-center h-64 text-gray-500">
                    No data available
                </div>
            );
        }

        switch (type) {
            case 'revenue':
                return <Line data={chartData} options={getChartOptions()} />;
            case 'properties':
                return <Doughnut data={chartData} options={getChartOptions()} />;
            case 'users':
                return <Bar data={chartData} options={getChartOptions()} />;
            case 'performance':
                return <Line data={chartData} options={getChartOptions()} />;
            default:
                return <Bar data={chartData} options={getChartOptions()} />;
        }
    };

    const getChartTitle = () => {
        switch (type) {
            case 'revenue':
                return 'Revenue Trends';
            case 'properties':
                return 'Property Distribution';
            case 'users':
                return 'User Analytics';
            case 'performance':
                return 'Performance Metrics';
            default:
                return 'Analytics';
        }
    };

    const getChartIcon = () => {
        switch (type) {
            case 'revenue':
                return <FiDollarSign className="w-5 h-5 text-green-600" />;
            case 'properties':
                return <FiHome className="w-5 h-5 text-blue-600" />;
            case 'users':
                return <FiUsers className="w-5 h-5 text-purple-600" />;
            case 'performance':
                return <FiTrendingUp className="w-5 h-5 text-orange-600" />;
            default:
                return <FiTrendingUp className="w-5 h-5 text-gray-600" />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    {getChartIcon()}
                    <span className="ml-2">{getChartTitle()}</span>
                </h3>
                <div className="flex items-center space-x-2">
                    <select className="text-sm border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500">
                        <option>Last 12 Months</option>
                        <option>Last 6 Months</option>
                        <option>Last 3 Months</option>
                    </select>
                </div>
            </div>

            <div className="h-64">
                {renderChart()}
            </div>

            {type === 'revenue' && data?.revenue && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-lg font-semibold text-green-600">
                            KES {data.revenue.reduce((a, b) => a + b, 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Average Monthly</p>
                        <p className="text-lg font-semibold text-blue-600">
                            KES {(data.revenue.reduce((a, b) => a + b, 0) / 12).toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Growth Rate</p>
                        <p className="text-lg font-semibold text-purple-600">
                            +{((data.revenue[data.revenue.length - 1] - data.revenue[0]) / data.revenue[0] * 100).toFixed(1)}%
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvancedCharts;
