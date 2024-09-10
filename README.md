# Lighthouse Report Parser


Compares a `A` and `B` set of lighthouse reports

## Setup

Clone repo

In `./reports` folder create a folder for the variants you wish to compare default expected is `master` but other folder can be ticket number or any other identifier:
```txt
├── reports
│   ├── master
│   └── ticket-being-tested
```

Run Lighthouse reports in incognito mode and export these as `json` and save them in respective folders for variant and master

In terminal run
```sh
node parseLighthouse.mjs
```
to generate comparison similar to:
```
YEL-173
firstContentfulPaint: 4717.666666666667
diff: 24.66666666666697 (0.52%)
largestContentfulPaint: 8455
diff: -576 (-6.81%)
interactive: 8465
diff: -585.3333333333339 (-6.91%)
speedIndex: 4717.666666666667
diff: 24.66666666666697 (0.52%)
totalBlockingTime: 464
diff: 19.333333333333314 (4.17%)
maxPotentialFID: 526.3333333333334
diff: 17.000000000000057 (3.23%)
cumulativeLayoutShift: 0.12485339856184745
diff: 0.00013194751139754268 (0.11%)
cumulativeLayoutShiftMainFrame: 0.12485339856184745
diff: 0.00013194751139754268 (0.11%)
timeToFirstByte: 930
diff: 303.33333333333337 (32.62%)
```

