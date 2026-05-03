package com.layerlab.backend.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    private BigDecimal dailyRevenue;
    private Long activeUsers;
    private Long newClientsThisMonth;
    private Long totalSales;
}
