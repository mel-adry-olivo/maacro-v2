<?php

include '../components/components.php';

$missingData = [
    'Drop Rows' => 'x',
    'Default Value' => 'pencil',
    'Impute' => 'align-center',
];

$tools = [
    'Format Date' => 'calendar',
    'Standardize Columns' => 'columns',
    'Drop Outliers' => 'x'
]

?>

<h2>Cleanse</h2>
<div class="dropdown-group missing">
    <?php createRadioGroup($missingData, 'missing', 'Handle missing data')?>
    <div class="dropdown dropdown-impute">
        <div class="dropdown-wrapper">
            <div class="input-container">
                <div class="fill-space select-container" data-action="impute-column">

                </div>
                <i data-lucide="chevron-down"></i>
            </div>
            <div class="input-container">
                <div class="fill-space select-container" data-action="impute">
                    <select name="impute" id="">
                        <option value="mean">Mean</option>
                        <option value="median">Median</option>
                        <option value="mode">Mode</option>
                    </select>
                </div>
                <i data-lucide="chevron-down"></i>
            </div>
        </div>
    </div>
    <div class="dropdown dropdown-default">
        <div class="dropdown-wrapper">
            <div class="input-container">
                <div class="fill-space select-container" data-action="default">
                </div>
                <i data-lucide="chevron-down"></i>
            </div>
            <input type="text" name="default" class="input-text" placeholder="Enter default value"> 
        </div>
    </div>
</div>
<div class="dropdown-group tools">
    <?php createCheckboxGroup($tools, 'tools', 'Tools (multiple allowed)')?>   
    <div class="dropdown dropdown-date">
        <div class="dropdown-wrapper">
            <span class="legend">Date Column</span>
            <div class="input-container">
                <div class="fill-space select-container" data-action="date">
                </div>
                <i data-lucide="chevron-down"></i>
            </div>
        </div>
    </div>
    <div class="dropdown dropdown-outliers">
        <div class="dropdown-wrapper">
            <span class="legend">Drop Outlier Column</span>
            <div class="button-group">
                <div class="input-container">
                    <div class="fill-space select-container" data-action="outliers">
                    </div>
                    <i data-lucide="chevron-down"></i>
                </div>
                <div class="input-container">
                    <div class="fill-space select-container" data-action="outliers-method">
                        <select name="outliers-method" id="">
                            <option value="iqr">IQR</option>
                            <option value="zscore">Z-Score</option>
                        </select>
                    </div>
                    <i data-lucide="chevron-down"></i>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="button-group">
    <?php renderButton("Cancel", "x")?>
    <?php renderButton("Preview", "eye")?>
    <?php renderButton("Apply", "mouse-pointer-2", true)?>
</div>


