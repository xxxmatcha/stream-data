package edu.ncut.kafkaflinkweb.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class PageController {

    @RequestMapping("/main.html")
    public String main(){
        return "main";
    }

    @RequestMapping("/test.html")
    public String test(){
        return "test";
    }

    @RequestMapping("/demo.html")
    public String demo(){
        return "demo";
    }

    @RequestMapping("/index.html")
    public String index(){
        return "index";
    }
}
