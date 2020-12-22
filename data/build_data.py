import csv
import json
import sys


def main():
    format = True if "--format" in sys.argv else False

    d, c = parse_case_data()
    pad_data_set(d, c)
    aggregate_daily_data(d, c)
    assemble_nationwide_data(d, c)

    write_to_file(d, "data.json", format)
    write_to_file(c, "counties.json", format)
    print("DONE")


def parse_case_data():
    print("Parsing case data file")

    data = {}
    counties = {}

    with open("RKI_COVID19.csv", newline='') as csv_file:
        reader = csv.reader(csv_file)
        first_row = True

        for row in reader:
            if first_row:
                first_row = False
                index_date = row.index("Meldedatum")
                index_county_id = row.index("IdLandkreis")
                index_county_name = row.index("Landkreis")
                index_new_cases = row.index("AnzahlFall")
                index_new_deaths = row.index("AnzahlTodesfall")

            else:
                date = row[index_date].split()[0]
                county_id = row[index_county_id]

                if date not in data:
                    data[date] = {}

                if county_id not in data[date]:
                    data[date][county_id] = create_empty_element()

                if county_id not in counties:
                    counties[county_id] = {
                        "name": row[index_county_name],
                        "population": None,
                        "density": None
                    }

                elem = data[date][county_id]
                elem["newCases"] += int(row[index_new_cases])
                elem["newDeaths"] += int(row[index_new_deaths])

        return data, counties


def create_empty_element():
    return {
        "newCases": 0,
        "newDeaths": 0,
        "freeBeds": None,
        "occupiedBeds": None,
        "reserveBeds": None,
        "totalCases": None,
        "totalDeaths": None,
        "caseIncidence": None,
        "deathIncidence": None
    }


def pad_data_set(data, counties):
    print("Padding data set with empty data points")

    for date in data:
        for c in counties:
            if c not in data[date]:
                data[date][c] = create_empty_element()


def aggregate_daily_data(data, counties):
    print("Aggregating total infection cases and deaths")

    sorted_dates = sorted(list(data))

    for c in counties:
        total_cases = 0
        total_deaths = 0

        for date in sorted_dates:
            elem = data[date][c]

            if elem["newCases"]:
                total_cases += elem["newCases"]
            elem["totalCases"] = total_cases

            if elem["newDeaths"]:
                total_deaths += elem["newDeaths"]
            elem["totalDeaths"] = total_deaths


def assemble_nationwide_data(data, counties):
    print("Assembling nationwide data")

    for date in data:
        data[date]["all"] = create_empty_element()
        data[date]["all"]["totalCases"] = 0
        data[date]["all"]["totalDeaths"] = 0

        for c in counties:
            data[date]["all"]["newCases"] += data[date][c]["newCases"]
            data[date]["all"]["newDeaths"] += data[date][c]["newDeaths"]
            data[date]["all"]["totalCases"] += data[date][c]["totalCases"]
            data[date]["all"]["totalDeaths"] += data[date][c]["totalDeaths"]


def write_to_file(content, filename, format=False):
    print(f"Writing data to '{filename}'")

    with open(filename, 'w') as file:
        if format:
            json.dump(content, file, indent=4, sort_keys=True)
        else:
            json.dump(content, file, separators=(',', ':'), sort_keys=True)


if __name__ == "__main__":
    main()
