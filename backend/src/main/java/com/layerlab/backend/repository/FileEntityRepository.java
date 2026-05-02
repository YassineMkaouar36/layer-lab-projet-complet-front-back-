package com.layerlab.backend.repository;

import com.layerlab.backend.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileEntityRepository extends JpaRepository<FileEntity, Long> {

    List<FileEntity> findByUploadedById(Long userId);

    @Query("SELECT COALESCE(SUM(f.size), 0) FROM FileEntity f WHERE f.uploadedBy.id = :userId")
    Long sumSizeByUploadedById(@Param("userId") Long userId);
}
