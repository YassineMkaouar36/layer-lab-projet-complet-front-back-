package com.layerlab.backend.dto.response;

import com.layerlab.backend.entity.MachineStatus;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MachineResponse {

    private Long id;
    private String name;
    private MachineStatus status;
    private LocalDate lastMaintenanceDate;
    private Boolean maintenanceAlert;
}
