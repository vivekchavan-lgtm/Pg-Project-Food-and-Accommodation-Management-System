package com.backend.customException;

public class ResourceNotFound extends RuntimeException{
	
	public ResourceNotFound(String msg) {
		super(msg);
	}

}
