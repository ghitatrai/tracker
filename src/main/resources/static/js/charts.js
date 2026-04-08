console.log("Charts.js loaded");

function renderLineChart(ctx, labels, data) {
    if (!ctx) {
        console.error("Chart context not provided");
        return;
    }
    console.log("Rendering line chart with", labels.length, "labels and", data.length, "data points");
    try {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Spending',
                    data: data,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });
        console.log("Line chart rendered successfully");
    } catch (err) {
        console.error("Error rendering line chart:", err);
    }
}

function renderBarChart(ctx, labels, data1, data2) {
    if (!ctx) {
        console.error("Chart context not provided");
        return;
    }
    console.log("Rendering bar chart");
    try {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'This Year',
                        data: data1,
                        backgroundColor: '#667eea'
                    },
                    {
                        label: 'Last Year',
                        data: data2,
                        backgroundColor: '#9f7aea'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
        console.log("Bar chart rendered successfully");
    } catch (err) {
        console.error("Error rendering bar chart:", err);
    }
}

function renderPieChart(ctx, labels, data) {
    if (!ctx) {
        console.error("Chart context not provided");
        return;
    }
    console.log("Rendering pie chart");
    try {
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#4facfe'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
        console.log("Pie chart rendered successfully");
    } catch (err) {
        console.error("Error rendering pie chart:", err);
    }
}