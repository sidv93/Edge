package com.dt.edge.mec.apps.portal.model;

public class BillingPojo {
    private String userId;
    private int onBoardingCharge;
    private String microServiceName;
    private String applicationName;
    
    
    public String getMicroServiceName() {
        return microServiceName;
    }
    public void setMicroServiceName(String microServiceName) {
        this.microServiceName = microServiceName;
    }
    public String getApplicationName() {
        return applicationName;
    }
    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public int getOnBoardingCharge() {
        return onBoardingCharge;
    }
    public void setOnBoardingCharge(int onBoardingCharge) {
        this.onBoardingCharge = onBoardingCharge;
    }
        


}
