package com.applyo.application.exception;

public class ConsentTokenExpiredException extends RuntimeException {
    public ConsentTokenExpiredException(String message) {
        super(message);
    }
}
