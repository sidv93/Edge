package com.dt.edge.mec.apps.portal.errorhandler;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ErrorCodes {
	@Value("#{'${MEC.CentralrepositoryErrorStatus}'.split(',')}")
	private List<String> centralRepositoryErrorStatus;
	@Value("#{'${MEC.BillingErrorStatus}'.split(',')}")
	private List<String> billingErrorStatus;
	@Value("#{'${MEC.DevopsErrorStatus}'.split(',')}")
	private List<String> devopsErrorStatus;
	@Value("#{'${MEC.IAMERRORSTATUSCODES}'.split(',')}")
	private List<String> IamErrorStatus;
	@Value("#{'${MEC.LLOErrorStatus}'.split(',')}")
    private List<String> LLOErrorStatus;
	@Value("#{'${MEC.SMSErrorStatus}'.split(',')}")
    private List<String> smsErrorStatus;
	@Value("#{'${MEC.FMSErrorStatus}'.split(',')}")
    private List<String> fmsErrorStatus;
	@Value("#{'${MEC.ErrorStatus}'.split(',')}")
    private List<String> errorStatus;
	
	public List<String> getErrorStatus() {
		return errorStatus;
	}
	public void setErrorStatus(List<String> errorStatus) {
		this.errorStatus = errorStatus;
	}
	public List<String> getFmsErrorStatus() {
		return fmsErrorStatus;
	}
	public void setFmsErrorStatus(List<String> fmsErrorStatus) {
		this.fmsErrorStatus = fmsErrorStatus;
	}
	
	public List<String> getSmsErrorStatus() {
		return smsErrorStatus;
	}
	public void setSmsErrorStatus(List<String> smsErrorStatus) {
		this.smsErrorStatus = smsErrorStatus;
	}
	public List<String> getLLOErrorStatus() {
        return LLOErrorStatus;
    }
    public void setLLOErrorStatus(List<String> lLOErrorStatus) {
        LLOErrorStatus = lLOErrorStatus;
    }
    public List<String> getIamErrorStatus() {
		return IamErrorStatus;
	}
	public void setIamErrorStatus(List<String> iamErrorStatus) {
		IamErrorStatus = iamErrorStatus;
	}
	public ErrorCodes() {
		super();
	}
	public List<String> getCentralRepositoryErrorStatus() {
		return centralRepositoryErrorStatus;
	}
	public void setCentralRepositoryErrorStatus(List<String> centralRepositoryErrorStatus) {
		this.centralRepositoryErrorStatus = centralRepositoryErrorStatus;
	}
	public List<String> getBillingErrorStatus() {
		return billingErrorStatus;
	}
	public void setBillingErrorStatus(List<String> billingErrorStatus) {
		this.billingErrorStatus = billingErrorStatus;
	}
	public List<String> getDevopsErrorStatus() {
		return devopsErrorStatus;
	}
	public void setDevopsErrorStatus(List<String> devopsErrorStatus) {
		this.devopsErrorStatus = devopsErrorStatus;
	}
	
}
