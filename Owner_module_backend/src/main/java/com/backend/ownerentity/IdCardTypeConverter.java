package com.backend.ownerentity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class IdCardTypeConverter implements AttributeConverter<IdCardType, String> {

    @Override
    public String convertToDatabaseColumn(IdCardType attribute) {
        return attribute != null ? attribute.name() : null;
    }

    @Override
    public IdCardType convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) return null;
        try {
            return IdCardType.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            return IdCardType.AADHAR; // Default
        }
    }
}
