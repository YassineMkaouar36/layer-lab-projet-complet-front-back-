package com.layerlab.backend.dto.request;

import com.layerlab.backend.entity.MachineStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MachineRequest {

    @NotBlank(message = "Le nom de la machine est obligatoire")
    private String name;

    private MachineStatus status;

    private LocalDate lastMaintenanceDate;
}
