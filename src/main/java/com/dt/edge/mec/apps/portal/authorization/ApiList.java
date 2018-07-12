package com.dt.edge.mec.apps.portal.authorization;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
@Component
public class ApiList {
	@Value("#{'${MEC.DevOpstargetAPI}'.split(',')}")
	private  List<String> DevopsTargetApi;
	@Value("#{'${MEC.BillingtargetAPI}'.split(',')}")
	private  List<String> BillingTargetApi;
	@Value("#{'${MEC.CentralRepotargetAPI}'.split(',')}")
	private  List<String> centralrepoTargetApi;
	private Map<String,List<String>> targetApiMap=new HashMap<String,List<String>>();
	@Value("${MEC.MECPORTALBASEURI}")    
	private String MECPORTALBASEURI;
	
	public String getMECPORTALBASEURI() {
		return MECPORTALBASEURI;
	}


	public void setMECPORTALBASEURI(String mECPORTALBASEURI) {
		MECPORTALBASEURI = mECPORTALBASEURI;
	}


	public Map getTargetApiMap() {
		return targetApiMap;
	}


	@PostConstruct
	public void initApiMap()  {
		
		targetApiMap.put("DevOps",DevopsTargetApi);
		targetApiMap.put("Billing",BillingTargetApi);
		targetApiMap.put("CentralRepository",centralrepoTargetApi);
	 
	}

}
