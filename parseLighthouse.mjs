import { readdirSync, readFileSync } from "fs";

const metrics = [
  { name: "firstContentfulPaint" },
  { name: "largestContentfulPaint" },
  { name: "interactive" },
  { name: "speedIndex" },
  { name: "totalBlockingTime" },
  { name: "maxPotentialFID" },
  { name: "cumulativeLayoutShift" },
  { name: "cumulativeLayoutShiftMainFrame" },
  { name: "timeToFirstByte" },
];

const reportFolder = "./reports";

function calculateResults() {
  const testFolders = readdirSync(reportFolder);

  const rawData = {};

  testFolders.forEach((folder) => {
    const files = readdirSync(`${reportFolder}/${folder}`);
    rawData[folder] = [];

    const reports = files.filter((file) => file.includes(".json"));
    reports.forEach((report) => {
      const data = readFileSync(`${reportFolder}/${folder}/${report}`);
      const jsonData = JSON.parse(data);
      rawData[folder].push(jsonData);
    });
  });

  const results = {};
  Object.keys(rawData).forEach((key) => {
    results[key] = {};
    metrics.forEach((metric) => {
      const accValues = [];

      rawData[key].forEach((item) => {
        accValues.push(
          item["audits"]["metrics"]["details"]["items"][0][metric.name]
        );
      });

      const average =
        accValues.reduce((sum, value) => sum + value, 0) / accValues.length;
      results[key][metric.name] = average;
    });
  });
  return results;
}

function diff(result, to = "master") {
  const diff = {};
  Object.keys(result).forEach((key) => {
    diff[key] = {};
    metrics.forEach((metric) => {
      diff[key][metric.name] =
        result[key][metric.name] - result[to][metric.name];
    });
  });
  return diff;
}

function displayResults(results, comparison, skip = ["master"]) {
  Object.keys(results)
    .filter((key) => !skip.includes(key))
    .forEach((key) => {
      console.log(`\n${key}`);
      Object.keys(results[key]).forEach((metric) => {
        const metricValue = results[key][metric];
        console.log(`${metric}: ${metricValue}`);
        const diff = comparison[key][metric];
        const percent = ((diff / metricValue) * 100).toFixed(2);
        if (diff < 0) {
          console.log(`diff: \x1b[32m${diff}\x1b[0m (${percent}%)`); // Green
        } else if (diff > 0) {
          console.log(`diff: \x1b[31m${diff}\x1b[0m (${percent}%)`); // Red
        } else {
          console.log(`diff: \x1b[37m${diff}\x1b[0m (${percent}%)`); // White
        }
      });
    });
}

const results = calculateResults();
const comparison = diff(results);

displayResults(results, comparison);
