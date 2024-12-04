<?php

include '../components/components.php';

$columnName = $_GET['column'];
$default = $_GET['default'];

?>

<h2>Format Revise</h2>
<div class="dropdown-group revise">
    <span class="legend">Column</span>
    <div class="input-container">
        <p class="column-name"><?php echo $columnName; ?></p>
        <div class="fill-space select-container" data-action="revise">
            <select name="revise" id="" data-column="<?php echo $columnName; ?>">
                <option 
                    value="int" <?php echo ($default === 'integer') ? 'selected' : ''; ?>>
                    integer
                </option>
                <option 
                    value="float" <?php echo ($default === 'float') ? 'selected' : ''; ?>>
                    float
                </option>
                <option 
                    value="str" <?php echo ($default === 'str') ? 'selected' : ''; ?>>
                    str
                </option>
                <option 
                    value="date" <?php echo ($default === 'date') ? 'selected' : ''; ?>>
                    date
                </option>
            </select>
            <i data-lucide="chevron-down"></i>
        </div>
    </div>
</div>
<div class="button-group">
    <?php renderButton("Cancel", "x")?>
    <?php renderButton("Apply", "mouse-pointer-2", true)?>
</div>

