let sampleCount = 0;
let charts = {};

function scrollToAnalysis() {
    document.getElementById("analysis").scrollIntoView({ behavior: "smooth" });
}

function scrollToResults() {
    document.getElementById("results").scrollIntoView({ behavior: "smooth" });
}

function addSample() {
    sampleCount++;

    const container = document.getElementById("samplesContainer");

    const card = document.createElement("div");
    card.className = "sample-card";
    card.dataset.sample = sampleCount;

    card.innerHTML = `
        <div class="sample-top">
            <span class="sample-number">Sample ${sampleCount}</span>
            <button class="delete-btn" onclick="deleteSample(this)">🗑</button>
        </div>

        <div class="input-group">
            <label>Sample name</label>
            <input type="text" class="sample-name" value="Sample ${sampleCount}">
        </div>

        <div class="input-group">
            <label>Temperature (°C)</label>
            <input type="number" class="sample-temp" placeholder="0.00" step="0.01">
        </div>

        <div class="input-group">
            <label>Density (g/mL)</label>
            <input type="number" class="sample-density" placeholder="0.00" step="0.001">
        </div>

        <div class="input-group">
            <label>Flow Time (s)</label>
            <input type="number" class="sample-flow" placeholder="0.00" step="0.01">
        </div>
    `;

    container.appendChild(card);
}

function deleteSample(button) {
    button.closest(".sample-card").remove();
    updateSampleNumbers();
}

function updateSampleNumbers() {
    const cards = document.querySelectorAll(".sample-card");

    cards.forEach((card, index) => {
        const number = index + 1;
        card.dataset.sample = number;
        card.querySelector(".sample-number").textContent = `Sample ${number}`;

        const nameInput = card.querySelector(".sample-name");

        if (
            nameInput.value.trim() === "" ||
            /^Sample \d+$/.test(nameInput.value)
        ) {
            nameInput.value = `Sample ${number}`;
        }
    });

    sampleCount = cards.length;
}

function getReferenceValues() {
    return {
        temperature: Number(document.getElementById("refTemp").value),
        density: Number(document.getElementById("refDensity").value),
        flow: Number(document.getElementById("refFlow").value)
    };
}

function getCommercialSamples() {
    const cards = document.querySelectorAll(".sample-card");
    const samples = [];

    cards.forEach(card => {
        const name = card.querySelector(".sample-name").value.trim();
        const temperature = Number(card.querySelector(".sample-temp").value);
        const density = Number(card.querySelector(".sample-density").value);
        const flow = Number(card.querySelector(".sample-flow").value);

        samples.push({
            name: name || `Sample ${samples.length + 1}`,
            temperature,
            density,
            flow
        });
    });

    return samples;
}

function percentageDifference(reference, sample) {
    if (reference === 0) return 0;
    return Math.abs((sample - reference) / reference) * 100;
}

function analyzeOils() {
    const reference = getReferenceValues();
    const samples = getCommercialSamples();

    if (
        !Number.isFinite(reference.temperature) ||
        !Number.isFinite(reference.density) ||
        !Number.isFinite(reference.flow)
    ) {
        alert("Please enter all values for the Original Oil reference.");
        return;
    }

    if (reference.temperature === 0 || reference.density === 0 || reference.flow === 0) {
        alert("Original Oil reference values cannot be zero.");
        return;
    }

    if (samples.length === 0) {
        alert("Please add at least one commercial sample.");
        return;
    }

    const invalidSample = samples.find(sample =>
        !Number.isFinite(sample.temperature) ||
        !Number.isFinite(sample.density) ||
        !Number.isFinite(sample.flow)
    );

    if (invalidSample) {
        alert("Please enter all values for every commercial sample.");
        return;
    }

    const results = samples.map(sample => {
        const temperatureDiff = percentageDifference(
            reference.temperature,
            sample.temperature
        );

        const densityDiff = percentageDifference(
            reference.density,
            sample.density
        );

        const flowDiff = percentageDifference(
            reference.flow,
            sample.flow
        );

        const averageDeviation =
            (temperatureDiff + densityDiff + flowDiff) / 3;

        const similarity = Math.max(0, 100 - averageDeviation);

        const differences = {
            "Temperature": temperatureDiff,
            "Density": densityDiff,
            "Flow Time": flowDiff
        };

        const largestDeviation = Object.keys(differences).reduce(
            (a, b) => differences[a] > differences[b] ? a : b
        );

        return {
            name: sample.name,
            temperature: sample.temperature,
            density: sample.density,
            flow: sample.flow,
            temperatureDiff,
            densityDiff,
            flowDiff,
            similarity,
            largestDeviation
        };
    });

    results.sort((a, b) => b.similarity - a.similarity);

    displayResults(results, reference);

    document.getElementById("results").classList.remove("hidden");
    document.getElementById("viewResultsBtn").classList.remove("hidden");

    document.getElementById("homeSamples").textContent = results.length;
    document.getElementById("homeBest").textContent = results[0].name;
    document.getElementById("homeScore").textContent =
        `${results[0].similarity.toFixed(2)}%`;

    setTimeout(() => {
        scrollToResults();
    }, 100);
}

function displayResults(results, reference) {
    const oilType = document.getElementById("oilType").value;
    const best = results[0];

    document.getElementById("resultOilName").textContent = oilType;
    document.getElementById("totalSamples").textContent = results.length;
    document.getElementById("bestMatch").textContent = best.name;
    document.getElementById("bestSimilarity").textContent =
        `${best.similarity.toFixed(2)}%`;

    const average =
        results.reduce((sum, item) => sum + item.similarity, 0) /
        results.length;

    document.getElementById("averageSimilarity").textContent =
        `${average.toFixed(2)}%`;

    const parameterTotals = {
        "Temperature": 0,
        "Density": 0,
        "Flow Time": 0
    };

    results.forEach(item => {
        parameterTotals["Temperature"] += item.temperatureDiff;
        parameterTotals["Density"] += item.densityDiff;
        parameterTotals["Flow Time"] += item.flowDiff;
    });

    const largestParameter = Object.keys(parameterTotals).reduce(
        (a, b) => parameterTotals[a] > parameterTotals[b] ? a : b
    );

    document.getElementById("largestDeviation").textContent =
        largestParameter;

    document.getElementById("closestName").textContent = best.name;
    document.getElementById("closestScore").textContent =
        `${best.similarity.toFixed(2)}%`;

    document.getElementById("closestDescription").textContent =
        `${best.name} has the closest measured physical-property profile to the Original Oil reference for ${oilType}, based on temperature, density and flow time.`;

    displayTable(results);
    displayParameterAnalysis(results);
    createCharts(results, reference);
}

function displayTable(results) {
    const tbody = document.getElementById("resultsTable");
    tbody.innerHTML = "";

    results.forEach((item, index) => {
        const row = document.createElement("tr");

        if (index === 0) {
            row.className = "best";
        }

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                ${item.name}
                ${index === 0 ? "<br><small>🏆 Closest Match</small>" : ""}
            </td>
            <td>${item.temperatureDiff.toFixed(2)}%</td>
            <td>${item.densityDiff.toFixed(2)}%</td>
            <td>${item.flowDiff.toFixed(2)}%</td>
            <td><strong>${item.similarity.toFixed(2)}%</strong></td>
        `;

        tbody.appendChild(row);
    });
}

function displayParameterAnalysis(results) {
    const container = document.getElementById("parameterAnalysis");
    container.innerHTML = "";

    results.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "parameter-card";

        card.innerHTML = `
            <div class="parameter-header">
                <h3>${item.name}</h3>
                <span class="rank">#${index + 1}</span>
            </div>

            <div class="parameter-row">
                <span>Temperature difference</span>
                <strong>${item.temperatureDiff.toFixed(2)}%</strong>
            </div>

            <div class="parameter-row">
                <span>Density difference</span>
                <strong>${item.densityDiff.toFixed(2)}%</strong>
            </div>

            <div class="parameter-row">
                <span>Flow-time difference</span>
                <strong>${item.flowDiff.toFixed(2)}%</strong>
            </div>

            <div class="parameter-row">
                <span>Similarity</span>
                <strong>${item.similarity.toFixed(2)}%</strong>
            </div>

            <div class="progress">
                <div class="progress-bar" style="width:${item.similarity}%"></div>
            </div>

            <p class="parameter-row">
                <span>Largest deviation</span>
                <strong>${item.largestDeviation}</strong>
            </p>
        `;

        container.appendChild(card);
    });
}

function createCharts(results, reference) {
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};

    const labels = results.map(item => item.name);

    charts.temperature = new Chart(
        document.getElementById("temperatureChart"),
        {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Original",
                        data: results.map(() => reference.temperature),
                        backgroundColor: "#d99a24"
                    },
                    {
                        label: "Sample",
                        data: results.map(item => item.temperature),
                        backgroundColor: "#05647a"
                    }
                ]
            },
            options: chartOptions("Temperature (°C)")
        }
    );

    charts.density = new Chart(
        document.getElementById("densityChart"),
        {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Original",
                        data: results.map(() => reference.density),
                        backgroundColor: "#d99a24"
                    },
                    {
                        label: "Sample",
                        data: results.map(item => item.density),
                        backgroundColor: "#05647a"
                    }
                ]
            },
            options: chartOptions("Density (g/mL)")
        }
    );

    charts.flow = new Chart(
        document.getElementById("flowChart"),
        {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Original",
                        data: results.map(() => reference.flow),
                        backgroundColor: "#d99a24"
                    },
                    {
                        label: "Sample",
                        data: results.map(item => item.flow),
                        backgroundColor: "#05647a"
                    }
                ]
            },
            options: chartOptions("Flow Time (s)")
        }
    );

    charts.similarity = new Chart(
        document.getElementById("similarityChart"),
        {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Similarity",
                        data: results.map(item => item.similarity),
                        backgroundColor: "#05647a"
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: "Similarity Score (%)"
                        }
                    }
                }
            }
        }
    );
}

function chartOptions(yTitle) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: yTitle
                }
            }
        }
    };
}

function resetAnalysis() {
    document.getElementById("refTemp").value = "";
    document.getElementById("refDensity").value = "";
    document.getElementById("refFlow").value = "";

    document.getElementById("samplesContainer").innerHTML = "";

    sampleCount = 0;

    document.getElementById("results").classList.add("hidden");
    document.getElementById("viewResultsBtn").classList.add("hidden");

    document.getElementById("homeSamples").textContent = "0";
    document.getElementById("homeBest").textContent = "—";
    document.getElementById("homeScore").textContent = "—";

    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};

    addSample();
    addSample();
    addSample();

    scrollToAnalysis();
}

function saveAnalysis() {
    const data = {
        date: new Date().toLocaleString(),
        oilType: document.getElementById("oilType").value,
        reference: getReferenceValues(),
        samples: getCommercialSamples()
    };

    localStorage.setItem("oilAnalysis", JSON.stringify(data));

    alert("Analysis saved successfully.");
}

function exportCSV() {
    const rows = document.querySelectorAll("#resultsTable tr");

    if (!rows.length) {
        alert("Please analyze the samples first.");
        return;
    }

    let csv =
        "Rank,Sample,Temperature Difference,Density Difference,Flow Difference,Similarity\n";

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");

        csv += Array.from(cells)
            .map(cell => `"${cell.innerText.replace(/\n/g, " ")}"`)
            .join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "oil-analysis-results.csv";
    link.click();

    URL.revokeObjectURL(url);
}

function generateReport() {
    window.print();
}

document.addEventListener("DOMContentLoaded", () => {
    addSample();
    addSample();
    addSample();
});