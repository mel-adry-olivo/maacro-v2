from flask import Flask, request, jsonify, Response, after_this_request
from flask_cors import CORS
import pandas as pd
import os
from io import StringIO
import json
import seaborn as sns
import base64
import io
from io import BytesIO
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')


app = Flask(__name__)
app.json.sort_keys = False
CORS(app)


UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/deduplicate", methods=["POST"])
def deduplicate():

    data = request.form
    tableJson = data.get('tableData')
    tableDf = pd.read_json(tableJson).convert_dtypes()
    optionsDictionary = json.loads(data.get('options'))
    print(optionsDictionary)

    subset = None if optionsDictionary[0] == 'all-columns' else optionsDictionary[0]
    keep = optionsDictionary[1] if len(optionsDictionary) > 1 else 'first'
    deduplicated_df = tableDf.drop_duplicates(subset=subset, keep=keep)

    rows_removed = len(tableDf) - len(deduplicated_df)
    deduplicated_data = deduplicated_df.to_dict(orient="records")

    response = jsonify({
        "deduplicatedData": deduplicated_data,
        "rowsRemoved": rows_removed
    })

    return response


@app.route('/cleanse', methods=['POST'])
def cleanse():

    data = request.form
    table = data.get('tableData')
    df = pd.read_json(table).replace('', pd.NA).convert_dtypes()

    for column in df.columns:
        if not df[column].dtype.name in ['object', 'string'] or df[column].str.isnumeric().all():
            df[column] = pd.to_numeric(df[column], errors='coerce')

    optionsDict = json.loads(data.get('options'))
    missing_options = optionsDict['missingOptions']
    tools_options = optionsDict['toolsOptions']
    original_rows = len(df)

    if(missing_options['method'] != ''):
        df = handleMissingData(df, missing_options)

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
        'default-value': lambda df, column, value: df.fillna({column: value}),
        'impute': {
            'mean': lambda df: df.fillna(df.mean()),
            'median': lambda df: df.fillna(df.median()),
            'mode': lambda df: df.fillna(df.mode().iloc[0])
        }
    }
    
    if options['method'] == 'impute':
        column = options['column']
        df[column] = df[column].astype('float64')
        return methods['impute'][options['methodValue']](df)
    elif options['method'] == 'default-value':
        column = options['column']
        value = options['methodValue']  
        return methods['default-value'](df, column, value)
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
    table_data = data.get('tableData', [])
    column = data.get('column')
    target_type = data.get('type')

    if not table_data or column is None or target_type is None:
        return jsonify({"error": "Invalid input data"}), 400

    df = pd.DataFrame(table_data)

    if column not in df.columns:
        return jsonify({"error": f"Column '{column}' not found in table data"}), 400

    try:
        if target_type == "int":
            df[column] = pd.to_numeric(df[column], errors='coerce').fillna(0).astype(int)
        elif target_type == "float":
            df[column] = pd.to_numeric(df[column], errors='coerce').astype(float)
        elif target_type == "str":
            df[column] = df[column].astype(str)
        elif target_type == "date":
            df[column] = pd.to_datetime(df[column], errors='coerce')
        else:
            return jsonify({"error": f"Unsupported type '{target_type}'"}), 400
        
        df[column] = df[column].apply(lambda col: None if pd.isna(col) else col)

    except Exception as e:
        return jsonify({"error": f"Failed to convert column '{column}' to type '{target_type}': {str(e)}"}), 500

    reformatted_data = df.to_dict(orient='records')

    return jsonify({
        'reformattedData': reformatted_data,
        'columnAffected': column,
        'newType': target_type
    })


@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files.get('file')
    if not file or file.filename == '':
        return jsonify({'message': 'No selected file'}), 400


    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)  # Ensure the upload folder exists
    file.save(file_path)

    @after_this_request
    def remove_file(response):
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            app.logger.error(f"Error deleting file: {file_path}, Error: {str(e)}")
        return response

    table_data = request.form.get('tableData')
    table_df = None
    
    if table_data:
        try:
            table_df = pd.DataFrame.from_records(eval(table_data))  
        except Exception as e:
            return jsonify({'message': 'Invalid tableData format', 'error': str(e)}), 400

    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file_path)
        elif file.filename.endswith('.xlsx'):
            df = pd.read_excel(file_path, engine='openpyxl')
        else:
            return jsonify({'message': 'Unsupported file type'}), 400
    except Exception as e:
        return jsonify({'message': 'Error reading file', 'error': str(e)}), 500

    df.fillna('', inplace=True)

    matching_columns = []
    if table_df is not None:
        matching_columns = list(set(df.columns).intersection(set(table_df.columns)))

    total_rows = len(df)

    data_json = df.to_dict(orient='records')

    return jsonify({
        'data': data_json,
        'filename': file.filename,
        'matchingColumns': matching_columns,
        'totalRows': total_rows
    }), 200

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
        joined_df = pd.concat([table_df, file_df], axis=0, ignore_index=True)
    elif axis == 'horizontally':
        joined_df = handle_overlapping_columns(table_df, file_df, axis=1)

    id_columns = [col for col in joined_df.columns if 'id' in col.lower()]

    if id_columns:
        joined_df = joined_df.sort_values(by=id_columns[0], ascending=True)


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

@app.route('/explore', methods=['POST'])
def explore_data():

    data = request.form
    table = data.get('tableData')
    json_data = StringIO(table)
    table_df = pd.read_json(json_data)

    
    table_df = table_df.convert_dtypes()
    options = data.get('options')
    optionsDict = json.loads(options)

    table_df = table_df.replace('', pd.NA) 
    # for col in table_df.columns:
    #     table_df[col] = pd.to_numeric(table_df[col], errors='coerce')


    variables = optionsDict['variables']
    splits = optionsDict['splits']
    statistics = optionsDict['statistics']

    if not statistics:
        return jsonify({'error': 'No statistic selected. Please specify a statistic.'}), 400

    try:
        invalid_splits = [
            col for col in splits
            if pd.api.types.is_numeric_dtype(table_df[col])
        ]
        if invalid_splits:
            return jsonify({
                'error': f"Cannot use continuous data as splits: {invalid_splits}"
            }), 400

        agg_dict = {}
        
        for var in variables:
            stats_list = []
            for stat in statistics:
                if stat == 'mode':
                    stats_list.append(('mode', lambda x: x.mode().iloc[0]))
                else:
                    stats_list.append((stat, stat))
            agg_dict[var] = stats_list
        
        if splits:
            result = table_df.groupby(splits).agg(agg_dict).reset_index()
            result.columns = [' '.join(map(str, col)) if isinstance(col, tuple) else col for col in result.columns.values]
        else:
            result = table_df[variables].agg({var: [stat if stat != 'mode' else ('mode', lambda x: x.mode().iloc[0]) for stat in statistics] for var in variables}).T
            result.columns = [' '.join(map(str, col)) if isinstance(col, tuple) else col for col in result.columns.values]

        output = result.to_json(orient='records')
        return jsonify({'aggregatedData': json.loads(output)})
    
    except Exception as e:  
        return jsonify({'error': str(e)}), 400

    
    except Exception as e:  
        return jsonify({'error': str(e)}), 400


@app.route('/visualize', methods=['POST'])
def visualize_data():
    data = request.form
    table_data = data.get('tableData')
    json_data = StringIO(table_data)

    options = data.get('options')
    optionsDict = json.loads(options)

    variables = optionsDict['variables']
    splits = optionsDict['splits']
    plots = optionsDict['plots']
    
    if not table_data or not variables or not plots:
        return jsonify({'error': 'Missing required data, variables, or plots'}), 400

    df = pd.read_json(json_data)
    df = df.convert_dtypes()

    # df = df.apply(pd.to_numeric, errors='coerce')
    
    try:
        plot_images = {}
        for plot_type in plots:
            for variable in variables:
                if variable not in df.columns:
                    return jsonify({'error': f'Column {variable} not found in table data'}), 400
                if any(split not in df.columns for split in splits):
                    return jsonify({'error': f"Column(s) {splits} not found in table data"}), 400

                plt.figure(figsize=(10, 6))

                if plot_type == 'bar':
                    if not splits:
                        plot_data = df[variable].value_counts()
                        sns.barplot(x=plot_data.index, y=plot_data.values)
                    else:
                        sns.barplot(data=df, x=splits[0], y=variable)
                elif plot_type == 'box':
                    sns.boxplot(data=df, x=splits[0] if splits else variable, y=variable if splits else None)
                elif plot_type == 'violin':
                    sns.violinplot(data=df, x=splits[0] if splits else variable, y=variable if splits else None, split=True)
                elif plot_type == 'scatter':
                    if len(variables) < 2:
                        return jsonify({'error': 'Scatter plots require at least two variables'}), 400
                    sns.scatterplot(data=df, x=variables[0], y=variables[1], hue=splits[0] if splits else None)
                elif plot_type == 'density':
                    sns.kdeplot(data=df, x=variable, hue=splits[0] if splits else None, fill=True)
                elif plot_type == 'histogram':
                    sns.histplot(data=df, x=variable, hue=splits[0] if splits else None, kde=False)
                else:
                    return jsonify({'error': f'Invalid plot type: {plot_type}'}), 400

                plt.title(f"{plot_type.capitalize()} Plot for {variable}")
                plt.tight_layout()

                img = io.BytesIO()
                plt.savefig(img, format='png')
                img.seek(0)
                plt.close()

                img_base64 = base64.b64encode(img.read()).decode('utf-8')
                plot_images[f"{plot_type}_{variable}"] = img_base64

        return jsonify({
            'message': 'Visualization operation successful',
            'plots': plot_images
        })

    except Exception as e:
        return jsonify({'error': f"Visualization failed: {str(e)}"}), 500

@app.route('/derive', methods=['POST'])
def derive_data():
    data = request.form
    table_data = data.get('tableData')
    json_data = StringIO(table_data)

    df = pd.read_json(json_data)
    df = df.convert_dtypes()

    options = data.get('options')
    optionsDict = json.loads(options)

    operation = optionsDict['operation']
    column1 = optionsDict['column1']
    column2 = optionsDict['column2']
    columnName = optionsDict['columnName']

    if not table_data or not column1 or not column2 or not columnName:
        return jsonify({'error': 'Missing required data'}), 400

    try:
        if operation == 'add':
            df[columnName] = df[column1] + df[column2]
        elif operation == 'subtract':
            df[columnName] = df[column1] - df[column2]
        elif operation == 'multiply':
            df[columnName] = df[column1] * df[column2]
        elif operation == 'divide':
            df[columnName] = df[column1] / df[column2]
        elif operation == 'concatenate':
            df[columnName] = df[column1].astype(str) + df[column2].astype(str)
        else:
            return jsonify({'error': 'Invalid operation'}), 400

        output = df.to_json(orient='records')
        return jsonify({'derivedData': json.loads(output)})
    except Exception as e:
        return jsonify({'error': f"Derivation failed: {str(e)}"}), 500

@app.route('/download', methods=['POST'])
def download_file():
    data = request.form
    table_data = data.get('tableData')
    json_data = StringIO(table_data)

    df = pd.read_json(json_data)
    df = df.convert_dtypes()
    
    filetype = data.get('filetype', 'csv').lower()  
    filetype = filetype.replace('"', '')

    if filetype == 'csv':
        csv_data = df.to_csv(index=False)
        response = Response(
            csv_data,
            mimetype='text/csv',
            headers={
                'Content-Disposition': 'attachment;filename=data.csv'
            }
        )
        return response
    
    elif filetype == 'xlsx':
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Sheet1')
        
        output.seek(0)
        
        response = Response(
            output.getvalue(),
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers={
                'Content-Disposition': 'attachment;filename=data.xlsx'
            }
        )
        return response
    
    elif filetype == 'json':
        json_data = df.to_json(orient='records')
        response = Response(
            json_data,
            mimetype='application/json',
            headers={
                'Content-Disposition': 'attachment;filename=data.json'
            }
        )
        return response

    else:
        return Response(
            "Unsupported file type. Use 'csv', 'xlsx', or 'json'.",
            status=400
        )


if __name__ == "__main__":
    app.run(debug=True)