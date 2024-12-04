# @app.route("/duplicates", methods=["POST"])
# def get_duplicates():
    
#     tableData = request.get_json()

#     df = pd.DataFrame(tableData)
#     duplicates = df[df.duplicated(keep=False)]
#     response = duplicates.to_json(orient="records")
#     return response