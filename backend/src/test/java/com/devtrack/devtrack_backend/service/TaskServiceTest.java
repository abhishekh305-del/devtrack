package com.devtrack.devtrack_backend.service;

import com.devtrack.devtrack_backend.model.Task;
import com.devtrack.devtrack_backend.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void getAllTasksReturnsRepositoryTasks() {
        List<Task> tasks = List.of(task("Review release", "To Do", "HIGH", null));
        when(taskRepository.findAll()).thenReturn(tasks);

        assertSame(tasks, taskService.getAllTasks());
    }

    @Test
    void createTaskSavesTask() {
        Task task = task("Review release", "To Do", "HIGH", null);
        when(taskRepository.save(task)).thenReturn(task);

        assertSame(task, taskService.createTask(task));
        verify(taskRepository).save(task);
    }

    @Test
    void updateTaskCopiesAllFieldsAndSaves() {
        Task existing = task("Old title", "To Do", "LOW", null);
        Task update = task("New title", "In Progress", "HIGH", LocalDate.of(2030, 1, 2));
        when(taskRepository.findById(7L)).thenReturn(Optional.of(existing));
        when(taskRepository.save(existing)).thenReturn(existing);

        Task result = taskService.updateTask(7L, update);

        assertSame(existing, result);
        assertEquals("New title", result.getTitle());
        assertEquals("In Progress", result.getStatus());
        assertEquals("HIGH", result.getPriority());
        assertEquals(LocalDate.of(2030, 1, 2), result.getDueDate());
        verify(taskRepository).save(existing);
    }

    @Test
    void updateTaskThrowsWhenTaskDoesNotExist() {
        when(taskRepository.findById(7L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> taskService.updateTask(7L, task("Title", "To Do", "LOW", null)));
        verify(taskRepository, never()).save(any());
    }

    @Test
    void deleteTaskDeletesExistingTask() {
        when(taskRepository.existsById(7L)).thenReturn(true);

        taskService.deleteTask(7L);

        verify(taskRepository).deleteById(7L);
    }

    @Test
    void deleteTaskThrowsWhenTaskDoesNotExist() {
        when(taskRepository.existsById(7L)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> taskService.deleteTask(7L));
        verify(taskRepository, never()).deleteById(anyLong());
    }

    private Task task(String title, String status, String priority, LocalDate dueDate) {
        Task task = new Task();
        task.setTitle(title);
        task.setStatus(status);
        task.setPriority(priority);
        task.setDueDate(dueDate);
        return task;
    }
}