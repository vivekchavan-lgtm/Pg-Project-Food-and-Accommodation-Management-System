package com.backend.ownerentity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class OwnerStatusConverter implements AttributeConverter<OwnerStatus, String> {

    @Override
    public String convertToDatabaseColumn(OwnerStatus attribute) {
        return attribute != null ? attribute.name() : null;
    }

    @Override
    public OwnerStatus convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) return null;
        try {
            return OwnerStatus.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            return OwnerStatus.PENDING; // Default
        }
    }
}
