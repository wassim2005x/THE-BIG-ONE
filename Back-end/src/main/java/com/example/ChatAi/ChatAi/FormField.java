package com.example.ChatAi.ChatAi;

import java.util.Map;

public class FormField {
    private String label;
    private String type;
    private String name;
    private String placeholder;
    private Map<String, Object> validation;

    public FormField(String label, String type, String name, String placeholder, Map<String, Object> validation) {
        this.label = label;
        this.type = type;
        this.name = name;
        this.placeholder = placeholder;
        this.validation = validation;
    }

    public String getLabel() {
        return label;
    }

    public String getType() {
        return type;
    }

    public String getName() {
        return name;
    }

    public String getPlaceholder() {
        return placeholder;
    }

    public Map<String, Object> getValidation() {
        return validation;
    }
}
