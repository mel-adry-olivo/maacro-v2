
<?php

include '../components/components.php';


?>

<h2>Join</h2>
<div class="dropdown-group file">
    <div class="flow">
        <span class="legend">Upload another dataset</span>
        <?php renderButton("Upload", "upload")?>
        <input type="file" id="fileInput" style="display: none;" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
    </div>
</div>
<div class="dropdown-group join hidden">
    <div class="file hidden">
        <i data-lucide="sheet"></i>
        <p class="file-name"></p>
    </div>
    <div class="flex margin-top">
        <!-- <div class="flow fill-space">
            <span class="legend">Merge column by</span>
            <div class="dropdown dropdown-merge selected" >
                <div class="dropdown-wrapper no-margin">
                    <div class="input-container">
                        <div class="fill-space select-container" data-action="join">

                        </div>
                        <i data-lucide="chevron-down"></i>
                    </div>
                </div>
            </div>
        </div> -->
        <div class="flow fill-space">
            <span class="legend">Axis</span>
            <div class="dropdown dropdown-method selected" >
                <div class="dropdown-wrapper no-margin">
                    <div class="input-container">
                        <div class="fill-space select-container" >
                            <select name="dropdown" class="dropdown-select" data-action="axis">
                                <option value="vertically">Vertically</option>
                                <option value="horizontally">Horizontally</option>
                            </select>
                        </div>
                        <i data-lucide="chevron-down"></i>
                    </div>
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
