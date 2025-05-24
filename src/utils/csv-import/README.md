# CSV Import Utility

## Purpose

The CSV Import utility is designed to parse CSV (Comma-Separated Values) files exported from the NetZeroCities economic modelling Excel files containing measure data for a city's carbon reduction efforts. It maps the imported data to predefined measures using UUIDs from Kausal's database.

- Parses CSV files containing measure data
- Maps CSV rows to predefined measures using UUIDs
- Handles multiple measures with the same name by considering parent sections and previous rows
- Provides error handling for unmatched measures and general parsing issues

1. `csv-import.tsx`: Contains the main parsing logic (`parseMeasuresCsv` function)
2. `legacy-measure-map.json`: Defines the mapping between measure names, parent sections, and UUIDs. The names and section names must match the Excel sheet exactly.
3. `csv-import.test.ts`: Contains unit tests for the CSV import functionality
4. `data-request.csv.ts`: Contains a sample CSV data for testing and development
5. `data-request-parsed-result.ts`: Contains the expected output for the sample CSV data

## Data Structure

The parsed measures are returned as a `Map` where:

- The key is the UUID of the measure
- The value is an object containing:
  - `label`: The name of the measure
  - `value`: The numerical value of the measure
  - `comment`: Any comment associated with the measure

## Sample Data

The `data-request.csv.ts` file contains a sample CSV dataset that can be used for testing and development purposes. The `data-request-parsed-result.ts` file contains the expected output for this sample data, which is used in the unit tests to verify the correct functioning of the parser.
