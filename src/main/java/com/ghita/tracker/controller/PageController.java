package com.ghita.tracker.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String home() {
        return "dashboard"; // loads dashboard.html
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }

    @GetMapping("/bills-page")
    public String bills() {
        return "bills";
    }

    @GetMapping("/analytics")
    public String analytics() {
        return "analytics";
    }
}