package com.dt.edge.mec.apps.portal.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
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
import com.dt.edge.mec.apps.portal.requesthandler.CentralReopositoryRequestHandler;
import com.dt.edge.mec.apps.portal.requesthandler.DevOPsRequestHandler;
import com.dt.edge.mec.apps.portal.requesthandler.DevopsCRRequestHandler;
import com.dt.edge.mec.apps.portal.utility.PortalConstants;

@RestController
public class MicroserviceController {

	@Autowired
	private CentralReopositoryRequestHandler centralReopositoryRequestHandler;
	@Autowired
	private DevOPsRequestHandler devOPsRequestHandler;
	private static final String type = "microservice";
	private static final String typeall = "microservices";
	private static final String subsType = "subscribe";
	private final Logger logger = LogManager.getLogger(MicroserviceController.class.getName());
	private static final String MICROSERVICETYPE = "microServiceType";
	private static final String STAGE = "stage";
	private static final String ONBOARDSTATUS = "onBoardStatus";
	private static final String AVG_RATING = "rating";
	private static final String CATEGORY = "category";
	private static final String RELEASEDATE = "releasedate";
	private static final String DELIVERYMETHOD = "deliveryMethod";

	@Autowired
	private AppandMSCatalogRequestHandler AppandMSCatalogRequestHandler;
	@Autowired
	private DevopsCRRequestHandler devopsCRRequestHandler;

	/**
	 * 
	 * @param microservice
	 * @return
	 * @throws Exception
	 */

	// GET a Microservice by name
	@RequestMapping(value = "/getMicroService/{Name}", method = RequestMethod.GET)
	public ResponseEntity<?> getForList(@PathVariable("Name") String name) throws Exception {
		return AppandMSCatalogRequestHandler.getHandleRequestHandler(type, name);
	}

	/**
	 * 
	 * @param microServiceName
	 * @return
	 * @throws Exception
	 */
	/*
	 * deleting microservice name from DEVOPS and central respository
	 */
	@RequestMapping(value = "getMicroService/{microServiceName}", method = RequestMethod.DELETE, headers = PortalConstants.ACCEPT_HEADER)
	public ResponseEntity<?> deleteMicroservice(@PathVariable(PortalConstants.MICROSERVICENAME) String microServiceName,
			HttpServletRequest request) throws Exception {
		ResponseEntity<?> response = null;
		String url = request.getRequestURI();
		ResponseEntity<?> devOPsRequestHandlerRes = devOPsRequestHandler.deleteRequest(microServiceName, url);
		logger.info("Deleteion response from devOPsRequestHandler " + devOPsRequestHandlerRes);
		ResponseEntity<?> centralReopositoryRequestHandlerRes = AppandMSCatalogRequestHandler
				.deleteRequest(microServiceName, url, type);
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

	/**
	 * 
	 * @param Jason
	 * @return
	 * @throws Exception
	 */
	/*
	 * PUT (Edit) a Microservice - http://centralreposerver/microservice ( We
	 * need the complete MS object in this case along with Metadata)
	 */
	@RequestMapping(value = "/getMicroService", method = RequestMethod.PUT, headers = PortalConstants.ACCEPT_HEADER)
	public ResponseEntity<?> editApplication(@RequestBody Object httpEntity) throws Exception {
		HashMap Jason = (HashMap) httpEntity;
		return AppandMSCatalogRequestHandler.editRequestHandler(type, Jason);

	}

	@RequestMapping(value = "getMicroService/approve/{microServiceName}/{approveDeny}", method = RequestMethod.POST, headers = PortalConstants.ACCEPT_HEADER)
	public ResponseEntity<?> approveMS(@PathVariable(PortalConstants.MICROSERVICENAME) String msn,
			@PathVariable("approveDeny") String approveDeny) throws Exception {
		logger.info("<<<< MicroserviceController - Microservice Approval>>>>");
		Map<String, String> requestData = new HashMap<String, String>();
		requestData.put("approveDeny", approveDeny);
		requestData.put(PortalConstants.MICROSERVICENAME, msn);
		return devOPsRequestHandler.approvalRequest(requestData);
	}

	@RequestMapping(value = "/getAllMicroservices", method = RequestMethod.GET)
	public ResponseEntity<?> getAllApplicationOnCriteria(
			@RequestParam(value = PortalConstants.USERID, required = false) String userId,
			@RequestParam(value = PortalConstants.PAGESIZE, required = false) String page_size,
			@RequestParam(value = PortalConstants.SORTBY, required = false) String sort_by,
			@RequestParam(value = PortalConstants.SORTORDER, required = false) String sort_order,
			@RequestParam(value = PortalConstants.MICROSERVICENAME, required = false) String microserviceName,
			@RequestParam(value = MICROSERVICETYPE, required = false) String microserviceType,
			@RequestParam(value = STAGE, required = false) String stage,
			@RequestParam(value = ONBOARDSTATUS, required = false) String onBoardStatus,
			@RequestParam(value = AVG_RATING, required = false) String rating,
			@RequestParam(value = CATEGORY, required = false) String category,
			@RequestParam(value = RELEASEDATE, required = false) String releasedate,
			@RequestParam(value = PortalConstants.PAGE_NUMBER, required = false) String page_number,
			@RequestParam(value = typeall, required = false) String microservices,
			@RequestParam(value = DELIVERYMETHOD, required = false) String deliveryMethod) throws Exception {
		Map<String, String> queryParam = new HashMap<String, String>();
		Map<String, String> matrixParam = new HashMap<String, String>();
		matrixParam.put(PortalConstants.USERID, userId);
		matrixParam.put(AVG_RATING, rating);
		matrixParam.put(CATEGORY, category);
		matrixParam.put(RELEASEDATE, releasedate);
		matrixParam.put(ONBOARDSTATUS, onBoardStatus);
		matrixParam.put(PortalConstants.MICROSERVICENAME, microserviceName);
		matrixParam.put(STAGE, stage);
		matrixParam.put(MICROSERVICETYPE, microserviceType);
		matrixParam.put(typeall, microservices);
		matrixParam.put(DELIVERYMETHOD, deliveryMethod);
		queryParam.put(PortalConstants.PAGESIZE, page_size);
		queryParam.put(PortalConstants.SORTBY, sort_by);
		queryParam.put(PortalConstants.SORTORDER, sort_order);
		queryParam.put(PortalConstants.PAGE_NUMBER, page_number);
		return AppandMSCatalogRequestHandler.getAllRequestHandler(typeall, (HashMap<String, String>) matrixParam,
				(HashMap<String, String>) queryParam);
	}

	@RequestMapping(value = "microservice/onboard/viewError/{Name}", method = RequestMethod.GET, headers = PortalConstants.ACCEPT_HEADER)
	public ResponseEntity<?> handleOnboardFailure(@PathVariable("Name") String name) throws Exception {
		return devopsCRRequestHandler.handleErrorLinkRequest(type, name);
	}

	@RequestMapping(value = "microservice/sandbox/{Name}", method = RequestMethod.GET, headers = PortalConstants.ACCEPT_HEADER)
	public ResponseEntity<?> fetchMsSandboxEndPoints(@PathVariable("Name") String name) throws Exception {
		return devopsCRRequestHandler.fetchSandoxEndPoints(type, name);
	}

	/*
	 * Subscription method
	 * 
	 * 
	 */
	@RequestMapping(value = "/getAllMSSubscriptions", method = RequestMethod.GET)
	public ResponseEntity<?> getListOfMsSubscription(
			@RequestParam(value = PortalConstants.USERID, required = true) String userId,
			@RequestParam(value = PortalConstants.PAGESIZE, required = false) String page_size,
			@RequestParam(value = PortalConstants.SORTBY, required = false) String sort_by,
			@RequestParam(value = PortalConstants.SORTORDER, required = false) String sort_order,
			@RequestParam(value = PortalConstants.MICROSERVICENAME, required = false) String microServiceName,
			@RequestParam(value = MICROSERVICETYPE, required = false) String microserviceType,
			@RequestParam(value = STAGE, required = false) String stage,
			@RequestParam(value = ONBOARDSTATUS, required = false) String onBoardStatus,
			@RequestParam(value = AVG_RATING, required = false) String rating,
			@RequestParam(value = CATEGORY, required = false) String category,
			@RequestParam(value = RELEASEDATE, required = false) String releasedate,
			@RequestParam(value = PortalConstants.PAGE_NUMBER, required = false) String page_number,
			@RequestParam(value = typeall, required = false) String microservices) throws Exception {
		Map<String, String> queryParam = new HashMap<String, String>();
		Map<String, String> matrixParam = new HashMap<String, String>();
		Map<String, String> pathParam = new HashMap<String, String>();

		pathParam.put(PortalConstants.USERID, userId);
		matrixParam.put(AVG_RATING, rating);
		matrixParam.put(CATEGORY, category);
		matrixParam.put(RELEASEDATE, releasedate);
		matrixParam.put(ONBOARDSTATUS, onBoardStatus);
		matrixParam.put(PortalConstants.MICROSERVICENAME, microServiceName);
		matrixParam.put(STAGE, stage);
		matrixParam.put(MICROSERVICETYPE, microserviceType);
		matrixParam.put(typeall, microservices);
		queryParam.put(PortalConstants.PAGESIZE, page_size);
		queryParam.put(PortalConstants.SORTBY, sort_by);
		queryParam.put(PortalConstants.SORTORDER, sort_order);
		queryParam.put(PortalConstants.PAGE_NUMBER, page_number);
		return centralReopositoryRequestHandler.getlistOFSubscribedMicroService(subsType,
				(HashMap<String, String>) pathParam, (HashMap<String, String>) matrixParam,
				(HashMap<String, String>) queryParam);

	}

	@RequestMapping(value = "microService/rating", method = RequestMethod.POST, headers = PortalConstants.ACCEPT_HEADER)
	public ResponseEntity<?> rateMS(@RequestBody Object httpEntity) throws Exception {
		logger.info("<<<< MicroserviceController - POST Microservice Rating>>>>");
		HashMap json = (HashMap) httpEntity;
		return AppandMSCatalogRequestHandler.submitRating(json, HttpMethod.POST);
	}

	@RequestMapping(value = "microService/rating", method = RequestMethod.PUT, headers = PortalConstants.ACCEPT_HEADER)
	public ResponseEntity<?> updateMSRating(@RequestBody Object httpEntity) throws Exception {
		logger.info("<<<< MicroserviceController - Update Microservice Rating>>>>");
		HashMap json = (HashMap) httpEntity;
		return AppandMSCatalogRequestHandler.submitRating(json, HttpMethod.PUT);
	}

	@RequestMapping(value = "microService/rating", method = RequestMethod.GET, headers = PortalConstants.ACCEPT_HEADER)
	public ResponseEntity<?> getMSRating(
			@RequestParam(value = PortalConstants.MICROSERVICENAME, required = true) String microServiceName,
			HttpSession session) throws Exception {
		logger.info("<<<< MicroserviceController -Fetch Microservice Rating Details given by a particular user>>>>");
		String userId = (String) session.getAttribute(PortalConstants.USERID);
		Map<String, String> matrixParam = new HashMap<String, String>();
		matrixParam.put(PortalConstants.MICROSERVICENAME, microServiceName);
		matrixParam.put(PortalConstants.USERID, userId);
		return AppandMSCatalogRequestHandler.getMSRating(matrixParam);
	}

	@RequestMapping(value = "microService/rating/getCountOfRecords", method = RequestMethod.GET, headers = PortalConstants.ACCEPT_HEADER)
	public ResponseEntity<?> getMSRatingCount(
			@RequestParam(value = PortalConstants.MICROSERVICENAME, required = true) String microServiceName)
			throws Exception {
		logger.info("<<<< MicroserviceController -Fetch Microservice Rating counts>>>>");
		return AppandMSCatalogRequestHandler.getMSRatingCount(microServiceName);
	}

	@RequestMapping(value = "microService/rating/getTopReviews", method = RequestMethod.GET, headers = PortalConstants.ACCEPT_HEADER)
	public ResponseEntity<?> getMSRatingReviews(
			@RequestParam(value = PortalConstants.PAGESIZE, required = false) String page_size,
			@RequestParam(value = PortalConstants.SORTBY, required = false) String sort_by,
			@RequestParam(value = PortalConstants.SORTORDER, required = false) String sort_order,
			@RequestParam(value = PortalConstants.PAGE_NUMBER, required = false) String page_number,
			@RequestParam(value = PortalConstants.MICROSERVICENAME, required = true) String microServiceName) throws Exception {
		logger.info("<<<< MicroserviceController -Fetch Microservice Top reviews>>>>");
		Map<String, String> queryParam = new HashMap<String, String>();
		Map<String, String> matrixParam = new HashMap<String, String>();
		matrixParam.put(PortalConstants.MICROSERVICENAME, microServiceName);
		queryParam.put(PortalConstants.PAGESIZE, page_size);
		queryParam.put(PortalConstants.SORTBY, sort_by);
		queryParam.put(PortalConstants.SORTORDER, sort_order);
		queryParam.put(PortalConstants.PAGE_NUMBER, page_number);
		return AppandMSCatalogRequestHandler.getMSTopReviews((HashMap<String, String>) matrixParam,
				(HashMap<String, String>) queryParam);
	}
	
	@RequestMapping(value = "microService/rating/getRatingReviews", method = RequestMethod.GET, headers = PortalConstants.ACCEPT_HEADER)
	public ResponseEntity<?> getMSRatingReviews(
			@RequestParam(value = PortalConstants.PAGESIZE, required = false) String page_size,
			@RequestParam(value = PortalConstants.SORTBY, required = false) String sort_by,
			@RequestParam(value = PortalConstants.SORTORDER, required = false) String sort_order,
			@RequestParam(value = PortalConstants.PAGE_NUMBER, required = false) String page_number,
			@RequestParam(value = "rating", required = true) String rating,
			@RequestParam(value = PortalConstants.MICROSERVICENAME, required = true) String microServiceName) throws Exception {
		logger.info("<<<< MicroserviceController -Fetch Microservice Rating reviews>>>>");
		Map<String, String> queryParam = new HashMap<String, String>();
		Map<String, String> matrixParam = new HashMap<String, String>();
		matrixParam.put(PortalConstants.MICROSERVICENAME, microServiceName);
		matrixParam.put("rating", rating);
		queryParam.put(PortalConstants.PAGESIZE, page_size);
		queryParam.put(PortalConstants.SORTBY, sort_by);
		queryParam.put(PortalConstants.SORTORDER, sort_order);
		queryParam.put(PortalConstants.PAGE_NUMBER, page_number);
		return AppandMSCatalogRequestHandler.getMSRatingReviews(microServiceName, rating, 
				(HashMap<String, String>) queryParam);	}
}
