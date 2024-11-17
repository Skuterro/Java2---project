package org.example.backend.item.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import org.example.backend.commons.ValidationMessageConst;

public record ItemSaveForm (
        @NotBlank(message = ValidationMessageConst.NO_NAME) String name,
        @NotBlank(message = ValidationMessageConst.NO_PRICE) Double price,
        @NotEmpty(message = ValidationMessageConst.NO_IMAGE) String imageId
){

}
