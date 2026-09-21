package com.careerpilot.common;

/** 409 — the request conflicts with existing state (duplicate email, duplicate unique row). */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}
