package com.devtrack.devtrack_backend.repository;

import com.devtrack.devtrack_backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}