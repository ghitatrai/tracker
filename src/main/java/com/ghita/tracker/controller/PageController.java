package com.ghita.tracker.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String home() {
        return "welcome"; // welcome.html
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

    @GetMapping("/form")
    public String form() {
        return "bill-form";
    }

    @GetMapping("/bill-form")
    public String billForm() {
        return "bill-form";
    }

    @GetMapping("/bill-details")
    public String billDetails() {
        return "bill-details";
    }

    @GetMapping("/categories")
    public String categories() {
        return "categories";
    }

    @GetMapping("/settings")
    public String settings() {
        return "settings";
    }
}