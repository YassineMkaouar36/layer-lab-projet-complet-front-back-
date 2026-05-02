package com.layerlab.backend.repository;

import com.layerlab.backend.entity.Filament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FilamentRepository extends JpaRepository<Filament, Long> {
}
