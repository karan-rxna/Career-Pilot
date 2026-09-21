package com.careerpilot.common;

/** 401 — bad credentials, expired token, or an invalid/rotated refresh token. */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
