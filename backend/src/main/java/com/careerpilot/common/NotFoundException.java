package com.careerpilot.common;

/** 404 — the resource does not exist, or belongs to another user (never leak that distinction). */
public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }

    public static NotFoundException of(String resource, Object id) {
        return new NotFoundException(resource + " " + id + " not found");
    }
}
