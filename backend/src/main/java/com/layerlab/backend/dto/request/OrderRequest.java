package com.layerlab.backend.dto.request;

import com.layerlab.backend.entity.OrderType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrderRequest {

    @NotEmpty(message = "La commande doit contenir au moins un article")
    @Valid
    private List<OrderItemRequest> items;

    @NotNull(message = "Le type de commande est obligatoire")
    private OrderType type;

    @NotNull(message = "L'option de livraison est obligatoire")
    private Boolean delivery;

    // Required when delivery = true; validated at service level
    private String deliveryAddress;

    public OrderRequest() {}

    public OrderRequest(List<OrderItemRequest> items, OrderType type,
                        Boolean delivery, String deliveryAddress) {
        this.items = items;
        this.type = type;
        this.delivery = delivery;
        this.deliveryAddress = deliveryAddress;
    }

    public List<OrderItemRequest> getItems() { return items; }
    public OrderType getType() { return type; }
    public Boolean getDelivery() { return delivery; }
    public String getDeliveryAddress() { return deliveryAddress; }

    public void setItems(List<OrderItemRequest> items) { this.items = items; }
    public void setType(OrderType type) { this.type = type; }
    public void setDelivery(Boolean delivery) { this.delivery = delivery; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
}
