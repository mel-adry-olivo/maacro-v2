from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import re

app = Flask(__name__)
app.json.sort_keys = False
CORS(app)

@app.route("/")
def index():
    return jsonify({"message": "Hello, World!"})

@app.route("/duplicates", methods=["POST"])
def get_duplicates():
    tableData = request.get_json()

    df = pd.DataFrame(tableData)
    duplicates = df[df.duplicated(keep=False)]
    response = duplicates.to_json(orient="records")
    return response


@app.route("/deduplicate", methods=["POST"])
def deduplicate():
    data = request.get_json()
    table_data = data.get("tableData", [])

    df = pd.DataFrame(table_data)

    options = data.get("options", [])
    if(options[0] == 'all'):
        options[0] = None
    
    if options:
        deduplicated_df = df.drop_duplicates(subset=options[0], keep=options[1])
    else:
        deduplicated_df = df.drop_duplicates()  
    
    
    rows_removed = len(df) - len(deduplicated_df)
    deduplicated_data = deduplicated_df.to_dict(orient="records")


    response = jsonify({
        "deduplicatedData": deduplicated_data,
        "rowsRemoved": rows_removed
    })

    return response


@app.route('/cleanse', methods=['POST'])
def cleanse():
    data = request.get_json()
    table_data = data['tableData']
    options = data['options']

    df = pd.DataFrame(table_data)

    missing_options = options['missingOptions']
    original_rows = len(df)
    df = handleMissingData(df, missing_options)

    print(df)

    tools_options = options['toolsOptions']
    if 'formatDate' in tools_options:
        column = tools_options['formatDate']['column']
        try:
            df[column] = pd.to_datetime(df[column], errors='coerce')
            df[column] = df[column].apply(lambda x: x.strftime('%m/%d/%Y') if pd.notnull(x) else '')
           
        except Exception as e:
            return jsonify({'error': f'Date formatting failed: {str(e)}'}), 500

    if 'standardizeColumns' in tools_options and tools_options['standardizeColumns']:
        try:
           df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')
        except Exception as e:
            return jsonify({'error': f'Column standardization failed: {str(e)}'}), 500


    if 'dropOutliers' in tools_options:
        column = tools_options['dropOutliers']['column']
        method = tools_options['dropOutliers']['method']
        if column not in df.columns:
            return jsonify({'error': f'Column "{column}" not found'}), 400
        try:
            if method == 'iqr':
                Q1 = df[column].quantile(0.25)
                Q3 = df[column].quantile(0.75)
                IQR = Q3 - Q1
                df = df[~((df[column] < (Q1 - 1.5 * IQR)) | (df[column] > (Q3 + 1.5 * IQR)))]
            elif method == 'zscore':
                mean = df[column].mean()
                std = df[column].std()
                df = df[~((df[column] - mean).abs() > 3 * std)]
            else:
                return jsonify({'error': 'Invalid outlier detection method'}), 400
        except Exception as e:
            return jsonify({'error': f'Outlier detection failed: {str(e)}'}), 500

    cleaned_data = df.to_dict(orient='records')
    rows_affected = original_rows - len(df)
    return jsonify({
        'cleanedData': cleaned_data,
        'rowsAffected': rows_affected
    })

def handleMissingData(df, options):
    df = df.replace('', pd.NA)  
    methods = {
        'drop-rows': lambda df: df.dropna(),
        'default-value': lambda df: df.fillna(options['methodValue']),
        'impute': {
            'mean': lambda df: df.fillna(df.mean()),
            'median': lambda df: df.fillna(df.median()),
            'mode': lambda df: df.fillna(df.mode().iloc[0])
        }
    }
    if options['method'] == 'impute':
        return methods['impute'][options['methodValue']](df)
    else:
        return methods[options['method']](df)


@app.route('/dtypes', methods=['POST'])
def get_dtypes():
    data = request.get_json()
    column_name = data['name']
    column_values = data['values']

    type = pd.api.types.infer_dtype(column_values)

    return jsonify({ 'type': type })

@app.route('/reformat', methods=['POST'])
def reformat():
    data = request.get_json()
    table_data = data['tableData']
    column = data['column']
    type = data['type']

    df = pd.DataFrame(table_data)
    df[column] = df[column].astype(type)

    reformatted_data = df.to_dict(orient='records')

    return jsonify({ 'reformattedData': reformatted_data , 'columnAffected': column , 'newType': type })


if __name__ == "__main__":
    app.run(debug=True)