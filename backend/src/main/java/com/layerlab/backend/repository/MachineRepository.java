package com.layerlab.backend.repository;

import com.layerlab.backend.entity.Machine;
import com.layerlab.backend.entity.MachineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {

    List<Machine> findByStatus(MachineStatus status);

    long countByStatus(MachineStatus status);
}
