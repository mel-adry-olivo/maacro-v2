<?php


function renderFormButton($text, $icon, $filled = false) {
    $dataAction = str_replace(' ', '-', strtolower($text));
    $filled = $filled ? "btn-filled" : "";
    echo
    <<<HTML
    <button class="btn btn-form $filled" data-action="$dataAction">
        <i data-lucide="$icon"></i>
        $text
    </button>
    HTML;
}

function renderButton($text, $icon, $filled = false) {
    $dataAction = str_replace(' ', '-', strtolower($text));
    $filled = $filled ? "btn-filled" : "";
    echo
    <<<HTML
    <button class="btn $filled" data-action="$dataAction">
        <i data-lucide="$icon"></i>
        $text
    </button>
    HTML;
}

function createRadioGroup($array, $name, $legend, $first = true) {

    $html = '';

    foreach ($array as $key => $value) {

        $keylc = str_replace(' ', '-', strtolower($key));
        $checked = $first ? 'checked' : ''; 
        $first = false; 


        $html .= <<<HTML
        <label for="$keylc">
            <input type="radio" id="$keylc" name="$name" value="$keylc" $checked>
            <div class="btn">
                <i data-lucide="$value"></i>
                $key
            </div>
        </label>
        HTML;
    }

    echo
    <<<HTML
    <fieldset class="radio-group">
        <p class="legend">$legend</p>
        <div class="radio-group-container">
            $html
        </div>
    </fieldset>
    HTML;
}

function createCheckboxGroup($array, $name, $legend) {

    $html = '';
    foreach ($array as $key => $value) {
        $keylc = str_replace(' ', '-', strtolower($key));
        $html .= <<<HTML
        <label for="$keylc">
            <input type="checkbox" id="$keylc" name="$name" value="$keylc">
            <div class="btn">
                <i data-lucide="$value"></i>
                $key
            </div>
        </label>
        HTML;
    }

    echo
    <<<HTML
    <fieldset class="checkbox-group">
        <p class="legend">$legend</p>
        <div class="checkbox-group-container">
            $html
        </div>
    </fieldset>
    HTML;
}



function renderTable($data) {
    if (empty($data)) {
        echo
        <<<HTML
        <div class="table-container">
            <div class="table-main">
                <div class="no-data">
                    <p>No data found</p>
                </div>
            </div>
        </div>
        HTML;
        return;
    }

    $headers = array_keys($data[0]);
    $headerHtml = '';
    foreach ($headers as $header) {
        $headerHtml .= "<th data-action='format-revise' data-type='string'>$header</th>";
    }

    $rowHtml = '';
    foreach ($data as $row) {
        $rowHtml .= "<tr>";
        foreach ($row as $cell) {
            $rowHtml .= "<td>$cell</td>";
        }
        $rowHtml .= "</tr>";
    }

    echo
    <<<HTML
    <div class="table-container">
        <table class="table-main">
            <thead>
                <tr>
                    $headerHtml
                </tr>
            </thead>
            <tbody>
                $rowHtml
            </tbody>
        </table>
    </div>
    HTML;
}
