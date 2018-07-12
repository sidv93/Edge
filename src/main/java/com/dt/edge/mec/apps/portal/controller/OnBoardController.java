package com.dt.edge.mec.apps.portal.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.apps.portal.helper.OnBoardRequestHelper;
import com.dt.edge.mec.apps.portal.model.ResponseMessage;
import com.dt.edge.mec.apps.portal.utility.OnBoardUtils;


@RestController
public class OnBoardController {	
	@Autowired
	private OnBoardRequestHelper requestHandler;
	@Autowired
	private OnBoardUtils  boardUtils;
	private final Logger logger = LogManager.getLogger(OnBoardController.class.getName());
	private String type ="notype";
	private static final String ACCEPT_HEADER= "Accept=application/json";
	private static final String SERVERERRORSTRING="Server Error";
	/**
	 * 
	 * @param userId
	 * @return
	 * @throws MECException
	 */
	@RequestMapping(value={"application/onboard/validateCredits/{userId}","microservice/onboard/validateCredits/{userId}"},method=RequestMethod.GET,headers= ACCEPT_HEADER)
	public ResponseEntity<?> creditStatus(@PathVariable("userId") String userId) throws MECException{
		logger.info("Credit request is coming from User" +userId );
		ResponseEntity<?> response=requestHandler.isSufficientCreditAvailable(userId);
		logger.info("Checking validation of credit " +response );
		return response;
	}
	
	/**
	 * 
	 * @param microservicesName
	 * @return
	 * @throws MECException
	 */
	@RequestMapping(value={"application/onboard/validateName","microservice/onboard/validateName"},method=RequestMethod.POST,headers= ACCEPT_HEADER)
   public ResponseEntity<?> mincroServicesName(@RequestBody Map<String,String> httpEntity) throws MECException{
		ResponseEntity<?> response=null;
		response=requestHandler.validate(type,httpEntity);
		
		logger.info("response after validation service name "+response);
		return response;
	}

	@RequestMapping(value = { "/onboard/applications",
			"/onboard/microservices"}, method = RequestMethod.POST, headers =  ACCEPT_HEADER)
	public ResponseEntity<?> submittingSummary(@RequestBody Object httpEntity, HttpServletRequest request)
			throws Exception {
		logger.info("<<<<<<POST senario submittingSummary>>>>" );
		String url = request.getRequestURI();
		HashMap jsonMap = (HashMap) httpEntity;
		String jsonForbilling = boardUtils.createJasonForBilling(jsonMap, url);
		String Jason = boardUtils.ObjectToJsonString(jsonMap);
		logger.info("Data to be saved: " + Jason);
		ResponseEntity<?> response=null;
		try{
		 response = requestHandler.saveMetaData(Jason,null,url);
		 logger.info("Response after saving date to central repository" +response);
		 ResponseEntity<?> responseDOP = requestHandler.forWardToDevops(Jason,null,url,"");
		 logger.info("Response from DevOPS" +responseDOP);
		 ResponseEntity<?> responseBilling = requestHandler.forwardTobillingSection(jsonForbilling,request.getMethod());
		 logger.info("devop is ok sending request to billing" +responseBilling);
		 if (responseBilling.getStatusCode().equals(HttpStatus.OK)) {
			response=new ResponseEntity<>(
						new ResponseMessage(HttpStatus.OK.toString(), "Status of DevOps", "pending"),
						HttpStatus.OK);
			} 
		}catch(Exception e){
			if(e instanceof MECException){
				requestHandler.deleteMetadata(jsonMap,url);
				throw e;
			}
			logger.info("Caught Exception"+e.getMessage());
			throw new MECException(SERVERERRORSTRING, SERVERERRORSTRING, "Failure", HttpStatus.FAILED_DEPENDENCY);
		}
		
		/*
		 * below line comment because error senario was not handle properly
		 */
		/*if (response.getStatusCode().equals(HttpStatus.OK)) {
			// return new ResponseEntity<>(summarysubmit,HttpStatus.OK);
			ResponseEntity<?> responseDOP = requestHandler.forWardToDevops(Jason,null,url);
			// send request to Deop platform if sucess trigger billing module
			// credit comsume
			if (responseDOP.getStatusCode().equals(HttpStatus.OK)) {
				logger.info("devop is ok sending request to billing");
				ResponseEntity<?> responseBilling = requestHandler.forwardTobillingSection(jsonForbilling); // passing json for billing module																											
				if (responseBilling.getStatusCode().equals(HttpStatus.OK)) {
					// String message = "{\"status\":\"pending\"}";
					return new ResponseEntity<>(
							new ResponseMessage(HttpStatus.OK.toString(), "Status of DevOps", "pending"),
							HttpStatus.OK);
				} else {
					logger.info("Deleting meta Data " + Jason);
					requestHandler.deleteMetadata(jsonMap,url);
					//requestHandler.requestToDeleteSaveMetaData(microServicesName.getMicroServiceName());
				}
			} else {
				logger.info("Deleting meta Data " + Jason +  " because request to DevOP failed");
				requestHandler.deleteMetadata(jsonMap,url);
				//requestHandler.requestToDeleteSaveMetaData(microServicesName.getMicroServiceName());
				// if faile sent request CR to Delete meta data
			}
		}*/
		logger.info("<<<<<<POST senario submittingSummary>>>>" );
		return response;
	}
	
	@RequestMapping(value = { "/onboard/applications/{name}",
			"/onboard/microservices/{name}"}, method = RequestMethod.PUT, headers =  ACCEPT_HEADER)
	public ResponseEntity<?> submittingEdittedSummary(@PathVariable("name") String name,@RequestBody Object httpEntity, HttpServletRequest request)
			throws Exception {
		logger.info("<<<<<<PUT senario submittingEdittedSummary>>>>" );
		String url = request.getRequestURI();
		System.out.println("method"+request.getMethod());
		HashMap jsonMap = (HashMap) httpEntity;
		String Jason = boardUtils.ObjectToJsonString(jsonMap);
		logger.info("Data to be saved: " + Jason);
		String jsonForbilling = boardUtils.createJasonForBilling(jsonMap);
		logger.info("json file to update rates " + Jason);
		ResponseEntity<?> response=null;
		try{
			response = requestHandler.saveMetaData(Jason,request.getMethod(),url);
			logger.info("Response after saving date to central repository" +response);
			ResponseEntity<?> responseDOP = requestHandler.forWardToDevops(Jason,request.getMethod(),url,name);
			logger.info("Response from DevOPS" +responseDOP);
			ResponseEntity<?> responseBilling=null;
			if(url.contains("microservices")){
			responseBilling = requestHandler.forwardTobillingSection(jsonForbilling,request.getMethod());
			logger.info("devop is ok sending request to billing" +responseBilling);
				if (responseBilling.getStatusCode().equals(HttpStatus.OK)) {
				response=new ResponseEntity<>(
							new ResponseMessage(HttpStatus.OK.toString(), "Status of DevOps", "pending"),
							HttpStatus.OK);
				} 
			}
		}catch(Exception e){
			if(e instanceof MECException){
				//requestHandler.deleteMetadata(jsonMap,url);
				throw e;
			}
			logger.info("Caught Exception"+e.getMessage());
			throw new MECException(SERVERERRORSTRING, SERVERERRORSTRING, "Failure", HttpStatus.FAILED_DEPENDENCY);
                
		}
		logger.info(">>>>>>>>PUT senario submittingEdittedSummary<<<<<<" );	
		return response;
	}
	
}
