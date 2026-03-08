package com.br.tutoria.pei.fran.service.exceptions;

public class EntityAlreadyExistingException extends RuntimeException {
    public EntityAlreadyExistingException(String message) {
        super(message);
    }
}
