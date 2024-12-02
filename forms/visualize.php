
<?php

include '../components/components.php';


?>

<h2>Visualize</h2>
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
    <div class="dropdown dropdown-plot">
        <div class="dropdown-wrapper">
            <span class="legend">Plots</span>
            <div class="input-container">
                <div class="fill-space checkbox-container">
                    <label for="histogram">
                        <input type="checkbox" id="histogram" data-value="histogram">
                        Histogram
                    </label>
                    <label for="density">
                        <input type="checkbox" id="density" data-value="density">
                        Density
                    </label>
                    <label for="box">
                        <input type="checkbox" id="box" data-value="box">
                        Box
                    </label>
                    <label for="bar">    
                        <input type="checkbox" id="bar" data-value="bar">
                        Bar
                    </label>
                    <label for="scatter">
                        <input type="checkbox" id="scatter" data-value="scatter">
                        Scatter
                    </label>
                    <label for="violin">
                        <input type="checkbox" id="violin" data-value="violin">
                        Violin
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


