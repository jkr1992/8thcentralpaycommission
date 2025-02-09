document.getElementById('salaryForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Input Values
    const basicPay7 = parseFloat(document.getElementById('basicPay').value);
    const gradePay7 = parseFloat(document.getElementById('gradePay').value);
    const cityType = document.getElementById('cityType').value;

    // Validate Inputs
    if (isNaN(basicPay7) || isNaN(gradePay7)) {
        alert("Please enter valid numbers for Basic Pay and Grade Pay.");
        return;
    }

    // 7th CPC Calculations
    const da7 = (basicPay7 + gradePay7) * 0.50; // DA = 50%
    const hra7 = (basicPay7 + gradePay7) * getHRA(cityType, '7th');
    const ta7 = cityType === 'X' ? 7200 : cityType === 'Y' ? 3600 : 1800; // Transport Allowance
    const total7 = basicPay7 + gradePay7 + da7 + hra7 + ta7;

    // 8th CPC Projections (Hypothetical)
    const basicPay8 = Math.round((basicPay7 + gradePay7) * 2.57); // Fitment Factor = 2.57
    const hra8 = basicPay8 * getHRA(cityType, '8th');
    const total8 = basicPay8 + hra8;

    // Hike Calculations
    const hike = ((total8 - total7) / total7 * 100).toFixed(2);
    const diff = total8 - total7;

    // Update DOM
    document.getElementById('basic7').textContent = (basicPay7 + gradePay7).toLocaleString();
    document.getElementById('da7').textContent = da7.toLocaleString();
    document.getElementById('hra7').textContent = hra7.toLocaleString();
    document.getElementById('ta7').textContent = ta7.toLocaleString();
    document.getElementById('total7').textContent = total7.toLocaleString();

    document.getElementById('basic8').textContent = basicPay8.toLocaleString();
    document.getElementById('hra8').textContent = hra8.toLocaleString();
    document.getElementById('total8').textContent = total8.toLocaleString();

    document.getElementById('hike').textContent = `${hike}%`;
    document.getElementById('diff').textContent = diff.toLocaleString();

    // Update Chart
    updateChart(total7, total8);
});

// HRA Calculator (7th vs 8th CPC)
function getHRA(cityType, cpc) {
    const hraRates = {
        '7th': { X: 0.24, Y: 0.16, Z: 0.08 },
        '8th': { X: 0.30, Y: 0.20, Z: 0.10 } // Projected
    };
    return hraRates[cpc][cityType];
}

// Chart.js Integration
let myChart = null;
function updateChart(total7, total8) {
    const ctx = document.getElementById('salaryChart').getContext('2d');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['7th CPC', '8th CPC'],
            datasets: [{
                label: 'Total Salary (₹)',
                data: [total7, total8],
                backgroundColor: ['#4299e1', '#2b6cb0'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: (value) => '₹' + value.toLocaleString() }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}