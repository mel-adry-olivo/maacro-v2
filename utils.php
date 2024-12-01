<?php

function parseResponse($response) {
    $json = json_decode($response, true);
    return $json;
}