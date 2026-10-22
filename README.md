# Experimental Analysis of Physical Properties in Pure and Commercial Edible Oils

## 📌 Project Overview

This project is a web-based experimental analysis system developed to compare the physical properties of an Original Coconut Oil reference sample with selected commercial coconut oil samples.

The system uses experimentally measured **temperature, density, and flow time** to calculate viscosity and compare the physical properties of different oil samples. It calculates parameter-wise percentage differences, similarity scores, and sample rankings.

The application helps identify which commercial coconut oil sample has physical properties closest to the Original Coconut Oil reference based on the selected experimental parameters.

## 🎯 Objectives

- Measure the physical properties of coconut oil samples.
- Compare commercial coconut oil samples with an Original Coconut Oil reference.
- Calculate density from experimentally measured mass and volume.
- Determine viscosity using the experimental flow-time measurements and the selected viscometer method.
- Calculate percentage differences between the reference and commercial samples.
- Calculate similarity scores based on selected physical parameters.
- Rank commercial oil samples according to their similarity to the reference sample.
- Visualize experimental results using charts.
- Provide a simple, user-friendly web application for experimental data analysis.

## 🧪 Experimental Parameters

| Parameter | Unit | Description |
|---|---|---|
| Temperature | °C | Temperature at which the oil sample is measured |
| Density | g/mL | Mass per unit volume of the oil sample |
| Flow Time | seconds (s) | Time taken by the oil to flow through the viscometer |
| Viscosity | mPa·s | Calculated resistance of the oil to flow |

## ⚙️ Analysis Method

The system follows this workflow:

**Experimental Measurement → Data Entry → Data Processing → Viscosity Calculation → Percentage Difference → Similarity Score → Ranking → Visualization**

The physical properties of each commercial coconut oil sample are compared with the Original Coconut Oil reference sample.

### 1. Density Calculation

Density is calculated using the formula:

**Density = Mass of Oil / Volume of Oil**

Where:
- Mass of oil is measured in grams.
- Volume of oil is measured in millilitres.

### 2. Viscosity Calculation

Viscosity can be determined using an Ostwald viscometer, provided the required reference-fluid measurements and experimental conditions are available.

The relative viscosity formula is:

\[
\eta_s=\eta_w\frac{\rho_s t_s}{\rho_w t_w}
\]

Where:

- \(\eta_s\) = viscosity of the oil sample
- \(\eta_w\) = viscosity of the reference fluid
- \(\rho_s\) = density of the oil sample
- \(\rho_w\) = density of the reference fluid
- \(t_s\) = flow time of the oil sample
- \(t_w\) = flow time of the reference fluid

The measurements should be taken under suitable, controlled temperature conditions. The correct reference-fluid properties and viscometer procedure must be used.

### 3. Percentage Difference

The percentage difference between a commercial sample and the Original Oil reference is calculated as:

\[
D=\left|\frac{X_s-X_r}{X_r}\right|\times100
\]

Where:

- \(X_s\) = measured value for the commercial sample
- \(X_r\) = measured value for the reference sample
- \(D\) = percentage difference

A smaller percentage difference indicates that the measured value is closer to the reference value.

### 4. Similarity Score

The project uses an average deviation based on the selected physical parameters:

**Average Deviation = Sum of Parameter Percentage Differences / Number of Parameters**

The project-defined similarity score is:

**Similarity Score = max(0, 100 − Average Deviation)**

A higher score indicates greater similarity according to this calculation. The score is a comparative measure for this project and is not a certified measure of oil quality or authenticity.

## 📊 Example Experimental Data

The following values were collected during our experimental analysis.

| Sample | Temperature (°C) | Density (g/mL) | Flow Time (s) | Viscosity (mPa·s) |
|---|---:|---:|---:|---:|
| Original Coconut Oil | 29.9 | 0.867 | 325.12 | 0.922 |
| Oil A | 30.0 | 0.933 | 282.12 | 0.861 |
| Oil B | 29.5 | 0.867 | 280.37 | 0.795 |
| Oil C | 29.8 | 0.933 | 261.93 | 0.800 |

> **Note:** These are our experimentally collected values. Users can enter their own experimental measurements into the application. Viscosity values should be calculated or entered according to the application's implemented procedure.

## 💻 Software Features

- Original Oil reference data input
- Commercial oil sample data entry
- Temperature analysis
- Density analysis
- Flow-time analysis
- Viscosity calculation and comparison
- Parameter-wise percentage difference calculation
- Average deviation calculation
- Similarity score calculation
- Commercial sample ranking
- Results table
- Data visualization using charts
- Responsive web interface
- Support for analyzing user-entered experimental data

## 📖 How to Use

1. Collect experimental data for the Original Coconut Oil reference sample and the commercial coconut oil samples.
2. Measure the temperature, density, and flow time using the appropriate laboratory procedure.
3. Calculate viscosity using the selected viscometer method, or enter it if the application supports direct viscosity input.
4. Open the Oil Analysis System.
5. Enter the Original Coconut Oil reference values.
6. Enter the measured values for the commercial oil samples.
7. Click **Analyze**.
8. The system calculates the percentage differences and similarity scores according to its implemented calculation method.
9. The commercial samples are ranked based on their similarity to the reference.
10. Review the results table and charts to compare the samples.

### ⚠️ Important Notes

- Users should enter their own experimentally collected data.
- The application does not automatically collect laboratory measurements.
- Laboratory measurements must be obtained using suitable equipment and procedures.
- Viscosity calculations require the appropriate reference-fluid measurements and experimental conditions.
- The similarity score depends on the parameters and formula implemented in the application.
- The results indicate similarity in selected physical properties only; they do not independently prove purity, authenticity, safety, nutritional quality, or the absence of adulteration.

## 🛠️ Technologies Used

- **HTML5:** Structure of the web application
- **CSS3:** Styling and responsive user interface
- **JavaScript:** Data processing and analysis calculations
- **Chart.js:** Graphs and data visualization
- **Visual Studio Code:** Development environment
- **GitHub:** Source-code hosting and version control
- **GitHub Pages:** Website deployment and hosting

## 🔬 Project Scope

The current experimental implementation focuses on comparing selected physical properties of Original Coconut Oil and commercial coconut oil samples.

The parameters included are:

- Temperature
- Density
- Flow Time
- Viscosity

The application compares the entered measurements, calculates differences and similarity scores, ranks the commercial samples, and presents the results in tables and charts.

The analysis is limited to the physical parameters included in the application. Additional laboratory tests are required for broader assessments of oil quality and authenticity.

## ⚠️ Limitations

- The analysis depends on the accuracy of the experimental measurements entered by the user.
- Measurement errors and temperature variations may affect the results.
- The similarity score is a project-defined comparative metric.
- Similarity in physical properties does not necessarily establish that two oils have the same composition.
- The application does not independently verify oil purity, authenticity, safety, nutritional quality, or adulteration.
- The current implementation does not automatically collect laboratory data.

## 🚀 Future Scope

- Addition of chemical quality parameters
- Analysis of more commercial edible oil samples
- Collection and analysis of larger experimental datasets
- Improved statistical analysis
- Additional charts and comparison visualizations
- Database integration for storing experimental results
- Exporting analysis results into PDF or spreadsheet reports
- Improved validation of experimental inputs
- Comparison of measurements taken at controlled temperatures

## 🌐 Live Demo

[Open the Oil Analysis System](https://manoharns05.github.io/oil-analysis/)

## 👨‍💻 Project Technologies

**Frontend:** HTML, CSS, JavaScript  
**Data Visualization:** Chart.js  
**Development Environment:** Visual Studio Code  
**Version Control:** GitHub  
**Hosting:** GitHub Pages
