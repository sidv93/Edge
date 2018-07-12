package com.dt.edge.mec.apps.portal.utility;

import java.io.IOException;
import java.util.HashMap;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.dt.edge.mec.apps.portal.helper.OnBoardRequestHelper;
import com.dt.edge.mec.apps.portal.model.AppBilling;
import com.dt.edge.mec.apps.portal.model.MicroServiceBilling;
import com.dt.edge.mec.apps.portal.model.UpdateBillingRates;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class OnBoardUtils {
	@Autowired
	private MicroServiceBilling microServiceBilling;
	@Autowired
	private AppBilling appbilling;
	@Autowired
	private UpdateBillingRates updateBillingRates;
	@Value("${MEC.creditValue}")
	private String credit;
	private static final String CREDITSDOWNLOAD="creditsForDownload";
	private final Logger logger = LogManager.getLogger(OnBoardRequestHelper.class.getName());
	@SuppressWarnings("unchecked")
	public  <T> T stringToObject(String string, T obj) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			obj = (T) mapper.readValue(string, obj.getClass());
		} catch (JsonParseException e) {
			logger.debug("Exception "+e);
		} catch (JsonMappingException e) {
			logger.debug("Exception "+e);
		} catch (IOException e) {
			logger.debug("Exception "+e);
		}
		return obj;
	}
	
public String createJasonForBilling(HashMap<?, ?> json,String url){
		
		if(url.contains("/onboard/microservice")){
			microServiceBilling.setUserId((String) json.get("userId"));
			microServiceBilling.setMicroServiceName((String)json.get("microServiceName"));
			microServiceBilling.setOnBoardingCharge(Integer.parseInt(credit));
			microServiceBilling.setApplicationName("");
			microServiceBilling.setCreditsPerAPICall(Integer.parseInt((String) json.get("creditsPerAPICall")));
			if((String)json.get(CREDITSDOWNLOAD) != null)
			microServiceBilling.setCreditsForDownload(Integer.parseInt((String)json.get(CREDITSDOWNLOAD)));
			return ObjectToJsonString(microServiceBilling);
		}else if(url.contains("/onboard/application")){
			appbilling.setUserId((String) json.get("userId"));
			appbilling.setApplicationName((String)json.get("applicationName"));
			appbilling.setOnBoardingCharge(Integer.parseInt(credit));
			appbilling.setMicroServiceName("");
			return ObjectToJsonString(appbilling);
		}
		return null;
	
	}
public String createJasonForBilling(HashMap<?, ?> json){
	updateBillingRates.setUserId((String) json.get("userId"));
	updateBillingRates.setMicroServiceName((String)json.get("microServiceName"));
	if(json.get("creditsPerAPICall") != null){
		
	
	    updateBillingRates.setCreditsPerAPICall(((Integer)json.get("creditsPerAPICall")));
	}
	    if(json.get(CREDITSDOWNLOAD) != null){
	    updateBillingRates.setCreditsForDownload(((Integer)json.get(CREDITSDOWNLOAD)));
	    }
	    return ObjectToJsonString(updateBillingRates);
	

}
public String ObjectToJsonString(Object obj){
	ObjectMapper mapper = new ObjectMapper();
	String jsonInString=null;
	try {
		jsonInString = mapper.writeValueAsString(obj);
	} catch (JsonProcessingException e) {
		logger.debug("JsonProcessingException : converting object to string "+e);
	}
	
	return jsonInString;
}
}
