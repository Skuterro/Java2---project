package org.example.backend.dropCase.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import org.example.backend.commons.ValidationMessageConst;

import java.util.List;

public record CaseSaveForm(
    @NotBlank(message = ValidationMessageConst.NO_NAME) String name,
    @NotEmpty(message = ValidationMessageConst.NO_ITEMS) List<String> itemsIds
) {
}
