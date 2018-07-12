package com.dt.edge.mec.apps.portal.errorhandler;

import java.io.IOException;

import org.springframework.http.HttpStatus;

public class MECException extends IOException{  
private static final long serialVersionUID = -4392920165730556530L;
private String errorMsg;
private String errorCode;
private String status;
private HttpStatus httpStatus;
public MECException(String s){  
	  super(s);  
	  }
public MECException(String errorMsg, String errorCode, String status, HttpStatus httpStatus) {
	super();
	this.errorMsg = errorMsg;
	this.errorCode = errorCode;
	this.status = status;
	this.httpStatus = httpStatus;
}
public String getErrorMsg() {
	return errorMsg;
}
public void setErrorMsg(String errorMsg) {
	this.errorMsg = errorMsg;
}
public String getErrorCode() {
	return errorCode;
}
public void setErrorCode(String errorCode) {
	this.errorCode = errorCode;
}
public String getStatus() {
	return status;
}
public void setStatus(String status) {
	this.status = status;
}
public HttpStatus getHttpStatus() {
	return httpStatus;
}
public void setHttpStatus(HttpStatus httpStatus) {
	this.httpStatus = httpStatus;
}

}