package com.plotforge.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class DashboardResponse {

    private long totalStories;

    private long completedStories;

    private long draftStories;

    private long totalWords;
}