
<?php

include '../components/components.php';


?>

<h2>Explore Data</h2>
<div class="dropdown-group explore">
    <div class="row">
        <div class="column-container flow ">
            <span class="legend">Columns</span>
            <div class="column-group column-group-main" data-group="main"></div>
        </div>
        <div class="vertical-button-group">
            <div class="btn vertical-button" data-input="variable" data-group="variable">
                <i data-lucide="chevron-right"></i>
            </div>
            <div class="btn vertical-button" data-input="split" data-group="split">
                <i data-lucide="chevron-right"></i>
            </div>
        </div>
        <div class="input-container-explore">
            <div class="column-container flow">
                <span class="legend">Variables</span>
                <div class="column-group column-group-variable">
                </div>
            </div>
            <div class="column-container flow">
                <span class="legend">Split By</span>
                <div class="column-group column-group-split">

                </div>
            </div>
        </div>
    </div>
    <div class="dropdown dropdown-statistics">
        <div class="dropdown-wrapper">
            <span class="legend">Statistics</span>
            <div class="input-container">
                <div class="fill-space checkbox-container">
                    <label for="mean">
                        <input type="checkbox" id="mean" data-value="mean">
                        Mean
                    </label>
                    <label for="median">
                        <input type="checkbox" id="median" data-value="median">
                        Median
                    </label>
                    <label for="mode">
                        <input type="checkbox" id="mode" data-value="mode">
                        Mode
                    </label>
                    <label for="sum">    
                        <input type="checkbox" id="sum" data-value="sum">
                        Sum
                    </label>
                    <label for="count">
                        <input type="checkbox" id="count" data-value="count">
                        Count
                    </label>
                    <label for="min">
                        <input type="checkbox" id="min" data-value="min">
                        Min
                    </label>
                    <label for="max">
                        <input type="checkbox" id="max" data-value="max">
                        Max
                    </label>
                    <label for="variance">
                        <input type="checkbox" id="variance" data-value="variance">
                        Variance
                    </label>
                    <label for="standard-deviation">
                        <input type="checkbox" id="standard-deviation" data-value="standard-deviation">
                        Standard Deviation
                    </label>
                    <label for="skewness">
                        <input type="checkbox" id="skewness" data-value="skewness">
                        Skewness
                    </label>

                </div>
                <i data-lucide="chevron-down"></i>
            </div>
        </div>
    </div>
</div>
<div class="button-group">
    <?php renderButton("Cancel", "x")?>
    <?php renderButton("View", "eye", true)?>
</div>


