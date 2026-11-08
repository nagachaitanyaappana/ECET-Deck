package com.ecetdesk.api.auth;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class AuthFlowException extends ResponseStatusException {
    public AuthFlowException(String message, int status) { super(HttpStatus.valueOf(status), message); }
}
