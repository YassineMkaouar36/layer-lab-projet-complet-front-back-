package com.layerlab.backend.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductRequest {

    @NotBlank(message = "Le nom du produit est obligatoire")
    private String name;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "0.01", message = "Le prix doit être supérieur à 0")
    private BigDecimal price;

    @NotBlank(message = "L'auteur est obligatoire")
    private String author;

    @NotNull(message = "L'identifiant de la sous-catégorie est obligatoire")
    private Long subCategoryId;

    @NotNull(message = "Le stock est obligatoire")
    @Min(value = 0, message = "Le stock ne peut pas être négatif")
    private Integer stock;

    @Min(value = 0, message = "Le seuil d'alerte ne peut pas être négatif")
    private Integer stockAlertThreshold;

    public ProductRequest() {}

    public ProductRequest(String name, String description, BigDecimal price,
                          String author, Long subCategoryId, Integer stock,
                          Integer stockAlertThreshold) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.author = author;
        this.subCategoryId = subCategoryId;
        this.stock = stock;
        this.stockAlertThreshold = stockAlertThreshold;
    }

    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public String getAuthor() { return author; }
    public Long getSubCategoryId() { return subCategoryId; }
    public Integer getStock() { return stock; }
    public Integer getStockAlertThreshold() { return stockAlertThreshold; }

    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setAuthor(String author) { this.author = author; }
    public void setSubCategoryId(Long subCategoryId) { this.subCategoryId = subCategoryId; }
    public void setStock(Integer stock) { this.stock = stock; }
    public void setStockAlertThreshold(Integer stockAlertThreshold) { this.stockAlertThreshold = stockAlertThreshold; }
}
