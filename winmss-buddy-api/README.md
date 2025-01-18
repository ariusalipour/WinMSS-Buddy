# WinMSS Buddy API

## Overview
The **WinMSS Buddy API** is designed to process and transform data from the WinMSS system into a custom JSON format for simplified analysis and use. It features endpoints for extracting data from `.cab` files, correcting competitor information across multiple matches and stages, and generating championship results.

---

## API Endpoints

### 1. **Root Endpoint**
#### **Description:**
Provides a quick summary of the API and its available endpoints.

#### **Endpoint:**
```http
GET /
```

#### **Response:**
- **Type:** JSON
- **Format:**
```json
{
  "name": "WinMSS Buddy API",
  "description": "API for managing and calculating championship results.",
  "version": "1.0.0",
  "endpoints": [
    {
      "method": "POST",
      "path": "/process/raw-data",
      "description": "Processes raw match data to generate structured JSON."
    },
    {
      "method": "POST",
      "path": "/process/merge-competitors-data",
      "description": "Handles competitor merges by updating all related data."
    },
    {
      "method": "POST",
      "path": "/process/create-championship-results",
      "description": "Generates championship results by aggregating scores across matches."
    }
  ]
}
```

---

### 2. **Raw Data Endpoint**
#### **Description:**
Converts a `.cab` file from WinMSS into a structured JSON dataset.

#### **Endpoint:**
```http
POST /process/raw-data
```

#### **Request:**
- **Body:** `.cab` file uploaded as binary.

#### **Response:**
- **Type:** JSON
- **Format:**
```json
[
  {
    "matchName": "Match Name",
    "stages": [
      {
        "stageName": "Stage Name",
        "competitorResults": [
          {
            "competitor": {
              "competitorId": "1",
              "competitorName": "Ross Dunstan"
            },
            "result": {
              "points": "75",
              "time": "12.34",
              "hits": {
                "alpha": 30,
                "charlie": 5,
                "delta": 0,
                "mike": 0,
                "noShoots": 0
              }
            }
          }
        ]
      }
    ]
  }
]
```

---

### 3. **Competitor Correction Endpoint**
#### **Description:**
Accepts JSON datasets and competitor pairings to correct mismatched competitor names across matches.

#### **Endpoint:**
```http
POST /process/merge-competitors-data
```

#### **Request:**
- **Body:**
```json
{
  "datasets": [
    {
      "matchName": "Match Name",
      "stages": [
        {
          "stageName": "Stage Name",
          "competitorResults": [
            {
              "competitor": {
                "competitorId": "1",
                "competitorName": "Ross Dunstan"
              },
              "result": {
                "points": "75",
                "time": "12.34",
                "hits": {
                  "alpha": 30,
                  "charlie": 5,
                  "delta": 0,
                  "mike": 0,
                  "noShoots": 0
                }
              }
            }
          ]
        }
      ]
    }
  ],
  "pairings": {
    "Ross Dunstan": ["R. Dunstan"]
  }
}
```

#### **Response:**
- **Type:** JSON
- **Format:**
```json
[
  {
    "matchName": "Match Name",
    "stages": [
      {
        "stageName": "Stage Name",
        "competitorResults": [
          {
            "competitor": {
              "competitorId": "1",
              "competitorName": "Ross Dunstan"
            },
            "result": {
              "points": "75",
              "time": "12.34",
              "hits": {
                "alpha": 30,
                "charlie": 5,
                "delta": 0,
                "mike": 0,
                "noShoots": 0
              }
            }
          }
        ]
      }
    ]
  }
]
```

---

### 4. **Championship Results Generation**
#### **Description:**
Generates consolidated championship results by combining and analyzing results across multiple matches and stages.

#### **Endpoint:**
```http
POST /process/create-championship-results
```

#### **Request:**
- **Body:**
```json
{
  "datasets": [
    {
      "matchName": "Match Name",
      "stages": [
        {
          "stageName": "Stage Name",
          "competitorResults": [
            {
              "competitor": {
                "competitorId": "1",
                "competitorName": "Ross Dunstan"
              },
              "result": {
                "points": "75",
                "time": "12.34",
                "hits": {
                  "alpha": 30,
                  "charlie": 5,
                  "delta": 0,
                  "mike": 0,
                  "noShoots": 0
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
```

#### **Response:**
- **Type:** JSON
- **Format:**
```json
[
  {
    "competitorName": "Ross Dunstan",
    "totalPoints": "300",
    "averageTime": "12.00",
    "matches": [
      {
        "matchName": "Match 1",
        "points": "100",
        "time": "12.10"
      },
      {
        "matchName": "Match 2",
        "points": "100",
        "time": "11.90"
      },
      {
        "matchName": "Match 3",
        "points": "100",
        "time": "12.00"
      }
    ]
  }
]
```

---

## Features
- **Extract Data:** Convert `.cab` files from WinMSS into a user-friendly JSON format.
- **Correct Competitor Names:** Standardize competitor names across matches using pairings.
- **Generate Championship Results:** Consolidate results across matches to produce championship leaderboards.

---

## Setup and Deployment
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/winmss-buddy-api.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. API available at `http://localhost:3000`

---

## Example Usage

### Root Endpoint:
```bash
curl -X GET http://localhost:3000/
```

### Raw Data Endpoint:
```bash
curl -X POST -F "file=@path/to/file.cab" http://localhost:3000/process/raw-data
```

### Competitor Correction Endpoint:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"datasets": [...], "pairings": {...}}' http://localhost:3000/process/merge-competitors-data
```

### Championship Results Generation:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"datasets": [...]} http://localhost:3000/process/create-championship-results
```

---

## License
MIT

---

## Contribution
Feel free to contribute by submitting issues or pull requests to enhance the functionality of the **WinMSS Buddy API**.
