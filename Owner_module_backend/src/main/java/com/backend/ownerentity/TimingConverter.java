package com.backend.ownerentity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TimingConverter implements AttributeConverter<Timing, String> {

    @Override
    public String convertToDatabaseColumn(Timing attribute) {
        return attribute != null ? attribute.name() : null;
    }

    @Override
    public Timing convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        try {
            return Timing.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            return Timing.FULLDAY;
        }
    }
}
