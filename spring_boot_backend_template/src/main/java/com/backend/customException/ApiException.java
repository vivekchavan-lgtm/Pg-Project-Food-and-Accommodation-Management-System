package com.backend.customException;

public class ApiException extends RuntimeException{
public ApiException(String msg)
{
	super(msg);
}
}
