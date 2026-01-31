package com.backend.ownerentity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class MessTypeConverter implements AttributeConverter<MessType, String> {

    @Override
    public String convertToDatabaseColumn(MessType attribute) {
        return attribute != null ? attribute.name() : null;
    }

    @Override
    public MessType convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        try {
            return MessType.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            return MessType.BOTH;
        }
    }
}
