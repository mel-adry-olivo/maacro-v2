from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import re
import os
from io import StringIO

app = Flask(__name__)
app.json.sort_keys = False
CORS(app)


UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
    if(options[0] == 'all-columns'):
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

    if(missing_options['method'] != ''):
        df = handleMissingData(df, missing_options)

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


@app.route('/upload', methods=['POST'])
def upload_file():

    file = request.files['file']

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    table_data = request.form.get('tableData')
    table_df = pd.DataFrame.from_records(eval(table_data))

    if file.filename.endswith('.csv'):
        df = pd.read_csv(file_path)
    elif file.filename.endswith('.xlsx'):
        df = pd.read_excel(file_path, engine='openpyxl')

    matching_columns = list(set(df.columns).intersection(set(table_df.columns)))

    data_json = df.to_dict(orient='records')
    return jsonify({ 'data': data_json , 'filename': file.filename, 'matchingColumns': matching_columns }), 200

@app.route('/merge', methods=['POST'])
def merge_data():
    
    file = request.files['file']
    table_data = request.form.get('tableData')
    json_data = StringIO(table_data)
    table_df = pd.read_json(json_data)

    if file.filename.endswith('.csv'):
        file_df = pd.read_csv(file)
    elif file.filename.endswith('.xlsx'):
        file_df = pd.read_excel(file)

    merge_column = request.form.get('column')
    if merge_column not in file_df.columns or merge_column not in table_df.columns:
        return jsonify({'message': f'Column {merge_column} not found in both datasets'}), 400

    merge_method = request.form.get('mergeMethod')

    if merge_method == 'inner':
        merged_df = pd.merge(table_df, file_df, on=merge_column, how='inner')
    elif merge_method == 'outer':
        merged_df = pd.merge(table_df, file_df, on=merge_column, how='outer')
    elif merge_method == 'left':
        merged_df = pd.merge(table_df, file_df, on=merge_column, how='left')
    elif merge_method == 'right':
        merged_df = pd.merge(table_df, file_df, on=merge_column, how='right')
    else:
        return jsonify({'message': f'Invalid merge method: {merge_method}'}), 400

    merged_data_json = merged_df.to_json(orient='records')


    return jsonify({
        'message': 'Merge operation successful',
        'mergedData': merged_data_json
    }), 200


@app.route('/join', methods=['POST'])
def join_data():
    file = request.files.get('file')
    table_data = request.form.get('tableData')
    json_data = StringIO(table_data)
    table_df = pd.read_json(json_data)

    if not file or not table_data:
        return jsonify({'message': 'Missing file or table data'}), 400

    if file.filename.endswith('.csv'):
        file_df = pd.read_csv(file)
    elif file.filename.endswith('.xlsx'):
        file_df = pd.read_excel(file)
    else:
        return jsonify({'message': 'Unsupported file format'}), 400

    axis = request.form.get('selectedAxis')
    
    if axis not in ['vertically', 'horizontally']:
        return jsonify({'message': 'Invalid axis specified'}), 400

    

    if axis == 'vertically':
        joined_df = pd.concat([table_df, file_df], axis=0)
    elif axis == 'horizontally':
        joined_df = handle_overlapping_columns(table_df, file_df, axis=1)

    joined_data_json = joined_df.to_json(orient='records')

    return jsonify({
        'joinedData': joined_data_json
    })

def handle_overlapping_columns(df1, df2, axis):
    if axis == 1:
        overlapping_cols = set(df1.columns) & set(df2.columns)
        if overlapping_cols:
            df2 = df2.rename(columns={col: f"{col}_2" for col in overlapping_cols})
    return pd.concat([df1, df2], axis=axis)



if __name__ == "__main__":
    app.run(debug=True)