package com.dt.edge.mec.apps.portal.model;

import java.util.List;

public class LoginModel {
private String id;
private List<String> userType;
private String username;
private String password;
private String client_id;
private String response_type;
private String companyName;
private int sessionTimeout;
private String accessToken;

public String getAccessToken() {
	return accessToken;
}
public void setAccessToken(String accessToken) {
	this.accessToken = accessToken;
}
public int getSessionTimeout() {
	return sessionTimeout;
}
public void setSessionTimeout(int sessionTimeout) {
	this.sessionTimeout = sessionTimeout;
}
public String getCompanyName() {
    return companyName;
}
public void setCompanyName(String companyName) {
    this.companyName = companyName;
}
public String getId() {
	return id;
}
public void setId(String id) {
	this.id = id;
}



public List<String> getUserType() {
	return userType;
}
public void setUserType(List<String> userType) {
	this.userType = userType;
}
public String getClient_id() {
	return client_id;
}
public void setClient_id(String client_id) {
	this.client_id = client_id;
}
public String getResponse_type() {
	return response_type;
}
public void setResponse_type(String response_type) {
	this.response_type = response_type;
}
public String getUsername() {
	return username;
}
public void setUsername(String username) {
	this.username = username;
}
public String getPassword() {
	return password;
}
public void setPassword(String password) {
	this.password = password;
}
@Override
public String toString() {
	return "LoginModel [username=" + username + ", password=" + password + "]";
}

}
