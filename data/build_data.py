import csv
import json


def main():
    d, c = parse_case_data()
    write_to_file(d, "data.json")
    write_to_file(c, "counties.json")
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


def write_to_file(content, filename, format=False):
    print(f"Writing data to '{filename}'")

    with open(filename, 'w') as file:
        if format:
            json.dump(content, file, indent=4, sort_keys=True)
        else:
            json.dump(content, file, separators=(',', ':'), sort_keys=True)


if __name__ == "__main__":
    main()
