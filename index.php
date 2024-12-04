<?php
                                                                                                                                                                                                                                                                                                                                                                                           

require './components/components.php';  

// $csv = json_decode(file_get_contents('./test2.json'), true);
$csv = [];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data App</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="utils.css">
    <script src="./js/state.js" type="module" defer></script>
    <script src="./script.js" type="module" defer></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script lang="javascript" src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>
</head>
<body>
    <div class="wrapper">
        <h1 class="title"><span>m</span>aacro.</h1>
        <h6 class="subtitle">Holy Sheet</h6>
        <div class="toolbar">
            <div class="toolbar-left">
                <?php       
                renderFormButton("Deduplicate", "copy");
                renderFormButton("Cleanse", "eraser");
                renderFormButton("Merge", "merge");
                renderFormButton("Join", "between-vertical-end");
                renderFormButton("Derive", "plus");
                renderFormButton("Statistics", "hash");      
                renderFormButton("Visualize", "eye");
                ?>
            </div>
            <div class="toolbar-right">
                <?php
                renderFormButton("Upload", "upload");
                renderFormButton("Download", "download");
                ?>
            </div>
        </div>
        <?php renderTable($csv); ?>
        <span class="total-rows"></span>
    </div>
    
    <div class="page-overlay">
        <div class="preview-container">
            <h3>Preview</h3>
            <div class="table-container"></div>
            <div class="plot-container"></div>
            <div class="text-wrapper">
                <span class="total-rows"></span>
                <span class="affected-rows"></span>
            </div>
            <div class="button-group">
                <?php renderButton("Done", "check"); ?>
            </div>
        </div>
        <div class="form-container">
        </div>
    </div>
    <div class="snackbar-container">
    </div>
</body>
</html>
