package com.layerlab.backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class PromoCodeRequest {

    @NotBlank(message = "Le code promo est obligatoire")
    private String code;

    @NotNull(message = "Le pourcentage de remise est obligatoire")
    @Min(value = 1, message = "Le pourcentage de remise doit être au minimum 1")
    @Max(value = 100, message = "Le pourcentage de remise doit être au maximum 100")
    private Integer discountPercent;

    @NotNull(message = "La date de validité est obligatoire")
    private LocalDate validUntil;

    private Boolean active;

    public PromoCodeRequest() {}

    public PromoCodeRequest(String code, Integer discountPercent, LocalDate validUntil, Boolean active) {
        this.code = code;
        this.discountPercent = discountPercent;
        this.validUntil = validUntil;
        this.active = active;
    }

    public String getCode() { return code; }
    public Integer getDiscountPercent() { return discountPercent; }
    public LocalDate getValidUntil() { return validUntil; }
    public Boolean getActive() { return active; }

    public void setCode(String code) { this.code = code; }
    public void setDiscountPercent(Integer discountPercent) { this.discountPercent = discountPercent; }
    public void setValidUntil(LocalDate validUntil) { this.validUntil = validUntil; }
    public void setActive(Boolean active) { this.active = active; }
}