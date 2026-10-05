package com.devtrack.devtrack_backend.controller;

import com.devtrack.devtrack_backend.model.Task;
import com.devtrack.devtrack_backend.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
@Import(ApiExceptionHandler.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TaskService taskService;

    @Test
    void getTasksReturnsTasks() throws Exception {
        Task task = task("Review release", "To Do", "HIGH", LocalDate.of(2030, 1, 2));
        when(taskService.getAllTasks()).thenReturn(List.of(task));

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Review release"))
                .andExpect(jsonPath("$[0].priority").value("HIGH"))
                .andExpect(jsonPath("$[0].dueDate").value("2030-01-02"));
    }

    @Test
    void createTaskAcceptsValidFields() throws Exception {
        when(taskService.createTask(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"Review release","status":"To Do","priority":"HIGH","dueDate":"2030-01-02"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Review release"))
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andExpect(jsonPath("$.dueDate").value("2030-01-02"));

        verify(taskService).createTask(any(Task.class));
    }

    @Test
    void createTaskReturnsFieldErrorsForInvalidFields() throws Exception {
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"   ","status":"Blocked","priority":"URGENT","dueDate":"2000-01-01"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.fieldErrors.title").exists())
                .andExpect(jsonPath("$.fieldErrors.status").exists())
                .andExpect(jsonPath("$.fieldErrors.priority").exists())
                .andExpect(jsonPath("$.fieldErrors.dueDate").exists());

        verifyNoInteractions(taskService);
    }

    @Test
    void createTaskReturnsBadRequestForMalformedDueDate() throws Exception {
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"Review release","status":"To Do","priority":"HIGH","dueDate":"not-a-date"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Request body is invalid"));

        verifyNoInteractions(taskService);
    }

    @Test
    void updateTaskValidatesRequestBody() throws Exception {
        mockMvc.perform(put("/api/tasks/7")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"Review release","status":"Started","priority":"MEDIUM"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.status").exists());

        verifyNoInteractions(taskService);
    }

    @Test
    void updateAndDeleteDelegateToService() throws Exception {
        Task updated = task("Review release", "Done", "MEDIUM", null);
        when(taskService.updateTask(eq(7L), any(Task.class))).thenReturn(updated);

        mockMvc.perform(put("/api/tasks/7")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"Review release","status":"Done","priority":"MEDIUM"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Done"));

        mockMvc.perform(delete("/api/tasks/7"))
                .andExpect(status().isOk());

        verify(taskService).updateTask(eq(7L), any(Task.class));
        verify(taskService).deleteTask(7L);
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