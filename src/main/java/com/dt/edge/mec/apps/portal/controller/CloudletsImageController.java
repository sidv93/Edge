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
import com.dt.edge.mec.apps.portal.requesthandler.LLORequestHandler;
import com.dt.edge.mec.apps.portal.requesthandler.PassRequestHandler;
import com.dt.edge.mec.apps.portal.requesthandler.UserProfileRequestHandler;

@RestController
public class CloudletsImageController {
	private static final String typeall = "cloudletImages";
	private static final String type = "cloudletImage";
	private final Logger logger = LogManager.getLogger(CloudletsController.class.getName());
	@Autowired
	private OnBoardRequestHelper requestHelper;
	@Autowired
	private LLORequestHandler lLORequestHandler;
	@Autowired
	private PassRequestHandler passRequest;
	@Autowired
	private UserProfileRequestHandler userprofileHandler;

	private static final String ACCEPT_HEADER = "Accept=application/json";
	private static final String EDGE_NAME = "edgeName";

	/*
	 * clicking on cloudlet Image from GUI.
	 *
	 */
	@RequestMapping(value = "cloudletImage", method = RequestMethod.GET, headers = ACCEPT_HEADER)
	public ResponseEntity<?> GetListOfEdgesAndOperators() throws MECException {
		ResponseEntity<?> responseString = userprofileHandler.getAllOperatorList();
		return responseString;

	}

	/*
	 * validating cloudlets Image name
	 */
	@RequestMapping(value = {
			"cloudletImage/onboard/validateName" }, method = RequestMethod.POST, headers = ACCEPT_HEADER)
	public ResponseEntity<?> validateName(@RequestBody Map<String, String> httpEntity) throws MECException {
		ResponseEntity<?> response = null;
		response = requestHelper.validate(type, httpEntity);
		logger.info("response after validation service name " + response);
		return response;
	}
	/*
	 * getList of all cloudletimage based on edgeName this not required for time
	 * being
	 */
	/*
	 * @RequestMapping(value="cloudletImage/onboard/{userId}/{edgeName}",method=
	 * RequestMethod.GET,headers=ACCEPT_HEADER) public ResponseEntity<?>
	 * getAllsubOperators(@PathVariable(EDGE_NAME) String edgeName) throws
	 * MECException{ ResponseEntity<?> response=
	 * centralReopositoryRequestHandler.getAllSubOperatorList(type,edgeName);
	 * return response;
	 * 
	 * }
	 */

	/*
	 * This method will called when user will clicked on uploadImage icon
	 */
	@RequestMapping(value = "cloudletImage/upload", method = RequestMethod.GET, headers = ACCEPT_HEADER)
	public ResponseEntity<?> getAllEdges() throws MECException {
		ResponseEntity<?> lisofedg = userprofileHandler.getAllOperatorList();
		return lisofedg;

	}

	/*
	 * This method will be call when save button is clicked .
	 */
	@RequestMapping(value = "cloudletsImage/save/{ImageName}/{edgeName}", method = RequestMethod.POST, headers = ACCEPT_HEADER)
	public ResponseEntity<?> SaveImage(@RequestBody String json, HttpServletRequest request,
			@PathVariable("ImageName") String ImageName, @PathVariable(EDGE_NAME) String edgeName) throws MECException {
		ResponseEntity<?> response = requestHelper.saveMetaData(json, request.getMethod(), request.getRequestURI());
		if (response.getStatusCode().equals(HttpStatus.OK)) {
			response = lLORequestHandler.saveMetaData(json, edgeName, ImageName, type);
		}
		return response;
	}

	/*
	 * deleting cloud lets form central repo and llo
	 */
	@RequestMapping(value = "deleteCloudletImage/{edgeName}/{cloudletImageName}", method = RequestMethod.DELETE, headers = ACCEPT_HEADER)
	public ResponseEntity<?> deleteMicroservice(@PathVariable(EDGE_NAME) String edgeName,
			@PathVariable("cloudletImageName") String cloudletImageName, HttpServletRequest request) throws Exception {
		ResponseEntity<?> response = null;
		String url = request.getRequestURI();
		/*
		 * ResponseEntity<?>
		 * centralReopositoryRequestHandlerRes=passRequest.deleteRequest(
		 * cloudletImageName,url,type); logger.
		 * info("Deleteion response from centralReopositoryRequestHandler "
		 * +centralReopositoryRequestHandlerRes);
		 */ResponseEntity<?> lloRequestHandlerRes = lLORequestHandler.deleteRequest(edgeName, cloudletImageName, url);
		logger.info("Deleteion response from lLORequestHandler " + lloRequestHandlerRes);
		// if(centralReopositoryRequestHandlerRes.getStatusCode().equals(HttpStatus.OK)&&lloRequestHandlerRes.getStatusCode().equals(HttpStatus.OK)){
		if (lloRequestHandlerRes.getStatusCode().equals(HttpStatus.OK)) {
			String message = "Deletion is sucessfull from LLO";
			String status = "success";
			response = new ResponseEntity<>(
					new ResponseMessage(lloRequestHandlerRes.getStatusCode().toString(), message, status),
					HttpStatus.OK);

		}
		return response;
	}

	/*
	 * seraching and sorting.This method will be modified once get api details
	 * from CR team
	 */
	@RequestMapping(value = "/getAllCloudletImage", method = RequestMethod.GET)
	public ResponseEntity<?> getAllApplicationOnCriteria(
			@RequestParam(value = "imageName", required = false) String imageName,
			@RequestParam(value = "page_size", required = false) String page_size,
			@RequestParam(value = "sort_by", required = false) String sort_by,
			@RequestParam(value = "sort_order", required = false) String sort_order,
			@RequestParam(value = EDGE_NAME, required = false) String edgeName,
			@RequestParam(value = "cloudletImages", required = false) String cloudletImages,
			@RequestParam(value = "page_number", required = false) String page_number) throws Exception {
		Map<String, String> queryParam = new HashMap<String, String>();
		Map<String, String> matrixParam = new HashMap<String, String>();
		matrixParam.put(EDGE_NAME, edgeName);
		matrixParam.put("imageName", imageName);
		matrixParam.put("cloudletImages", cloudletImages);
		queryParam.put("page_size", page_size);
		queryParam.put("sort_by", sort_by);
		queryParam.put("sort_order", sort_order);
		queryParam.put("page_number", page_number);
		return passRequest.getAllRequestHandler(typeall, (HashMap<String, String>) matrixParam,
				(HashMap<String, String>) queryParam);
	}

	/*
	 * details of cloudlets
	 */
	@RequestMapping(value = "cloudletImage/details/{cloudletImageName}", method = RequestMethod.GET, headers = ACCEPT_HEADER)
	public ResponseEntity<?> getCloudLestDetails(@PathVariable("cloudletImageName") String cloudletImageName)
			throws Exception {
		ResponseEntity<?> response = passRequest.getDetais(type, cloudletImageName);
		return response;

	}

}
