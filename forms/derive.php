<?php

require '../components/components.php';

$operation = [
    'Add' => 'plus',
    'Subtract' => 'minus',
    'Multiply' => 'x',
    'Divide' => 'divide',
    'Concatenate' => 'plus',
]

?>
<h2>Derive</h2>
<div class="dropdown-group derive">
    <?php createRadioGroup($operation , 'operation', 'Operation')?>
    <div class="dropdown dropdown-derive selected">
        <div class="dropdown-wrapper gap-05">
            <span class="legend">Column 1</span>
            <div class="input-container">
                <div class="fill-space select-container column1"></div>
                <i data-lucide="chevron-down"></i>
            </div>
            <span class="legend">Column 2</span>
            <div class="input-container">
                <div class="fill-space select-container column2"></div>
                <i data-lucide="chevron-down"></i>
            </div>
            <span class="legend">New Column Name</span>
            <input type="text" name="column-name" class="input-text" placeholder="Enter new column name">
        </div>
    </div>
</div>
<div class="dropdown-group keep">
</div>
<div class="button-group">
    <?php renderButton("Cancel", "x")?>
    <?php renderButton("Preview", "eye")?>
    <?php renderButton("Apply", "mouse-pointer-2", true)?>
</div>
