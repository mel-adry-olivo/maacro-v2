
<?php

include '../components/components.php';

$filetypes = [
    'CSV' => 'table',
    'JSON' => 'braces',
    'XLSX' => 'file-spreadsheet'
]

?>

<h2>Download</h2>
<div class="dropdown-group upload">
    <?php createRadioGroup($filetypes, 'download', 'Choose file type')?>
</div>
<div class="button-group">
    <?php renderButton("Cancel", "x")?>
    <?php renderButton("Proceed", "download", true)?>
</div>