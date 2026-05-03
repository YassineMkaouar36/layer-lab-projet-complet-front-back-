package com.layerlab.backend.dto.request;

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
public class SubCategoryRequest {

    @NotBlank(message = "Le nom de la sous-catégorie est obligatoire")
    private String name;

    @NotNull(message = "L'identifiant de la catégorie est obligatoire")
    private Long categoryId;
}
