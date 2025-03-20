import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './SeeChapterWeitghage.css'; // Import the CSS file

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SeeChapterWeitghage() {
	const [questionSets, setQuestionSets] = useState([]);
	const [selectedSet, setSelectedSet] = useState(null);
	const [chartData, setChartData] = useState(null);
	const [difficultyChartData, setDifficultyChartData] = useState(null);
	const [stackedBarChartData, setStackedBarChartData] = useState(null);
	const [chapters, setChapters] = useState([]);
	const [difficulty, setDifficulty] = useState([]);
    const [flag, setFlag] = useState(false);
	const fetchQuestionSets = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/v1/admin/questionSets`,
				{
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				}
			);
			setQuestionSets(response.data.questionSets);
		} catch (error) {
			console.error("Error fetching question sets:", error);
		}
	};

	const fetchWeightageData = async (setId) => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/v1/admin/questionSets/${setId}/weightage`,
				{
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				}
			);
			const data = response.data.chapters;
			setChapters(data);
			const difficultyData = response.data.difficulty;
			setDifficulty(difficultyData);

			if (!Array.isArray(data)) {
				console.error("Expected an array but got:", data);
				return;
			}

			// Aggregate weightage by topic
			const topicWeightage = data.reduce((acc, item) => {
				const topic = item; // Assuming each item has a 'topic' field
				if (!acc[topic]) {
					acc[topic] = 0;
				}
				acc[topic] += 1;
				return acc;
			}, {});

			// Calculate total weightage
			const totalWeightage = Object.values(topicWeightage).reduce((sum, weight) => sum + weight, 0);

			// Calculate percentage for each topic
			const chartData = {
				labels: Object.keys(topicWeightage),
				datasets: [
					{
						data: Object.values(topicWeightage).map(weight => (weight / totalWeightage) * 100),
						backgroundColor: [
							'#FF6384',
							'#36A2EB',
							'#FFCE56',
							'#4BC0C0',
							'#9966FF',
							'#FF9F40',
							'#FF6384',
							'#36A2EB',
							'#FFCE56',
							'#4BC0C0',
						],
						hoverBackgroundColor: [
							'#FF6384',
							'#36A2EB',
							'#FFCE56',
							'#4BC0C0',
							'#9966FF',
							'#FF9F40',
							'#FF6384',
							'#36A2EB',
							'#FFCE56',
							'#4BC0C0',
						],
					},
				],
			};
			setChartData(chartData);

			// Aggregate difficulty data
			const difficultyWeightage = difficultyData.reduce((acc, item) => {
				const difficulty = item; // Assuming each item has a 'difficulty' field
				if (!acc[difficulty]) {
					acc[difficulty] = 0;
				}
				acc[difficulty] += 1;
				return acc;
			}, {});

			// Calculate total difficulty weightage
			const totalDifficultyWeightage = Object.values(difficultyWeightage).reduce((sum, weight) => sum + weight, 0);
            const difficultyMapping = { '1': 'Easy', '2': 'Medium', '3': 'Hard' };
			// Calculate percentage for each difficulty
			const difficultyChartData = {
				labels: Object.keys(difficultyWeightage).map(key => difficultyMapping[key]),
				datasets: [
					{
						data: Object.values(difficultyWeightage).map(weight => (weight / totalDifficultyWeightage) * 100),
						backgroundColor: [
							'#FF6384',
							'#36A2EB',
							'#FFCE56',
						],
						hoverBackgroundColor: [
							'#FF6384',
							'#36A2EB',
							'#FFCE56',
						],
					},
				],
			};
			setDifficultyChartData(difficultyChartData);

			// Process data for stacked bar chart
			const stackedData = processDataForStackedBarChart(data, difficultyData);
			setStackedBarChartData(stackedData);

		} catch (error) {
			console.error("Error fetching weightage data:", error);
		}
	};

	useEffect(() => {
		fetchQuestionSets();
	}, []);

	useEffect(() => {
		if (selectedSet) {
			fetchWeightageData(selectedSet);
		}
	}, [selectedSet]);

	// Define chart options

    const chartTitle = {
        responsive: true,
		maintainAspectRatio: true, // Allow the chart to resize
		plugins: {
			legend: {
				position: 'bottom',
				labels: {
					font: {
						size: 10, // Adjust font size for legend
					},
					color: '#333',
					padding: 8, // Add padding between labels
				},
			},
			title: {
				display: true,
                position: 'bottom',
				text: 'Topic Distribution',
				font: {
					size: 14, // Adjust font size for title
				},
				color: '#333',
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						const label = context.label || '';
						const value = context.raw || 0;
						return `${label}: ${value.toFixed(2)}%`;
					},
				},
			},
		},
        
    };
    const difficultyChartTitle = {
        responsive: true,
		maintainAspectRatio: true, // Allow the chart to resize
		plugins: {
			legend: {
				position: 'bottom',
				labels: {
					font: {
						size: 10, // Adjust font size for legend
					},
					color: '#333',
					padding: 8, // Add padding between labels
				},
			},
			title: {
				display: true,
                position: 'bottom',
				text: 'Topic Weightage Distribution',
				font: {
					size: 14, // Adjust font size for title
				},
				color: '#333',
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						const label = context.label || '';
						const value = context.raw || 0;
						return `${label}: ${value.toFixed(2)}%`;
					},
				},
			},
		},
    };

	const processDataForStackedBarChart = (chapters, difficulty) => {
		const difficultyMapping = { '1': 'Easy', '2': 'Medium', '3': 'Hard' };
		const chapterDifficultyWeightage = chapters.reduce((acc, chapter, index) => {
			const difficultyLevel = difficultyMapping[difficulty[index]];
			if (!acc[chapter]) {
				acc[chapter] = { Easy: 0, Medium: 0, Hard: 0 };
			}
			acc[chapter][difficultyLevel] += 1;
			return acc;
		}, {});

		const labels = Object.keys(chapterDifficultyWeightage);
		const easyData = labels.map(label => chapterDifficultyWeightage[label].Easy);
		const mediumData = labels.map(label => chapterDifficultyWeightage[label].Medium);
		const hardData = labels.map(label => chapterDifficultyWeightage[label].Hard);

		return {
			labels,
			datasets: [
				{
					label: 'Easy',
					data: easyData,
					backgroundColor: '#FF6384',
				},
				{
					label: 'Medium',
					data: mediumData,
					backgroundColor: '#36A2EB',
				},
				{
					label: 'Hard',
					data: hardData,
					backgroundColor: '#FFCE56',
				},
			],
		};
	};

	// Define chart options for stacked bar chart
	const stackedBarChartOptions = {
		responsive: true,
		maintainAspectRatio: true, // Allow the chart to resize
		plugins: {
			legend: {
				position: 'bottom',
			},
			title: {
				display: true,
            
				text: 'Question Difficulty Distribution by Chapter',
				font: {
					size: 15, // Adjust font size for title
				},
				color: '#333',
			},
		},
		scales: {
			x: {
				stacked: true,
			},
			y: {
				stacked: true,
			},
		},
	};

	return (
        <div className="question-sets-container">
		<div className="container">
            <div className="header">
			<h1>See Chapter Weightage</h1>

			<select onChange={(e) => {setSelectedSet(e.target.value); setFlag(true)}}>
				<option value="">Select a question set</option>
				{questionSets.map(set => (
					<option key={set._id} value={set._id}>{set.setName}</option>
				))}
			</select>
            </div>

            {flag && <div className="Charts">
            <div className="stacked-bar-chart-container">
			{stackedBarChartData && <Bar data={stackedBarChartData} options={stackedBarChartOptions} className="bar-chart" />}
            </div>
            <div className="pie-chart-container">
			{chartData && <Pie data={chartData} options={chartTitle} className="pie-chart" />}
			{difficultyChartData && <Pie data={difficultyChartData} options={difficultyChartTitle} className="pie-chart" />}
            </div>

            </div>}
		</div>
        </div>
	);
}

