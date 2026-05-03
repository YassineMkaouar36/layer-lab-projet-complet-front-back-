package com.layerlab.backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewRequest {

    @NotNull(message = "La note est obligatoire")
    @Min(value = 1, message = "La note doit être au minimum 1")
    @Max(value = 5, message = "La note doit être au maximum 5")
    private Integer rating;

    @NotBlank(message = "Le commentaire est obligatoire")
    private String comment;

    public ReviewRequest() {}

    public ReviewRequest(Integer rating, String comment) {
        this.rating = rating;
        this.comment = comment;
    }

    public Integer getRating() { return rating; }
    public String getComment() { return comment; }
    public void setRating(Integer rating) { this.rating = rating; }
    public void setComment(String comment) { this.comment = comment; }
}
