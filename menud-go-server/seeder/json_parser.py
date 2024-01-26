import json

# Read the JSON data from the file
with open('data_old.json', 'r') as file:
    data = json.load(file)

# Function to convert int prices to strings
def convert_prices_to_strings(menu_data):
    for category in menu_data['categories']:
        for item in category['items']:
            item['price'] = str(item['price'])

# Convert prices to strings
convert_prices_to_strings(data)

# Write the modified JSON to a new file
with open('data.json', 'w') as file:
    json.dump(data, file, indent=2)

print("Conversion complete. Check 'menu_with_strings.json'.")

