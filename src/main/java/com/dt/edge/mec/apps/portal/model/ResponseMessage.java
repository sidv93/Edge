package com.dt.edge.mec.apps.portal.model;

import org.springframework.stereotype.Component;

@Component
public class ResponseMessage {
private String code;
private String message;
private String status;
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
public String getStatus() {
	return status;
}
public void setStatus(String status) {
	this.status = status;
}
@Override
public String toString() {
	return "ResponseMessage [code=" + code + ", message=" + message + ", status=" + status + "]";
}
public ResponseMessage(String code, String message, String status) {
	super();
	this.code = code;
	this.message = message;
	this.status = status;
}
public ResponseMessage() {
	super();
}

}
