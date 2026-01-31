package com.backend.ownerentity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class PgTypeConverter implements AttributeConverter<PgType, String> {

    @Override
    public String convertToDatabaseColumn(PgType attribute) {
        return attribute != null ? attribute.name() : null;
    }

    @Override
    public PgType convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        try {
            return PgType.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Fallback to BOTH if unknown value like "Both" or "both" is found
            return PgType.BOTH;
        }
    }
}
