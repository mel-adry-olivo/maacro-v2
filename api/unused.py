# @app.route("/duplicates", methods=["POST"])
# def get_duplicates():
    
#     tableData = request.get_json()

#     df = pd.DataFrame(tableData)
#     duplicates = df[df.duplicated(keep=False)]
#     response = duplicates.to_json(orient="records")
#     return response


# @app.route('/dtypes', methods=['POST'])
# def get_dtypes():
#     data = request.get_json()
#     column_values = data['values']
#     type = pd.api.types.infer_dtype(column_values)
#     return jsonify({ 'type': type })
