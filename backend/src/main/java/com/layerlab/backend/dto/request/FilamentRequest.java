package com.layerlab.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FilamentRequest {

    @NotBlank(message = "La couleur est obligatoire")
    private String color;

    @NotBlank(message = "Le type est obligatoire")
    private String type;

    @NotNull(message = "Le stock en grammes est obligatoire")
    @Min(value = 0, message = "Le stock ne peut pas être négatif")
    private Integer stockGrams;

    @Min(value = 0, message = "Le seuil d'alerte ne peut pas être négatif")
    private Integer alertThreshold;

    private Boolean available;
}
