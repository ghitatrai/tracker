package com.ghita.tracker.dto;

import java.util.List;

public class GraphResponse {
    private List<String> labels;
    private List<Double> values;

    public GraphResponse(List<String> labels, List<Double> values) {
        this.labels = labels;
        this.values = values;
    }

    public List<String> getLabels() {
        return labels;
    }

    public List<Double> getValues() {
        return values;
    }
}