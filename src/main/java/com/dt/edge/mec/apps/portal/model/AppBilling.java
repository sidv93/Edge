package com.dt.edge.mec.apps.portal.model;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope("prototype")
public class AppBilling  extends BillingPojo{

	@Override
	public String toString() {
		return "AppBilling [getMicroServiceId()=" + getMicroServiceName() + ", getAppName()=" + getApplicationName()
				+ ", getUserID()=" + getUserId() + ", getOnboardingCharge()=" + getOnBoardingCharge() + "]";
	}
	
	
	

}
