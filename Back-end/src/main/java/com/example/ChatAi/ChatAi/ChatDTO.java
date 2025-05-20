package com.example.ChatAi.ChatAi;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class ChatDTO {

    private String msg;

    public ChatDTO (String msg){
        this.msg = msg;
    }
    public ChatDTO(){}
}
