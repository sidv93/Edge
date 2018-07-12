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

import com.dt.edge.mec.apps.portal.model.ResponseMessage;
import com.dt.edge.mec.apps.portal.requesthandler.AppandMSCatalogRequestHandler;
import com.dt.edge.mec.apps.portal.requesthandler.BillingRequestHandler;
import com.dt.edge.mec.apps.portal.requesthandler.DevOPsRequestHandler;
import com.dt.edge.mec.apps.portal.requesthandler.DevopsCRRequestHandler;
import com.dt.edge.mec.apps.portal.utility.PortalConstants;

@RestController
public class ApplicationController {
	@Autowired
	private DevOPsRequestHandler devOPsRequestHandler;
	@Autowired
	private AppandMSCatalogRequestHandler AppandMSCatalogRequestHandler;
	@Autowired
	private BillingRequestHandler billingRequestHandler;
	@Autowired
	private DevopsCRRequestHandler devopsCRRequestHandler;
	private static final String type = "application";
	private static final String typeall = "applications";
	private static final String ACCEPT_HEADER = "Accept=application/json";
	private static final String APPLICATION_NAME = "applicationName";
	private final Logger logger = LogManager.getLogger(ApplicationController.class.getName());

	@RequestMapping(value = "/getMobileApps/{Name}", method = RequestMethod.GET)
	public ResponseEntity<?> getForList(@PathVariable("Name") String name) throws Exception {
		return AppandMSCatalogRequestHandler.getHandleRequestHandler(type, name);
	}

	@RequestMapping(value = "getMobileApps/{applicationName}", method = RequestMethod.DELETE, headers = ACCEPT_HEADER)
	public ResponseEntity<?> deleteApplication(@PathVariable(APPLICATION_NAME) String applicationName,
			HttpServletRequest request) throws Exception {
		// Map<String, String> params = new HashMap<String, String>();
		ResponseEntity<?> response = null;
		String url = request.getRequestURI();
		ResponseEntity<?> devOPsRequestHandlerRes = devOPsRequestHandler.deleteRequest(applicationName, url);
		logger.info("Deleteion response from devOPsRequestHandler " + devOPsRequestHandlerRes);
		ResponseEntity<?> centralReopositoryRequestHandlerRes = AppandMSCatalogRequestHandler
				.deleteRequest(applicationName, url, type);
		logger.info("Deleteion response from centralReopositoryRequestHandler " + centralReopositoryRequestHandlerRes);
		if (devOPsRequestHandlerRes.getStatusCode().equals(HttpStatus.OK)) {
			String message = "Deletion is sucessfull from DevOps and Central Repository";
			String status = "success";
			response = new ResponseEntity<>(
					new ResponseMessage(devOPsRequestHandlerRes.getStatusCode().toString(), message, status),
					HttpStatus.OK);

		}
		return response;
	}

	@RequestMapping(value = "/getMobileApps", method = RequestMethod.PUT, headers = ACCEPT_HEADER)
	public ResponseEntity<?> editApplication(@RequestBody Object httpEntity) throws Exception {
		HashMap Jason = (HashMap) httpEntity;
		return AppandMSCatalogRequestHandler.editRequestHandler(type, Jason);

	}

	@RequestMapping(value = "getMobileApps/approve/{applicationName}/{approveDeny}", method = RequestMethod.POST, headers = ACCEPT_HEADER)
	public ResponseEntity<?> approveApp(@PathVariable(APPLICATION_NAME) String msn,
			@PathVariable("approveDeny") String approveDeny) throws Exception {
		Map<String, String> requestData = new HashMap<String, String>();
		requestData.put("approveDeny", approveDeny);
		requestData.put(APPLICATION_NAME, msn);
		return devOPsRequestHandler.approvalRequest(requestData);
	}

	@RequestMapping(value = "getAllMobileApps", method = RequestMethod.GET)
	public ResponseEntity<?> getAllApplicationOnCriteria(
			@RequestParam(value = "userId", required = false) String userId,
			@RequestParam(value = "page_size", required = false) String page_size,
			@RequestParam(value = "sort_by", required = false) String sort_by,
			@RequestParam(value = "sort_order", required = false) String sort_order,
			@RequestParam(value = APPLICATION_NAME, required = false) String applicationName,
			@RequestParam(value = "applicationType", required = false) String applicationType,
			@RequestParam(value = "stage", required = false) String stage,
			@RequestParam(value = "onBoardStatus", required = false) String onBoardStatus,
			@RequestParam(value = "rating", required = false) String rating,
			@RequestParam(value = "category", required = false) String category,
			@RequestParam(value = "releasedate", required = false) String releasedate,
			@RequestParam(value = "page_number", required = false) String page_number,
			@RequestParam(value = "applications", required = false) String applications) throws Exception {
		Map<String, String> queryParam = new HashMap<String, String>();
		Map<String, String> matrixParam = new HashMap<String, String>();
		matrixParam.put("userId", userId);
		matrixParam.put("rating", rating);
		matrixParam.put("category", category);
		matrixParam.put("releasedate", releasedate);
		matrixParam.put("onBoardStatus", onBoardStatus);
		matrixParam.put(APPLICATION_NAME, applicationName);
		matrixParam.put("stage", stage);
		matrixParam.put("applicationType", applicationType);
		matrixParam.put("applications", applications);
		queryParam.put("page_size", page_size);
		queryParam.put("sort_by", sort_by);
		queryParam.put("sort_order", sort_order);
		queryParam.put("page_number", page_number);
		logger.info(matrixParam);
		return AppandMSCatalogRequestHandler.getAllRequestHandler(typeall, (HashMap<String, String>) matrixParam,
				(HashMap<String, String>) queryParam);
	}

	@RequestMapping(value = "application/onboard/viewError/{Name}", method = RequestMethod.GET, headers = ACCEPT_HEADER)
	public ResponseEntity<?> handleOnboardFailure(@PathVariable("Name") String name) throws Exception {
		return devopsCRRequestHandler.handleErrorLinkRequest(type, name);
	}

	@RequestMapping(value = "billing/{userID}/{period}/{roleType}", method = RequestMethod.GET)
	public ResponseEntity<?> getMobileAppsBillingForUser(@PathVariable("userID") String userID,
			@PathVariable("period") String period, @PathVariable("roleType") String roleType) throws Exception {
		logger.info("app billing of  " + userID + " for " + period);
		return billingRequestHandler.RequestToGetBill(userID, period, roleType);
		// return new ResponseEntity<>(requestData,HttpStatus.OK);
	}

	@RequestMapping(value = "application/sandbox/{Name}", method = RequestMethod.GET, headers = PortalConstants.ACCEPT_HEADER)
	public ResponseEntity<?> fetchAppSandboxEndPoints(@PathVariable("Name") String name) throws Exception {
		return devopsCRRequestHandler.fetchSandoxEndPoints(type, name);
	}

}
