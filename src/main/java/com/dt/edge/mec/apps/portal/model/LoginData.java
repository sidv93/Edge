package com.dt.edge.mec.apps.portal.model;

public class LoginData {
  private LoginModel loginModel;

public LoginModel getLoginModel() {
	return loginModel;
}

public void setLoginModel(LoginModel loginModel) {
	this.loginModel = loginModel;
}

@Override
public String toString() {
	return "LoginData [loginModel=" + loginModel + "]";
}
}
