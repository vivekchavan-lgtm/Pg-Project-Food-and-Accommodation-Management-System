package com.backend.ownerentity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class OwnerTypeConverter implements AttributeConverter<OwnerType, String> {

    @Override
    public String convertToDatabaseColumn(OwnerType attribute) {
        return attribute != null ? attribute.name() : null;
    }

    @Override
    public OwnerType convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) return null;
        try {
            return OwnerType.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            return OwnerType.PG; // Default
        }
    }
}
