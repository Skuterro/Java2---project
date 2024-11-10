package model;

import jakarta.validation.constraints.NotBlank;
import validation.ValidationMessageConst;

public record ItemSaveForm (
        @NotBlank(message = ValidationMessageConst.NO_NAME) String name,
        @NotBlank(message = ValidationMessageConst.NO_PRICE) Integer price
){

}
