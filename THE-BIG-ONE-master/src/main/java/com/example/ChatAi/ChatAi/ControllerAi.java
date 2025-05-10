package com.example.ChatAi.ChatAi;


import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://127.0.0.1:5501"
})
public class ControllerAi {


@Autowired
private AiService aiService;
    @Autowired
    private Repository repository;

    @PostMapping("/chat")
    public String communicateAI(@RequestBody String msg){
        JSONObject jsonObject = new JSONObject(msg);
        String userRequest = jsonObject.getString("chat");
return aiService.ReplyUserQst(userRequest);
    }

    @PostMapping(value = "/generate-form", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> generateForm(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");

        // Get AI-generated form JSON
        JSONObject aiResponse = aiService.generateForm(prompt);

        // Return JSON as Map
        return aiResponse.toMap();
    }


    @CrossOrigin(origins = {
            "http://127.0.0.1:5500",
            "http://127.0.0.1:5501"
    })
    @GetMapping("/all-form-data")
    public ResponseEntity<List<Map<String, Object>>> getAllFormData() {
        List<Map<String, Object>> allFormData = aiService.getAllFormsData();
        return ResponseEntity.ok(allFormData);
    }


    // Save form structure (fields)
    @CrossOrigin(origins = {
            "http://127.0.0.1:5500",
            "http://127.0.0.1:5501"
    })
    @PostMapping("/save")
    public ResponseEntity<String> saveForm(@RequestParam String formName,
                                           @RequestParam String description,
                                           @RequestBody String fieldsJson) {
        return ResponseEntity.ok(aiService.saveFormWithFields(formName, description, fieldsJson));
    }

    // Save user responses
    @CrossOrigin(origins = {
            "http://127.0.0.1:5500",
            "http://127.0.0.1:5501"
    })
    @PostMapping("/submit")
    public ResponseEntity<String> saveResponses(@RequestParam String formName,
                                                @RequestBody String responsesJson) {
        return ResponseEntity.ok(aiService.saveUserResponses(formName, responsesJson));
    }

    // Retrieve user responses
    @CrossOrigin(origins = {
            "http://127.0.0.1:5500",
            "http://127.0.0.1:5501"
    })
    @GetMapping("/responses/{formName}")
    public ResponseEntity<String> getResponses(@PathVariable String formName) {
        return ResponseEntity.ok(aiService.getFormResponses(formName));
    }

    @CrossOrigin(origins = {
            "http://127.0.0.1:5500",
            "http://127.0.0.1:5501"
    })
    @GetMapping("/form/{formName}")
    public ResponseEntity<String> getForm(@PathVariable String formName) {
        FieldEntity form = aiService.findByformName(formName);
        if (form == null) {
            return ResponseEntity.status(404).body("{\"error\": \"Form not found\"}");
        }
        return ResponseEntity.ok(form.getFieldsJson());  // Ensure JSON format
    }

    @CrossOrigin(origins = {
            "http://127.0.0.1:5500",
            "http://127.0.0.1:5501"
    })
    @GetMapping("/all-forms")
    public ResponseEntity<List<Map<String, Object>>> getAllForms() {
        List<FieldEntity> forms = repository.findAll();

        List<Map<String, Object>> formsList = forms.stream()
                .map(form -> {
                    Map<String, Object> formMap = new HashMap<>();
                    formMap.put("formName", form.getFormName());
                    formMap.put("description", form.getDescription());
                    return formMap;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(formsList);
    }

}
