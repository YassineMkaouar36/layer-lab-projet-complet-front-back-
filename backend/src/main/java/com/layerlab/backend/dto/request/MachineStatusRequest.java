package com.layerlab.backend.dto.request;

import com.layerlab.backend.entity.MachineStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MachineStatusRequest {

    @NotNull(message = "Le statut de la machine est obligatoire")
    private MachineStatus status;
}
