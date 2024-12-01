<?php

include '../components/components.php';

$criteria = [
    'All Columns' => 'rows-3',
    'Column' => 'columns-3'
];

$keep = [
    'First' => 'chevron-first',
    'Last' => 'chevron-last'
];

?>
<h2>Deduplication</h2>
<div class="dropdown-group subset">
    <?php createRadioGroup($criteria, 'subset', 'Remove duplicates by')?>
    <div class="dropdown dropdown-subset">
        <div class="dropdown-wrapper">
            <div class="input-container">
                <div class="fill-space select-container"></div>
                <i data-lucide="chevron-down"></i>
            </div>
        </div>
    </div>
</div>
<div class="dropdown-group keep">
    <?php createRadioGroup($keep, 'keep', 'Which rows to keep')?>
</div>
<div class="button-group">
    <?php renderButton("Cancel", "x")?>
    <?php renderButton("Preview", "eye")?>
    <?php renderButton("Apply", "mouse-pointer-2", true)?>
</div>
