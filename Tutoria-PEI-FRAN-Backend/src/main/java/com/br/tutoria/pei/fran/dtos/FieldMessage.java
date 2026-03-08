package com.br.tutoria.pei.fran.dtos;

public class FieldMessage {

    private String fieldName;
    private String message;

    public FieldMessage() {}

    public FieldMessage(String fieldName, String message) {
        this.fieldName = fieldName;
        this.message = message;
    }

    public String getFieldName() {
        return fieldName;
    }

    public String getMessage() {
        return message;
    }
}
