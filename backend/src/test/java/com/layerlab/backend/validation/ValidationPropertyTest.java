package com.layerlab.backend.validation;

import com.layerlab.backend.dto.request.*;
import com.layerlab.backend.entity.OrderType;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import net.jqwik.api.*;
import net.jqwik.api.constraints.AlphaChars;
import net.jqwik.api.constraints.IntRange;
import net.jqwik.api.constraints.StringLength;
import org.junit.jupiter.api.Tag;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

/**
 * Property-based tests for input validation (Property 3).
 *
 * Validates: Requirements 1.5, 3.8, 5.4, 11.4
 *
 * Property 3: For any request containing a missing required field or an
 * out-of-constraint value (malformed email, password < 8 chars, rating outside
 * [1,5], price ≤ 0, discount outside [1,100]), the validator must produce at
 * least one constraint violation and must not persist any data.
 */
@Tag("Feature: layerlab-backend, Property 3: Rejet des tâches invalides")
class ValidationPropertyTest {

    private static final Validator VALIDATOR;

    static {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            VALIDATOR = factory.getValidator();
        }
    }

    // -------------------------------------------------------------------------
    // RegisterRequest — email validation
    // -------------------------------------------------------------------------

    /**
     * Property A — Malformed email is rejected:
     * For any string that does not contain '@', RegisterRequest must produce
     * at least one constraint violation on the email field.
     *
     * Validates: Requirement 1.5
     */
    @Property(tries = 100)
    void malformedEmailIsRejected(
            @ForAll @StringLength(min = 1, max = 50) String malformedEmail
    ) {
        Assume.that(!malformedEmail.contains("@"));

        RegisterRequest request = new RegisterRequest(
                "Jean", "Dupont", malformedEmail, "validPass1", "0612345678", "1 rue de la Paix"
        );

        Set<ConstraintViolation<RegisterRequest>> violations = VALIDATOR.validate(request);

        assert violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email"))
                : "Malformed email '" + malformedEmail + "' should produce a violation on the email field";
    }

    /**
     * Property B — Password shorter than 8 characters is rejected:
     * For any password of length 1–7, RegisterRequest must produce at least
     * one constraint violation on the password field.
     *
     * Validates: Requirement 1.5
     */
    @Property(tries = 100)
    void shortPasswordIsRejected(
            @ForAll @StringLength(min = 1, max = 7) String shortPassword
    ) {
        RegisterRequest request = new RegisterRequest(
                "Jean", "Dupont", "valid@example.com", shortPassword, "0612345678", "1 rue de la Paix"
        );

        Set<ConstraintViolation<RegisterRequest>> violations = VALIDATOR.validate(request);

        assert violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password"))
                : "Password of length " + shortPassword.length() + " should produce a violation on the password field";
    }

    /**
     * Property C — Valid RegisterRequest produces no violations:
     * For any password of length ≥ 8, a fully populated RegisterRequest with a
     * valid email must produce zero constraint violations.
     *
     * Validates: Requirement 1.5
     */
    @Property(tries = 100)
    void validRegisterRequestProducesNoViolations(
            @ForAll @AlphaChars @StringLength(min = 8, max = 64) String validPassword
    ) {
        RegisterRequest request = new RegisterRequest(
                "Jean", "Dupont", "valid@example.com", validPassword, "0612345678", "1 rue de la Paix"
        );

        Set<ConstraintViolation<RegisterRequest>> violations = VALIDATOR.validate(request);

        assert violations.isEmpty()
                : "Valid RegisterRequest should produce no violations, but got: " + violations;
    }

    // -------------------------------------------------------------------------
    // ReviewRequest — rating validation
    // -------------------------------------------------------------------------

    /**
     * Property D — Rating below 1 is rejected:
     * For any integer ≤ 0, ReviewRequest must produce at least one constraint
     * violation on the rating field.
     *
     * Validates: Requirement 5.4
     */
    @Property(tries = 100)
    void ratingBelowMinIsRejected(
            @ForAll @IntRange(min = Integer.MIN_VALUE, max = 0) int invalidRating
    ) {
        ReviewRequest request = new ReviewRequest(invalidRating, "Bon produit");

        Set<ConstraintViolation<ReviewRequest>> violations = VALIDATOR.validate(request);

        assert violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("rating"))
                : "Rating " + invalidRating + " should produce a violation on the rating field";
    }

    /**
     * Property E — Rating above 5 is rejected:
     * For any integer ≥ 6, ReviewRequest must produce at least one constraint
     * violation on the rating field.
     *
     * Validates: Requirement 5.4
     */
    @Property(tries = 100)
    void ratingAboveMaxIsRejected(
            @ForAll @IntRange(min = 6, max = Integer.MAX_VALUE) int invalidRating
    ) {
        ReviewRequest request = new ReviewRequest(invalidRating, "Bon produit");

        Set<ConstraintViolation<ReviewRequest>> violations = VALIDATOR.validate(request);

        assert violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("rating"))
                : "Rating " + invalidRating + " should produce a violation on the rating field";
    }

    /**
     * Property F — Valid rating [1,5] produces no violations:
     * For any integer in [1,5], a ReviewRequest with a non-blank comment must
     * produce zero constraint violations.
     *
     * Validates: Requirement 5.4
     */
    @Property(tries = 100)
    void validRatingProducesNoViolations(
            @ForAll @IntRange(min = 1, max = 5) int validRating
    ) {
        ReviewRequest request = new ReviewRequest(validRating, "Bon produit");

        Set<ConstraintViolation<ReviewRequest>> violations = VALIDATOR.validate(request);

        assert violations.isEmpty()
                : "Rating " + validRating + " should produce no violations, but got: " + violations;
    }

    // -------------------------------------------------------------------------
    // ProductRequest — price validation
    // -------------------------------------------------------------------------

    /**
     * Property G — Non-positive price is rejected:
     * For any price ≤ 0, ProductRequest must produce at least one constraint
     * violation on the price field.
     *
     * Validates: Requirement 3.8
     */
    @Property(tries = 100)
    void nonPositivePriceIsRejected(
            @ForAll @IntRange(min = -1000, max = 0) int invalidPriceCents
    ) {
        BigDecimal invalidPrice = BigDecimal.valueOf(invalidPriceCents);

        ProductRequest request = new ProductRequest(
                "Produit Test", "Description", invalidPrice, "Auteur", 1L, 10, null
        );

        Set<ConstraintViolation<ProductRequest>> violations = VALIDATOR.validate(request);

        assert violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("price"))
                : "Price " + invalidPrice + " should produce a violation on the price field";
    }

    /**
     * Property H — Positive price produces no price violation:
     * For any price > 0, ProductRequest with all required fields must not
     * produce a violation on the price field.
     *
     * Validates: Requirement 3.8
     */
    @Property(tries = 100)
    void positivePriceProducesNoPriceViolation(
            @ForAll @IntRange(min = 1, max = 100000) int validPriceCents
    ) {
        BigDecimal validPrice = BigDecimal.valueOf(validPriceCents, 2); // e.g. 100 → 1.00

        ProductRequest request = new ProductRequest(
                "Produit Test", "Description", validPrice, "Auteur", 1L, 10, null
        );

        Set<ConstraintViolation<ProductRequest>> violations = VALIDATOR.validate(request);

        assert violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("price"))
                : "Price " + validPrice + " should not produce a violation on the price field";
    }

    // -------------------------------------------------------------------------
    // PromoCodeRequest — discountPercent validation
    // -------------------------------------------------------------------------

    /**
     * Property I — Discount below 1 is rejected:
     * For any discount ≤ 0, PromoCodeRequest must produce at least one
     * constraint violation on the discountPercent field.
     *
     * Validates: Requirement 11.4
     */
    @Property(tries = 100)
    void discountBelowMinIsRejected(
            @ForAll @IntRange(min = -100, max = 0) int invalidDiscount
    ) {
        PromoCodeRequest request = new PromoCodeRequest(
                "PROMO10", invalidDiscount, LocalDate.now().plusDays(30), true
        );

        Set<ConstraintViolation<PromoCodeRequest>> violations = VALIDATOR.validate(request);

        assert violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("discountPercent"))
                : "Discount " + invalidDiscount + " should produce a violation on the discountPercent field";
    }

    /**
     * Property J — Discount above 100 is rejected:
     * For any discount ≥ 101, PromoCodeRequest must produce at least one
     * constraint violation on the discountPercent field.
     *
     * Validates: Requirement 11.4
     */
    @Property(tries = 100)
    void discountAboveMaxIsRejected(
            @ForAll @IntRange(min = 101, max = 200) int invalidDiscount
    ) {
        PromoCodeRequest request = new PromoCodeRequest(
                "PROMO10", invalidDiscount, LocalDate.now().plusDays(30), true
        );

        Set<ConstraintViolation<PromoCodeRequest>> violations = VALIDATOR.validate(request);

        assert violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("discountPercent"))
                : "Discount " + invalidDiscount + " should produce a violation on the discountPercent field";
    }

    /**
     * Property K — Valid discount [1,100] produces no discountPercent violation:
     * For any discount in [1,100], a PromoCodeRequest with all required fields
     * must not produce a violation on the discountPercent field.
     *
     * Validates: Requirement 11.4
     */
    @Property(tries = 100)
    void validDiscountProducesNoDiscountViolation(
            @ForAll @IntRange(min = 1, max = 100) int validDiscount
    ) {
        PromoCodeRequest request = new PromoCodeRequest(
                "PROMO10", validDiscount, LocalDate.now().plusDays(30), true
        );

        Set<ConstraintViolation<PromoCodeRequest>> violations = VALIDATOR.validate(request);

        assert violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("discountPercent"))
                : "Discount " + validDiscount + " should not produce a violation on the discountPercent field";
    }

    // -------------------------------------------------------------------------
    // OrderRequest — items validation
    // -------------------------------------------------------------------------

    /**
     * Property L — Empty items list is rejected:
     * An OrderRequest with an empty items list must produce at least one
     * constraint violation on the items field.
     *
     * Validates: Requirement 9.1 (items non vide)
     */
    @Property(tries = 10)
    void emptyOrderItemsIsRejected() {
        OrderRequest request = new OrderRequest(List.of(), OrderType.ONLINE, false, null);

        Set<ConstraintViolation<OrderRequest>> violations = VALIDATOR.validate(request);

        assert violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("items"))
                : "Empty items list should produce a violation on the items field";
    }

    /**
     * Property M — Null required fields produce violations:
     * An OrderRequest with null items, type, or delivery must produce at least
     * one constraint violation on the respective field.
     *
     * Validates: Requirement 9.1
     */
    @Property(tries = 10)
    void nullRequiredOrderFieldsAreRejected() {
        OrderRequest request = new OrderRequest(null, null, null, null);

        Set<ConstraintViolation<OrderRequest>> violations = VALIDATOR.validate(request);

        assert violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("items"))
                : "Null items should produce a violation";
        assert violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("type"))
                : "Null type should produce a violation";
        assert violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("delivery"))
                : "Null delivery should produce a violation";
    }
}
