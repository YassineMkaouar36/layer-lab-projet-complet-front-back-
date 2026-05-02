package com.layerlab.backend.repository;

import com.layerlab.backend.entity.LoyaltyLevel;
import com.layerlab.backend.entity.LoyaltyOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoyaltyOfferRepository extends JpaRepository<LoyaltyOffer, Long> {

    List<LoyaltyOffer> findByLevel(LoyaltyLevel level);
}
