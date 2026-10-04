# Experimental Analysis of Physical Properties in Pure and Commercial Edible Oils

## 📌 Project Overview

This project is a web-based experimental analysis system developed to compare the physical properties of an Original Coconut Oil with selected commercial coconut oil samples.

The system uses experimentally measured **temperature, density, and flow time** to calculate parameter-wise differences, similarity scores, and sample rankings.

## 🎯 Objectives

- Measure the physical properties of coconut oil samples.
- Compare commercial samples with an Original Coconut Oil reference.
- Calculate percentage differences between samples.
- Calculate similarity scores.
- Rank commercial oil samples based on their similarity to the reference oil.
- Visualize experimental results using charts.
- Provide a simple web-based analysis system for experimental data.

## 🧪 Experimental Parameters

| Parameter | Unit |
|---|---|
| Temperature | °C |
| Density | g/mL |
| Flow Time | seconds |

## ⚙️ Analysis Method

The system follows this workflow:

**Experimental Measurement → Data Entry → Data Processing → Percentage Difference → Similarity Score → Ranking → Visualization**

The commercial samples are compared with the Original Coconut Oil reference using the selected physical parameters.

## 📊 Example Experimental Data

The following values were collected during our experimental analysis:

| Sample | Temperature (°C) | Density (g/mL) | Flow Time (s) |
|---|---:|---:|---:|
| Original Coconut Oil | 29.9 | 0.867 | 325.12 |
| Oil A | 30.0 | 0.933 | 282.12 |
| Oil B | 29.5 | 0.867 | 280.37 |
| Oil C | 29.8 | 0.933 | 261.93 |

> **Note:** These are our experimentally collected values. Users can enter their own experimentally collected data into the application for analysis.

## 💻 Software Features

- Original oil reference input
- Commercial sample data entry
- Temperature analysis
- Density analysis
- Flow-time analysis
- Percentage difference calculation
- Similarity score calculation
- Sample ranking
- Data visualization
- Results table
- Responsive web interface

## 📖 How to Use

1. Collect experimental data for the Original Oil and commercial oil samples.
2. Enter **your collected experimental data** into the application:
   - Temperature (°C)
   - Density (g/mL)
   - Flow Time (s)
3. Click **Analyze**.
4. The system calculates percentage differences and similarity scores.
5. The commercial samples are ranked based on their similarity to the Original Oil.
6. View the results through tables and charts.

### ⚠️ Important

Users should enter their **own experimentally collected data**.

The application does not automatically collect laboratory measurements. Experimental measurements must be obtained using the required laboratory procedure and then entered into the system.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Chart.js
- Visual Studio Code
- GitHub Pages

## 🔬 Project Scope

The current experimental implementation focuses on selected physical properties:

- Temperature
- Density
- Flow Time

The system identifies the commercial sample whose measured physical properties are closest to the Original Coconut Oil based on the selected parameters.

## ⚠️ Limitations

The similarity score is based only on the selected experimental physical parameters.

It does not independently prove:

- Oil purity
- Authenticity
- Safety
- Nutritional quality
- Absence of adulteration

## 🚀 Future Scope

- Addition of chemical quality parameters
- Analysis of more commercial samples
- Larger experimental datasets
- Advanced statistical analysis
- Improved data visualization
- Database integration

## 🌐 Live Demo

[Open the Oil Analysis System](https://manoharns05.github.io/oil-analysis/)

## 👨‍💻 Technologies

**Frontend:** HTML, CSS, JavaScript  
**Data Visualization:** Chart.js  
**Development:** Visual Studio Code  
**Hosting:** GitHub Pages
