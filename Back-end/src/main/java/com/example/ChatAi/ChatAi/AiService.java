package com.example.ChatAi.ChatAi;


import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiService {

    @Value("${gemini.api.key}")
    private String apikey;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private Repository repository;

    private final WebClient webClient = WebClient.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent");

    public String ReplyUserQst(String userQuery) {
        // Get all form data
        List<Map<String, Object>> allFormData = getAllFormsData(); // call the method you already wrote

        // Convert form data to JSON string
        String formDataJson = new JSONArray(allFormData).toString(2); // pretty-print with indentation

        // Updated prompt for analysis
        String prompt = "You are a highly intelligent form data analysis AI. Analyze the following structured form data and answer the user's specific question based ONLY on the data provided. " +
                "Do not include general explanations or summaries. Focus only on the relevant part of the data that directly answers the user's query. " +
                "Return a clear, concise, and direct answer. If the answer cannot be found in the data, respond with: 'The requested information is not available in the data.'\n\n" +
                "Form Data:\n" + formDataJson + "\n\n" +
                "User Question:\n" + userQuery;

        // Prepare JSON body - escape quotes and newlines properly
        String requestBody = "{\"contents\":[{\"parts\":[{\"text\":\"" +
                prompt.replace("\\", "\\\\")
                        .replace("\"", "\\\"")
                        .replace("\n", "\\n") +
                "\"}]}]}";

        String response = webClient.post()
                .uri("?key=" + apikey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if (response == null || response.isEmpty()) {
            return "Sorry, I couldn't process your request.";
        }

        JSONObject jsonObject = new JSONObject(response);
        if (!jsonObject.has("candidates")) {
            return "Error: Invalid response from AI.";
        }

        JSONArray candidates = jsonObject.getJSONArray("candidates");
        if (candidates.isEmpty()) {
            return "No response from AI.";
        }

        JSONObject content = candidates.getJSONObject(0).getJSONObject("content");
        JSONArray parts = content.getJSONArray("parts");

        return parts.getJSONObject(0).getString("text");
    }

    public JSONObject generateForm(String userPrompt) {
        // Instruction for Gemini API
        String systemPrompt = "Create a JSON structure for a form. The structure must include a title and description for the form. " +
                "All fields should be included in a 'fields' array. Each field must have the following attributes: " +
                "label (string), name (string), type (string), required (boolean), and options (array of strings if applicable). " +
                "Ensure the output is valid JSON format based on the provided title.";
        // Construct request payload
        String requestBody = "{ \"contents\": [{ \"parts\": [{ \"text\": \"" + systemPrompt + userPrompt + "\" }] }] }";

        // Call Gemini API
        String response = webClient.post()
                .uri("?key=" + apikey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .onErrorResume(e -> Mono.just("{\"error\": \"Failed to generate form.\"}"))
                .block();

        // Parse and validate the response
        if (response == null || response.isEmpty()) {
            return new JSONObject().put("error", "No response from AI.");
        }

        try {
            // Try to parse the response as a JSON object
            JSONObject jsonObject = new JSONObject(response);

            // Check if the response contains "candidates"
            if (!jsonObject.has("candidates")) {
                return new JSONObject().put("error", "Invalid response from AI: No candidates found.");
            }

            JSONArray candidates = jsonObject.getJSONArray("candidates");
            if (candidates.isEmpty()) {
                return new JSONObject().put("error", "No candidates found in AI response.");
            }

            // Extract the content
            JSONObject content = candidates.getJSONObject(0).getJSONObject("content");
            JSONArray parts = content.getJSONArray("parts");

            // Extract the generated form JSON
            String formText = parts.getJSONObject(0).getString("text");

            // Try to parse the form text as JSON
            try {
                return new JSONObject(formText);
            } catch (Exception e) {
                // If parsing fails, search for a JSON-like structure in the text
                String jsonString = extractJsonFromText(formText);
                if (jsonString != null) {
                    return new JSONObject(jsonString);
                } else {
                    return new JSONObject().put("error", "Failed to parse AI response: No valid JSON found.");
                }
            }
        } catch (Exception e) {
            return new JSONObject().put("error", "Failed to parse AI response: " + e.getMessage());
        }
    }

    // Helper method to extract JSON from plain text
    private String extractJsonFromText(String text) {
        int startIndex = text.indexOf("{");
        int endIndex = text.lastIndexOf("}");
        if (startIndex != -1 && endIndex != -1 && endIndex > startIndex) {
            return text.substring(startIndex, endIndex + 1);
        }
        return null;
    }

 public String saveField(FieldEntity fieldEntity){
     repository.save(fieldEntity);
     return "Form saved successfully! Share this link: http://localhost:8080/form/" + fieldEntity.getFormName();
 }

    public FieldEntity findByformName(String formname) {
        List<FieldEntity> forms = repository.findAll();
        return forms.stream()
                .filter(a -> a.getFormName().equalsIgnoreCase(formname))
                .findFirst() // Get the first matching element
                .orElseThrow(() -> new RuntimeException("Form not found"));
    }

    public String saveFormWithFields(String formName, String description, String fieldsJson) {
        // Sanitize form name to create a valid table name
        String sanitizedTableName = sanitizeTableName(formName);

        // Check if form/table already exists
        boolean tableExists = checkIfTableExists(sanitizedTableName);

        if (!tableExists) {
            // Create dynamic table based on form fields
            createDynamicTable(sanitizedTableName, fieldsJson);
        }

        // Save form structure in FieldEntity
        FieldEntity fieldEntity = new FieldEntity();
        fieldEntity.setFormName(formName);
        fieldEntity.setDescription(description);
        fieldEntity.setFieldsJson(fieldsJson);

        repository.save(fieldEntity);
        return "Form structure saved successfully! Access at: http://localhost:8080/form/" + formName;
    }

    public String saveUserResponses(String formName, String responsesJson) {
        // Sanitize form name to create a valid table name
        String sanitizedTableName = sanitizeTableName(formName);

        try {
            // Parse responses JSON
            JSONObject responses = new JSONObject(responsesJson);

            // Prepare SQL insert statement dynamically
            List<String> columns = new ArrayList<>();
            List<Object> values = new ArrayList<>();

            for (String key : responses.keySet()) {
                columns.add(key);

                // Handle different value types properly
                Object value = responses.get(key);

                // Handle checkbox values properly
                if (value instanceof JSONArray) {
                    // For checkbox groups: Check if array is not empty
                    JSONArray jsonArray = (JSONArray) value;
                    if (key.equalsIgnoreCase("consenttocontact")) {
                        // For boolean consent fields: convert to boolean (true if array has values)
                        value = !jsonArray.isEmpty();
                    } else {
                        // For other checkbox groups: keep as JSON string
                        value = jsonArray.toString();
                    }
                }
                // Convert single checkbox "on" values to boolean TRUE for MySQL
                else if (value instanceof String) {
                    if ("on".equals(value) || "true".equals(value)) {
                        value = true;
                    } else if (key.equalsIgnoreCase("consenttocontact")) {
                        // If consent field has any other string value, validate it
                        value = Boolean.parseBoolean(value.toString());
                    }
                }

                values.add(value);
            }

            String columnNames = columns.stream()
                    .map(this::sanitizeColumnName)
                    .collect(Collectors.joining(", "));

            String placeholders = columns.stream()
                    .map(col -> "?")
                    .collect(Collectors.joining(", "));

            String insertQuery = String.format("INSERT INTO `%s` (%s) VALUES (%s)",
                    sanitizedTableName, columnNames, placeholders);

            // Execute the insert
            jdbcTemplate.update(insertQuery, values.toArray());

            return "User responses saved successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error saving user responses: " + e.getMessage();
        }
    }

    public String getFormResponses(String formName) {
        Optional<FieldEntity> formOptional = repository.findByFormName(formName);

        if (formOptional.isEmpty()) {
            return "Form not found!";
        }

        return formOptional.get().getResponsesJson();
    }

    private boolean checkIfTableExists(String tableName) {
        try {
            String checkTableQuery = "SHOW TABLES LIKE ?";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(checkTableQuery, tableName);
            return !result.isEmpty();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private void createDynamicTable(String tableName, String fieldsJson) {
        try {
            JSONArray fields = new JSONArray(fieldsJson);

            // Start building CREATE TABLE query
            StringBuilder createTableQuery = new StringBuilder(
                    String.format("CREATE TABLE `%s` (", tableName)
            );
            createTableQuery.append("id INT AUTO_INCREMENT PRIMARY KEY, ");
            createTableQuery.append("submission_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, ");

            // Add columns based on form fields
            for (int i = 0; i < fields.length(); i++) {
                JSONObject field = fields.getJSONObject(i);
                String fieldName = field.getString("name");
                String columnName = sanitizeColumnName(fieldName);
                String fieldType = field.getString("type");
                String columnType = mapFieldTypeToSqlType(fieldType);

                createTableQuery.append(String.format("`%s` %s, ", columnName, columnType));
            }

            // Remove trailing comma and close parenthesis
            createTableQuery.setLength(createTableQuery.length() - 2);
            createTableQuery.append(")");

            // Execute table creation
            jdbcTemplate.execute(createTableQuery.toString());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create dynamic table: " + e.getMessage());
        }
    }

    // Helper method to sanitize table names
    private String sanitizeTableName(String name) {
        return "form_" + name.replaceAll("[^a-zA-Z0-9_]", "_").toLowerCase();
    }

    // Helper method to sanitize column names
    private String sanitizeColumnName(String name) {
        return name.replaceAll("[^a-zA-Z0-9_]", "_").toLowerCase();
    }

    // Map form field types to SQL column types
    private String mapFieldTypeToSqlType(String fieldType) {
        switch (fieldType.toLowerCase()) {
            case "number":
                return "DECIMAL(10,2)";
            case "email":
                return "VARCHAR(255)";
            case "textarea":
                return "TEXT";
            case "date":
                return "DATE";
            case "checkbox":
                return "BOOLEAN";
            case "consent":  // Adding explicit consent type
                return "BOOLEAN";
            case "select":
                return "VARCHAR(255)";
            case "checkbox-group":
            case "multiselect":
                // For fields that may contain multiple values (stored as JSON strings)
                return "TEXT";
            default:
                return "VARCHAR(255)";
        }
    }

    public List<Map<String, Object>> getAllFormsData() {
        List<FieldEntity> forms = repository.findAll();
        List<Map<String, Object>> allData = new ArrayList<>();

        for (FieldEntity form : forms) {
            String sanitizedTableName = sanitizeTableName(form.getFormName());
            String query = String.format("SELECT * FROM `%s`", sanitizedTableName);
            List<Map<String, Object>> results = jdbcTemplate.queryForList(query);

            Map<String, Object> formData = new HashMap<>();
            formData.put("formName", form.getFormName());
            formData.put("data", results);
            allData.add(formData);
        }

        return allData;
    }

}





