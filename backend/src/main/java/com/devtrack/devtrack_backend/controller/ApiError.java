package com.devtrack.devtrack_backend.controller;

import java.util.Map;

public record ApiError(
        int status,
        String error,
        String message,
        Map<String, String> fieldErrors) {
}