package org.example.backend.item;

import jakarta.validation.constraints.NotBlank;
import org.example.backend.commons.ValidationMessageConst;

public record ItemSaveForm (
        @NotBlank(message = ValidationMessageConst.NO_NAME) String name,
        @NotBlank(message = ValidationMessageConst.NO_PRICE) Integer price
){

}
