package com.layerlab.backend.property;

import com.layerlab.backend.dto.response.ErrorResponse;
import com.layerlab.backend.exception.*;
import net.jqwik.api.*;
import net.jqwik.api.constraints.AlphaChars;
import net.jqwik.api.constraints.StringLength;
import org.junit.jupiter.api.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * Property-based tests for uniform error response structure (Property 11).
 *
 * Validates: Requirement 14.1
 *
 * Property 11: For every exception thrown by the API, the JSON response must
 * contain exactly the fields {@code status}, {@code message}, {@code timestamp}
 * and {@code path}, with an HTTP code consistent with the error type.
 */
@Tag("Feature: layerlab-backend, Property 11: Structure uniforme des réponses d'erreur")
class ErrorResponsePropertyTest {

    private static final GlobalExceptionHandler HANDLER = new GlobalExceptionHandler();

    // -------------------------------------------------------------------------
    // Helper
    // -------------------------------------------------------------------------

    /**
     * Returns the set of declared field names of {@link ErrorResponse}.
     * Used to assert that the DTO exposes exactly the four expected fields.
     */
    private static Set<String> errorResponseFieldNames() {
        Set<String> names = new java.util.HashSet<>();
        for (Field f : ErrorResponse.class.getDeclaredFields()) {
            names.add(f.getName());
        }
        return names;
    }

    /**
     * Asserts that a {@link ResponseEntity<ErrorResponse>} body is non-null and
     * that all four required fields are populated.
     */
    private static void assertUniformStructure(ResponseEntity<ErrorResponse> response,
                                               HttpStatus expectedStatus,
                                               String expectedPath) {
        assert response != null : "Response must not be null";
        assert response.getStatusCode() == expectedStatus
                : "Expected HTTP " + expectedStatus + " but got " + response.getStatusCode();

        ErrorResponse body = response.getBody();
        assert body != null : "Response body must not be null";

        // --- field: status ---
        assert body.getStatus() != null : "Field 'status' must not be null";
        assert body.getStatus() == expectedStatus.value()
                : "Field 'status' must equal " + expectedStatus.value() + " but was " + body.getStatus();

        // --- field: message ---
        assert body.getMessage() != null : "Field 'message' must not be null";
        assert !body.getMessage().isEmpty() : "Field 'message' must not be empty";

        // --- field: timestamp ---
        assert body.getTimestamp() != null : "Field 'timestamp' must not be null";
        assert !body.getTimestamp().isAfter(LocalDateTime.now())
                : "Field 'timestamp' must not be in the future";

        // --- field: path ---
        assert body.getPath() != null : "Field 'path' must not be null";
        assert body.getPath().equals(expectedPath)
                : "Field 'path' must equal '" + expectedPath + "' but was '" + body.getPath() + "'";

        // --- structural completeness: exactly the four expected fields ---
        Set<String> fields = errorResponseFieldNames();
        assert fields.contains("status") : "ErrorResponse must declare field 'status'";
        assert fields.contains("message") : "ErrorResponse must declare field 'message'";
        assert fields.contains("timestamp") : "ErrorResponse must declare field 'timestamp'";
        assert fields.contains("path") : "ErrorResponse must declare field 'path'";
        assert fields.size() == 4
                : "ErrorResponse must contain exactly 4 fields but found: " + fields;
    }

    // -------------------------------------------------------------------------
    // Property A — ResourceNotFoundException → HTTP 404
    // -------------------------------------------------------------------------

    /**
     * Property A — ResourceNotFoundException produces HTTP 404 with uniform structure:
     * For any non-blank message and any path, handling a ResourceNotFoundException
     * must return HTTP 404 with all four required fields populated.
     *
     * Validates: Requirement 14.1
     */
    @Property(tries = 100)
    void resourceNotFoundExceptionProduces404WithUniformStructure(
            @ForAll @AlphaChars @StringLength(min = 1, max = 200) String message,
            @ForAll @AlphaChars @StringLength(min = 1, max = 100) String path
    ) {
        ResourceNotFoundException ex = new ResourceNotFoundException(message);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/" + path);

        ResponseEntity<ErrorResponse> response = HANDLER.handleResourceNotFoundException(ex, request);

        assertUniformStructure(response, HttpStatus.NOT_FOUND, "/" + path);
        assert response.getBody().getMessage().equals(message)
                : "Message must equal the exception message";
    }

    // -------------------------------------------------------------------------
    // Property B — ConflictException → HTTP 409
    // -------------------------------------------------------------------------

    /**
     * Property B — ConflictException produces HTTP 409 with uniform structure:
     * For any non-blank message and any path, handling a ConflictException
     * must return HTTP 409 with all four required fields populated.
     *
     * Validates: Requirement 14.1
     */
    @Property(tries = 100)
    void conflictExceptionProduces409WithUniformStructure(
            @ForAll @AlphaChars @StringLength(min = 1, max = 200) String message,
            @ForAll @AlphaChars @StringLength(min = 1, max = 100) String path
    ) {
        ConflictException ex = new ConflictException(message);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/" + path);

        ResponseEntity<ErrorResponse> response = HANDLER.handleConflictException(ex, request);

        assertUniformStructure(response, HttpStatus.CONFLICT, "/" + path);
        assert response.getBody().getMessage().equals(message)
                : "Message must equal the exception message";
    }

    // -------------------------------------------------------------------------
    // Property C — ForbiddenException → HTTP 403
    // -------------------------------------------------------------------------

    /**
     * Property C — ForbiddenException produces HTTP 403 with uniform structure:
     * For any non-blank message and any path, handling a ForbiddenException
     * must return HTTP 403 with all four required fields populated.
     *
     * Validates: Requirement 14.1
     */
    @Property(tries = 100)
    void forbiddenExceptionProduces403WithUniformStructure(
            @ForAll @AlphaChars @StringLength(min = 1, max = 200) String message,
            @ForAll @AlphaChars @StringLength(min = 1, max = 100) String path
    ) {
        ForbiddenException ex = new ForbiddenException(message);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/" + path);

        ResponseEntity<ErrorResponse> response = HANDLER.handleForbiddenException(ex, request);

        assertUniformStructure(response, HttpStatus.FORBIDDEN, "/" + path);
        assert response.getBody().getMessage().equals(message)
                : "Message must equal the exception message";
    }

    // -------------------------------------------------------------------------
    // Property D — UnprocessableEntityException → HTTP 422
    // -------------------------------------------------------------------------

    /**
     * Property D — UnprocessableEntityException produces HTTP 422 with uniform structure:
     * For any non-blank message and any path, handling an UnprocessableEntityException
     * must return HTTP 422 with all four required fields populated.
     *
     * Validates: Requirement 14.1
     */
    @Property(tries = 100)
    void unprocessableEntityExceptionProduces422WithUniformStructure(
            @ForAll @AlphaChars @StringLength(min = 1, max = 200) String message,
            @ForAll @AlphaChars @StringLength(min = 1, max = 100) String path
    ) {
        UnprocessableEntityException ex = new UnprocessableEntityException(message);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/" + path);

        ResponseEntity<ErrorResponse> response = HANDLER.handleUnprocessableEntityException(ex, request);

        assertUniformStructure(response, HttpStatus.UNPROCESSABLE_ENTITY, "/" + path);
        assert response.getBody().getMessage().equals(message)
                : "Message must equal the exception message";
    }

    // -------------------------------------------------------------------------
    // Property E — Generic Exception (catch-all) → HTTP 500
    // -------------------------------------------------------------------------

    /**
     * Property E — Generic Exception produces HTTP 500 with uniform structure:
     * For any message and any path, handling a generic Exception must return
     * HTTP 500 with all four required fields populated.
     * The message field contains a generic internal error message
     * (the original exception message is not exposed to the client).
     *
     * Validates: Requirement 14.1
     */
    @Property(tries = 100)
    void genericExceptionProduces500WithUniformStructure(
            @ForAll @AlphaChars @StringLength(min = 1, max = 200) String message,
            @ForAll @AlphaChars @StringLength(min = 1, max = 100) String path
    ) {
        Exception ex = new Exception(message);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/" + path);

        ResponseEntity<ErrorResponse> response = HANDLER.handleGenericException(ex, request);

        assertUniformStructure(response, HttpStatus.INTERNAL_SERVER_ERROR, "/" + path);
        // For 500, the handler returns a generic message (not the raw exception message)
        assert response.getBody().getMessage() != null && !response.getBody().getMessage().isEmpty()
                : "Field 'message' must not be empty for 500 responses";
    }

    // -------------------------------------------------------------------------
    // Property F — HTTP status code is consistent with exception type
    // -------------------------------------------------------------------------

    /**
     * Property F — HTTP status code is consistent with exception type:
     * For any non-blank message and path, the HTTP status code in the response
     * body must match the HTTP status code of the ResponseEntity, and must be
     * the expected code for each exception type.
     *
     * Validates: Requirement 14.1
     */
    @Property(tries = 100)
    void httpStatusCodeIsConsistentWithExceptionType(
            @ForAll @AlphaChars @StringLength(min = 1, max = 100) String message,
            @ForAll @AlphaChars @StringLength(min = 1, max = 50) String path
    ) {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/" + path);

        // ResourceNotFoundException → 404
        ResponseEntity<ErrorResponse> r404 = HANDLER.handleResourceNotFoundException(
                new ResourceNotFoundException(message), request);
        assert r404.getStatusCode().value() == r404.getBody().getStatus()
                : "HTTP status code must match body.status for 404";
        assert r404.getStatusCode().value() == 404 : "ResourceNotFoundException must map to 404";

        // ConflictException → 409
        ResponseEntity<ErrorResponse> r409 = HANDLER.handleConflictException(
                new ConflictException(message), request);
        assert r409.getStatusCode().value() == r409.getBody().getStatus()
                : "HTTP status code must match body.status for 409";
        assert r409.getStatusCode().value() == 409 : "ConflictException must map to 409";

        // ForbiddenException → 403
        ResponseEntity<ErrorResponse> r403 = HANDLER.handleForbiddenException(
                new ForbiddenException(message), request);
        assert r403.getStatusCode().value() == r403.getBody().getStatus()
                : "HTTP status code must match body.status for 403";
        assert r403.getStatusCode().value() == 403 : "ForbiddenException must map to 403";

        // UnprocessableEntityException → 422
        ResponseEntity<ErrorResponse> r422 = HANDLER.handleUnprocessableEntityException(
                new UnprocessableEntityException(message), request);
        assert r422.getStatusCode().value() == r422.getBody().getStatus()
                : "HTTP status code must match body.status for 422";
        assert r422.getStatusCode().value() == 422 : "UnprocessableEntityException must map to 422";

        // Generic Exception → 500
        ResponseEntity<ErrorResponse> r500 = HANDLER.handleGenericException(
                new Exception(message), request);
        assert r500.getStatusCode().value() == r500.getBody().getStatus()
                : "HTTP status code must match body.status for 500";
        assert r500.getStatusCode().value() == 500 : "Generic Exception must map to 500";
    }
}
