package pl.blowcase.model;

import jakarta.validation.constraints.NotBlank;
import pl.blowcase.ValidationMessageConst;

public record ItemSaveForm (
        @NotBlank(message = ValidationMessageConst.NO_NAME) String name,
        @NotBlank(message = ValidationMessageConst.NO_PRICE) Integer price
){

}
