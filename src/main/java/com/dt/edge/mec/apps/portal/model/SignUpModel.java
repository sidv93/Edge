package com.dt.edge.mec.apps.portal.model;

import java.util.List;

public class SignUpModel {
	@Override
	public String toString() {
		return "SignUpModel [firstName=" + firstName + ", lastName=" + lastName + ", username=" + username
				+ ", emailId=" + emailId + ", password=" + password + ", retypePassword=" + retypePassword
				+ ", country=" + country + ", state=" + state + ", companyName=" + companyName + ", signingUpFor="
				+ signingUpFor + "]";
	}

	private String userId;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	private String firstName;
	private String lastName;
	private String emailId;
	private String password;
	private String retypePassword;
	private String country;
	private String state;
	private String companyName;
	private List<String> signingUpFor;
	private String credits;
	private String username;
	private String status;

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getCredits() {
		return credits;
	}

	public void setCredits(String credits) {
		this.credits = credits;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRetypePassword() {
		return retypePassword;
	}

	public void setRetypePassword(String retypePassword) {
		this.retypePassword = retypePassword;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public List<String> getSigningUpFor() {
		return signingUpFor;
	}

	public void setSigningUpFor(List<String> signingUpFor) {
		this.signingUpFor = signingUpFor;
	}

}
