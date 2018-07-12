package com.dt.edge.mec.apps.portal.controller;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.apps.portal.utility.GetBaseUrl;


@RestController
public class VMIController { 
	
	 private final Logger logger =
	            LogManager.getLogger(VMIController.class.getName());
	 
	 @Value("#{${MEC.MODULENAMEMAP}}")
	 private Map<String, String> moduleNameMap;
	 
	 private String vmiUrl;
	 
	 @Autowired
	 private GetBaseUrl baseUrl;
	 
	 @PostConstruct
	 private void init(){
	        vmiUrl=moduleNameMap.get("USAGEMODULE");
	        logger.info(" /**** get VMI URL ***/ "+getusagebaseUri());
	 }
	 
	 private String getusagebaseUri(){
			return baseUrl.getBaseUri(vmiUrl);
	 }
	 
	@RequestMapping(value = "/getVMIPayLoad", method = RequestMethod.GET)
    	public  ResponseEntity<?> getClientReport() throws Exception {
    		logger.info("<<<< VMIController - getClientReport >>>>");       
    		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		ResponseEntity<String> responseEntity = null;
		RestTemplate restTemplateUsage = new RestTemplate();
		
		try{
			HttpEntity<?> entity = new HttpEntity<>(headers);
			UriComponentsBuilder builder =null;
	        	//builder = UriComponentsBuilder.fromHttpUrl("http://172.19.74.234:8081/api/UA/v1.1/getVMIPayLoad");
			builder = UriComponentsBuilder.fromHttpUrl(getusagebaseUri()+"api/UA/v1.1/getVMIPayLoad");
	         	System.out.println("Url triggered for get vmi client report: "+builder.build().encode().toUri());
             		responseEntity = restTemplateUsage.exchange(builder.build().encode().toUri(), 
                	HttpMethod.GET, entity, String.class);	
        	}
		catch(Exception e){
			if(e instanceof MECException)
				throw e;
			throw new MECException("Server Error", "Server Error", "Failure", HttpStatus.FAILED_DEPENDENCY);
		}
		return new ResponseEntity<String>(responseEntity.getBody().toString(),HttpStatus.OK) ;
	} 
  
}
