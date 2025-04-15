package com.example.ChatAi.ChatAi;

import jakarta.persistence.*;
import org.hibernate.annotations.Type;

@Entity
@Table(name = "forms")
public class FieldEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String formName;
    private String description;

    @Lob
    @Column(columnDefinition = "TEXT")  // Store JSON as text
    private String fieldsJson;  // Stores form structure

    @Lob
    @Column(columnDefinition = "TEXT")  // Store JSON as text
    private String responsesJson;  // Stores user responses

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFormName() {
        return formName;
    }

    public void setFormName(String formName) {
        this.formName = formName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFieldsJson() {
        return fieldsJson;
    }

    public void setFieldsJson(String fieldsJson) {
        this.fieldsJson = fieldsJson;
    }

    public String getResponsesJson() {
        return responsesJson;
    }

    public void setResponsesJson(String responsesJson) {
        this.responsesJson = responsesJson;
    }
}

