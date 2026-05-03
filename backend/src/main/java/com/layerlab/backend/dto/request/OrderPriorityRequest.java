package com.layerlab.backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderPriorityRequest {

    @NotNull(message = "La priorité est obligatoire")
    @Min(value = 1, message = "La priorité doit être au minimum 1")
    @Max(value = 5, message = "La priorité doit être au maximum 5")
    private Integer priority;
}
