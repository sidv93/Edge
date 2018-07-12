package com.dt.edge.mec.apps.portal.model;

import org.springframework.stereotype.Component;

@Component
public class ErrorMessage {

	public ErrorMessage() {
	}
	public ErrorMessage(String status, String code, String message) {
		super();
		this.status = status;
		this.code = code;
		this.message = message;
	}
	@Override
	public String toString() {
		return "ErrorMessage [status=" + status + ", errorCode=" + code + ", errorMessage=" + message + "]";
	}
	private String status;
	private String code;
	private String message;
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}

}
