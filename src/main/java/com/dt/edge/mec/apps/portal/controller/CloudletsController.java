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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.apps.portal.helper.OnBoardRequestHelper;
import com.dt.edge.mec.apps.portal.model.ResponseMessage;
import com.dt.edge.mec.apps.portal.requesthandler.CentralReopositoryRequestHandler;
import com.dt.edge.mec.apps.portal.requesthandler.LLORequestHandler;
import com.dt.edge.mec.apps.portal.requesthandler.PassRequestHandler;
import com.dt.edge.mec.apps.portal.requesthandler.UserProfileRequestHandler;
import com.dt.edge.mec.apps.portal.utility.OnBoardUtils;

@RestController
public class CloudletsController {
	private static final String typeall="cloudlets";
	private static final String type="cloudlet";
	private static final String operator="operator";
	private static final String ACCEPT_HEADER="Accept=application/json";
	private final Logger logger = LogManager.getLogger(CloudletsController.class.getName());
	@Autowired
	private CentralReopositoryRequestHandler centralReopositoryRequestHandler;
	@Autowired
	private OnBoardUtils  boardUtils;
	@Autowired
	private OnBoardRequestHelper requestHandler;
	@Autowired
	private LLORequestHandler lLORequestHandler;
	@Autowired
	private PassRequestHandler passRequest;
	@Autowired
	private UserProfileRequestHandler userprofileHandler;

	
	/*
	 * clicking on cloudlets from GUI. 
	 * List of all cloudlets
	 */
	@RequestMapping(value=typeall,method=RequestMethod.GET,headers=ACCEPT_HEADER)
	public ResponseEntity<?> GetListOfEdgesAndOperators() throws MECException{
		ResponseEntity<?> responseString = userprofileHandler.getAllOperatorList();
		return responseString;
		
	}
	
	/*
	 * request to get list of sub operator based on operator
	 */
		@RequestMapping(value="cloudlets/onboard/{operator}",method=RequestMethod.GET,headers="Accept=application/json")
	public ResponseEntity<?> getAllsubOperators(@PathVariable("operator") String operator,
	        @RequestParam(value = "page_size", required = false) String page_size,
            @RequestParam(value = "sort_by", required = false) String sort_by,
            @RequestParam(value = "sort_order", required = false) String sort_order,
            @RequestParam(value = "page_number", required = false) String page_number
          ) throws MECException{
		Map<String,String> matrixParam = new HashMap<String,String>();
		Map<String,String> queryParam = new HashMap<String,String>();
        matrixParam.put("operator",operator);
		queryParam.put("page_size", page_size);
        queryParam.put("sort_by", sort_by);
        queryParam.put("sort_order", sort_order);
        queryParam.put("page_number", page_number);
    	ResponseEntity<?> response= centralReopositoryRequestHandler.getAllSubOperatorList(type,matrixParam,(HashMap<String, String>)queryParam);
		return response;
		
	}
	/*
	 * cloudlets name validation
	 */
	@RequestMapping(value={"cloudlets/onboard/validateName"},method=RequestMethod.POST,headers=ACCEPT_HEADER)
	   public ResponseEntity<?> validateName(@RequestBody Map<String,String> httpEntity) throws MECException{
			ResponseEntity<?> response=null;
			response=requestHandler.validate(type,httpEntity);
			logger.debug("response after validation service name "+response);
			return response;
		}
	/*
	 * deleting cloud lets form central repo and llo
	 */
	@RequestMapping(value="deleteCloudlets/{edgeName}/{cloudletName}",method=RequestMethod.DELETE,headers=ACCEPT_HEADER)
	public ResponseEntity<?> deleteMicroservice(@PathVariable("edgeName") String edgeName,@PathVariable("cloudletName") String cloudletName,HttpServletRequest request) throws Exception{
		ResponseEntity<?> response=null;
		String url = request.getRequestURI();
		/*ResponseEntity<?> centralReopositoryRequestHandlerRes=passRequest.deleteRequest(disAbleCloudlets(cloudletName),url,type);
		logger.debug("Deleteion response from centralReopositoryRequestHandler "+centralReopositoryRequestHandlerRes);
        */ResponseEntity<?> lloRequestHandlerRes= lLORequestHandler.deleteRequest(edgeName,cloudletName,url);
		logger.debug("Deleteion response from lLORequestHandler "+lloRequestHandlerRes);
		//if(lloRequestHandlerRes.getStatusCode().equals(HttpStatus.OK)&&centralReopositoryRequestHandlerRes.getStatusCode().equals(HttpStatus.OK)){
		if(lloRequestHandlerRes.getStatusCode().equals(HttpStatus.OK)){
		    String message = "Cloulet marked to be deleted";
			String status ="success";
			response=new ResponseEntity<>(new ResponseMessage(lloRequestHandlerRes.getStatusCode().toString(), message, status),HttpStatus.OK);
			
		}
		return response;
	}
	/*private String disAbleCloudlets(String clouletsName){
		StringBuffer sb = new StringBuffer();
		sb.append("{");
        sb.append("\n");
        sb.append("\"onBoardStatus\"");
        sb.append(":");
        sb.append("\"Disabled\",");
        sb.append("\n");
        sb.append("\"cloudletName\"");
        sb.append(":");
        sb.append("\"");
        sb.append(clouletsName);
        sb.append("\"");
        sb.append("}");
		return sb.toString();
	}*/
	/*
	 * seraching and sorting  
	 */
	@RequestMapping(value = "/getAllCloudlets", method = RequestMethod.GET)
	public ResponseEntity<?> getAllApplicationOnCriteria(@RequestParam(value =operator, required = false) String operatorName,
			@RequestParam(value = "page_size", required = false) String page_size,
			@RequestParam(value = "sort_by", required = false) String sort_by,
			@RequestParam(value = "sort_order", required = false) String sort_order,
			@RequestParam(value = "cloudletName", required = false) String cloudletName,
			@RequestParam(value = typeall, required = false) String cloudlets,
			@RequestParam(value = "page_number", required = false) String page_number) throws Exception {
		Map<String,String> queryParam = new HashMap<String,String>();
		Map<String,String> matrixParam = new HashMap<String,String>();
		matrixParam.put("cloudletName",cloudletName);
		matrixParam.put(operator,operatorName);
		matrixParam.put(typeall,cloudlets);
		queryParam.put("page_size", page_size);
		queryParam.put("sort_by", sort_by);
		queryParam.put("sort_order", sort_order);
		queryParam.put("page_number", page_number);
		return passRequest.getAllRequestHandler(typeall,(HashMap<String, String>)matrixParam,(HashMap<String, String>)queryParam);
	}
	
	/*
	 * submmiting request
	 */
	
		@RequestMapping(value = "submit/cloudlets/{edgeName}/{cloudletName}", method = RequestMethod.POST, headers = ACCEPT_HEADER)
	public ResponseEntity<?> submittingSummary(@RequestBody Object httpEntity, HttpServletRequest request,@PathVariable("edgeName") String edgeName,@PathVariable("cloudletName") String cloudletName)
		throws Exception {
	logger.debug("<<<<<<POST senario submittingSummary>>>>" );
	String url = request.getRequestURI();
	String policyFile=null;
	HashMap<String, String> jsonMapCentralrepo = (HashMap<String, String>) httpEntity;
	HashMap<String, String> jsonMapCentralLLO = (HashMap<String, String>) httpEntity;
    /*
	 * removing policyFile  from json  to sent request to CR
	 */
	if(jsonMapCentralrepo.containsKey("policyFile")){
	 policyFile=jsonMapCentralrepo.get("policyFile");
	jsonMapCentralrepo.remove("policyFile");
	}
	ResponseEntity<?> response=null;
	ResponseEntity<?> responseLLO=null;
	String Jason =null;
	String JasonLLO=null;
	try{
		if(jsonMapCentralrepo.get("icon")==null){
		String profilepic=userprofileHandler.getProfileIcon(jsonMapCentralrepo.get("userId"));
		jsonMapCentralrepo.put("icon", profilepic);
		}
	   }catch(Exception e){
			if(e instanceof MECException){
				/*requestHandler.deleteMetadata(jsonMap,url);
				lLORequestHandler.deleteRequest(edgeName,cloudletName,url);
				throw e;*/
			}
			logger.debug("Caught Exception"+e.getMessage());
		//	throw new MECException("Server Error", "Server Error", "Failure", HttpStatus.FAILED_DEPENDENCY);
		}
		Jason = boardUtils.ObjectToJsonString(jsonMapCentralrepo);
		logger.debug("saving data "+Jason);
		
		response = requestHandler.saveMetaData(Jason,null,url);
		if(response.getStatusCode().equals(HttpStatus.OK)){
		    if(!jsonMapCentralLLO.containsKey("policyFile")){
		        jsonMapCentralLLO.put("policyFile",policyFile);
		       }
		JasonLLO = boardUtils.ObjectToJsonString(jsonMapCentralLLO);
		logger.debug("saving data "+JasonLLO);
		responseLLO=lLORequestHandler.saveMetaData(JasonLLO,edgeName,cloudletName,type);
		}
	
	logger.debug("<<<<<< submittingSummary>>>>" );
	return responseLLO;
	}
		/*
		 * details of cloudlets
		 */
		@RequestMapping(value = "cloudlets/details/{cloudletName}", method = RequestMethod.GET, headers = ACCEPT_HEADER)
		public ResponseEntity<?> getEdgeDetails (@PathVariable("cloudletName") String cloudletName)
			throws Exception {
			ResponseEntity<?> response= passRequest.getDetais(type,cloudletName);
			return response;
		
		}
		/*
		 * testing connection of edge from cloudlets
		 */
		@RequestMapping(value = "cloudlets/test/{edgeName}", method = RequestMethod.GET, headers = ACCEPT_HEADER)
		public ResponseEntity<?> connectionTest (@PathVariable("edgeName") String edgeName)
			throws Exception {
			ResponseEntity<?> respone=lLORequestHandler.edgeTesting(edgeName);
			return respone;
		
		}
}
