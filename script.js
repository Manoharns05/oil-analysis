
"use strict";

let sampleCount = 0;
let charts = {};
let latestResults = null;

function scrollToAnalysis() {
    document.getElementById("analysis").scrollIntoView({ behavior: "smooth" });
}

function scrollToResults() {
    const results = document.getElementById("results");

    if (!results.classList.contains("hidden")) {
        results.scrollIntoView({ behavior: "smooth" });
    } else {
        alert("Please analyze the samples first.");
    }
}

function addSample() {
    sampleCount++;

    const container = document.getElementById("samplesContainer");
    const card = document.createElement("div");

    card.className = "sample-card";

    card.innerHTML = `
        <div class="sample-top">
            <span class="sample-number">Sample ${sampleCount}</span>
            <button type="button" class="delete-btn"
                aria-label="Delete sample"
                onclick="deleteSample(this)">Delete</button>
        </div>

        <div class="input-group">
            <label>Sample name</label>
            <input type="text" class="sample-name"
                value="Sample ${sampleCount}" required>
        </div>

        <div class="input-grid">
            <div class="input-group">
                <label>Temperature (°C)</label>
                <input type="number" class="sample-temp"
                    min="0" step="0.01" placeholder="e.g. 30.00" required>
            </div>

            <div class="input-group">
                <label>Density (g/mL)</label>
                <input type="number" class="sample-density"
                    min="0" step="0.001" placeholder="e.g. 0.867" required>
            </div>

            <div class="input-group">
                <label>Viscosity (mPa·s)</label>
                <input type="number" class="sample-flow"
                    min="0" step="0.001" placeholder="Enter viscosity" required>
            </div>
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
        const nameInput = card.querySelector(".sample-name");
        const oldName = nameInput.value.trim();

        if (!oldName || /^Sample \d+$/.test(oldName)) {
            nameInput.value = `Sample ${number}`;
        }

        card.querySelector(".sample-number").textContent =
            `Sample ${number}`;
    });

    sampleCount = cards.length;
}

function readNumber(id) {
    const input = document.getElementById(id);
    const value = input.value.trim();

    return value === "" ? NaN : Number(value);
}

function getReferenceValues() {
    return {
        temperature: readNumber("refTemp"),
        density: readNumber("refDensity"),
        viscosity: readNumber("refFlow")
    };
}

function getCommercialSamples() {
    return Array.from(document.querySelectorAll(".sample-card")).map(
        (card, index) => {
            const name = card.querySelector(".sample-name").value.trim();
            const temperature = card.querySelector(".sample-temp").value;
            const density = card.querySelector(".sample-density").value;
            const viscosity = card.querySelector(".sample-flow").value;

            return {
                name: name || `Sample ${index + 1}`,
                temperature: temperature.trim() === "" ? NaN : Number(temperature),
                density: density.trim() === "" ? NaN : Number(density),
                viscosity: viscosity.trim() === "" ? NaN : Number(viscosity)
            };
        }
    );
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
        !Number.isFinite(reference.viscosity) ||
        reference.temperature <= 0 ||
        reference.density <= 0 ||
        reference.viscosity <= 0
    ) {
        alert("Please enter positive numeric values for all three Original Oil reference properties.");
        return;
    }

    if (samples.length === 0) {
        alert("Please add at least one commercial sample.");
        return;
    }

    const invalidSample = samples.find(sample =>
        !Number.isFinite(sample.temperature) ||
        !Number.isFinite(sample.density) ||
        !Number.isFinite(sample.viscosity) ||
        sample.temperature <= 0 ||
        sample.density <= 0 ||
        sample.viscosity <= 0
    );

    if (invalidSample) {
        alert(
            `Please enter positive numeric temperature, density and viscosity values for "${invalidSample.name}".`
        );
        return;
    }

    const names = samples.map(sample => sample.name.toLowerCase());

    if (new Set(names).size !== names.length) {
        alert("Please give each commercial sample a unique name.");
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

        const viscosityDiff = percentageDifference(
            reference.viscosity,
            sample.viscosity
        );

        const averageDeviation =
            (temperatureDiff + densityDiff + viscosityDiff) / 3;

        const similarity = Math.max(0, 100 - averageDeviation);

        const differences = {
            Temperature: temperatureDiff,
            Density: densityDiff,
            Viscosity: viscosityDiff
        };

        const largestDeviation = Object.keys(differences).reduce(
            (a, b) => differences[a] > differences[b] ? a : b
        );

        return {
            name: sample.name,
            temperature: sample.temperature,
            density: sample.density,
            viscosity: sample.viscosity,
            temperatureDiff,
            densityDiff,
            viscosityDiff,
            averageDeviation,
            similarity,
            largestDeviation
        };
    });

    results.sort((a, b) => b.similarity - a.similarity);

    latestResults = {
        date: new Date().toLocaleString(),
        oilType: document.getElementById("oilType").value,
        reference,
        results
    };

    displayResults(results, reference);

    document.getElementById("results").classList.remove("hidden");
    document.getElementById("viewResultsBtn").classList.add("visible");

    document.getElementById("homeSamples").textContent = results.length;
    document.getElementById("homeBest").textContent = results[0].name;
    document.getElementById("homeScore").textContent =
        `${results[0].similarity.toFixed(2)}%`;

    setTimeout(scrollToResults, 100);
}

function displayResults(results, reference) {
    const oilType = document.getElementById("oilType").value;
    const best = results[0];

    document.getElementById("resultOilName").textContent = oilType;
    document.getElementById("totalSamples").textContent = results.length;
    document.getElementById("bestMatch").textContent = best.name;
    document.getElementById("bestSimilarity").textContent =
        `${best.similarity.toFixed(2)}%`;

    const averageSimilarity =
        results.reduce((sum, item) => sum + item.similarity, 0) /
        results.length;

    document.getElementById("averageSimilarity").textContent =
        `${averageSimilarity.toFixed(2)}%`;

    document.getElementById("closestName").textContent = best.name;
    document.getElementById("closestScore").textContent =
        `${best.similarity.toFixed(2)}%`;

    document.getElementById("closestDescription").textContent =
        `${best.name} has the closest measured temperature, density and viscosity profile to the Original Oil reference for ${oilType}. This is a physical-property similarity comparison, not proof of purity.`;

    displayTable(results);
    displayParameterAnalysis(results);
    createCharts(results, reference);
}

function displayTable(results) {
    const tbody = document.getElementById("resultsTable");
    tbody.replaceChildren();

    results.forEach((item, index) => {
        const row = document.createElement("tr");

        if (index === 0) {
            row.className = "best";
        }

        const values = [
            String(index + 1),
            item.name,
            `${item.temperatureDiff.toFixed(2)}%`,
            `${item.densityDiff.toFixed(2)}%`,
            `${item.viscosityDiff.toFixed(2)}%`,
            `${item.similarity.toFixed(2)}%`
        ];

        values.forEach((value, cellIndex) => {
            const cell = document.createElement("td");

            if (cellIndex === 1) {
                cell.textContent = index === 0
                    ? `${value} — Closest Match`
                    : value;
            } else {
                cell.textContent = value;
            }

            if (cellIndex === 5) {
                const strong = document.createElement("strong");
                strong.textContent = value;
                cell.replaceChildren(strong);
            }

            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
}

function displayParameterAnalysis(results) {
    const container = document.getElementById("parameterAnalysis");
    container.replaceChildren();

    results.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "parameter-card";

        const header = document.createElement("div");
        header.className = "parameter-header";

        const title = document.createElement("h3");
        title.textContent = item.name;

        const rank = document.createElement("span");
        rank.className = "rank";
        rank.textContent = `#${index + 1}`;

        header.append(title, rank);
        card.appendChild(header);

        const rows = [
            ["Temperature difference", item.temperatureDiff],
            ["Density difference", item.densityDiff],
            ["Viscosity difference", item.viscosityDiff],
            ["Similarity", item.similarity]
        ];

        rows.forEach(([label, value]) => {
            const row = document.createElement("div");
            row.className = "parameter-row";

            const labelSpan = document.createElement("span");
            labelSpan.textContent = label;

            const strong = document.createElement("strong");
            strong.textContent = `${value.toFixed(2)}%`;

            row.append(labelSpan, strong);
            card.appendChild(row);
        });

        const progress = document.createElement("div");
        progress.className = "progress";

        const bar = document.createElement("div");
        bar.className = "progress-bar";
        bar.style.width = `${Math.min(100, item.similarity)}%`;

        progress.appendChild(bar);
        card.appendChild(progress);

        const largestRow = document.createElement("div");
        largestRow.className = "parameter-row";

        const largestLabel = document.createElement("span");
        largestLabel.textContent = "Largest deviation";

        const largestValue = document.createElement("strong");
        largestValue.textContent = item.largestDeviation;

        largestRow.append(largestLabel, largestValue);
        card.appendChild(largestRow);

        container.appendChild(card);
    });
}

function createCharts(results, reference) {
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};

    const labels = results.map(item => item.name);

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false
    };

    charts.temperature = new Chart(
        document.getElementById("temperatureChart"),
        {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Original Reference",
                        data: results.map(() => reference.temperature),
                        backgroundColor: "#d99a24"
                    },
                    {
                        label: "Commercial Sample",
                        data: results.map(item => item.temperature),
                        backgroundColor: "#05647a"
                    }
                ]
            },
            options: {
                ...commonOptions,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: "Temperature (°C)"
                        }
                    }
                }
            }
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
                        label: "Original Reference",
                        data: results.map(() => reference.density),
                        backgroundColor: "#d99a24"
                    },
                    {
                        label: "Commercial Sample",
                        data: results.map(item => item.density),
                        backgroundColor: "#05647a"
                    }
                ]
            },
            options: {
                ...commonOptions,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: "Density (g/mL)"
                        }
                    }
                }
            }
        }
    );

    charts.viscosity = new Chart(
        document.getElementById("flowChart"),
        {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Original Reference",
                        data: results.map(() => reference.viscosity),
                        backgroundColor: "#d99a24"
                    },
                    {
                        label: "Commercial Sample",
                        data: results.map(item => item.viscosity),
                        backgroundColor: "#05647a"
                    }
                ]
            },
            options: {
                ...commonOptions,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: "Viscosity (mPa·s)"
                        }
                    }
                }
            }
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
                        label: "Similarity Score",
                        data: results.map(item => item.similarity),
                        backgroundColor: "#05647a"
                    }
                ]
            },
            options: {
                ...commonOptions,
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

function resetAnalysis() {
    document.getElementById("refTemp").value = "";
    document.getElementById("refDensity").value = "";
    document.getElementById("refFlow").value = "";

    document.getElementById("samplesContainer").replaceChildren();
    sampleCount = 0;
    latestResults = null;

    document.getElementById("results").classList.add("hidden");
    document.getElementById("viewResultsBtn").classList.remove("visible");

    document.getElementById("homeSamples").textContent = "0";
    document.getElementById("homeBest").textContent = "—";
    document.getElementById("homeScore").textContent = "—";

    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};

    document.getElementById("resultsTable").replaceChildren();
    document.getElementById("parameterAnalysis").replaceChildren();

    addSample();
    addSample();
    addSample();

    scrollToAnalysis();
}

function saveAnalysis() {
    if (!latestResults) {
        alert("Please analyze the samples first.");
        return;
    }

    try {
        const key = "oilAnalysis";
        const saved = JSON.parse(localStorage.getItem(key) || "[]");
        const records = Array.isArray(saved) ? saved : [saved];

        records.push(latestResults);
        localStorage.setItem(key, JSON.stringify(records));

        alert("Analysis saved in this browser.");
    } catch (error) {
        alert("Unable to save the analysis. Your browser storage may be full or unavailable.");
    }
}

function csvEscape(value) {
    return `"${String(value).replace(/"/g, '""')}"`;
}

function exportCSV() {
    if (!latestResults) {
        alert("Please analyze the samples first.");
        return;
    }

    const rows = [
        ["Rank", "Sample", "Temperature (°C)", "Density (g/mL)",
         "Viscosity (mPa·s)", "Temperature Difference (%)",
         "Density Difference (%)", "Viscosity Difference (%)",
         "Similarity (%)", "Largest Deviation"],

        ...latestResults.results.map((item, index) => [
            index + 1,
            item.name,
            item.temperature,
            item.density,
            item.viscosity,
            item.temperatureDiff.toFixed(2),
            item.densityDiff.toFixed(2),
            item.viscosityDiff.toFixed(2),
            item.similarity.toFixed(2),
            item.largestDeviation
        ])
    ];

    const csv = "\uFEFF" + rows
        .map(row => row.map(csvEscape).join(","))
        .join("\r\n");

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "oil-analysis-results.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

function generateReport() {
    if (!latestResults) {
        alert("Please analyze the samples first.");
        return;
    }

    window.print();
}

document.addEventListener("DOMContentLoaded", () => {
    addSample();
    addSample();
    addSample();
});
