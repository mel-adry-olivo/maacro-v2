
<?php

include '../components/components.php';


?>

<h2>Upload</h2>
<div class="dropdown-group upload">
    <div class="flow">
        <span class="legend">Upload a dataset</span>
        <?php renderButton("Upload", "upload")?>
        <input type="file" id="fileInput2" style="display: none;" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
    </div>
</div>
<div class="dropdown-group uploaded hidden">
    <div class="file hidden">
        <i data-lucide="sheet"></i>
        <p class="file-name"></p>
    </div>
</div>
<div class="button-group">
    <?php renderButton("Cancel", "x")?>
    <?php renderButton("Confirm", "mouse-pointer-2", true)?>
</div>