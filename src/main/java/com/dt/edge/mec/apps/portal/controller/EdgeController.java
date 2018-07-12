package com.dt.edge.mec.apps.portal.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.apps.portal.helper.OnBoardRequestHelper;
import com.dt.edge.mec.apps.portal.requesthandler.CentralReopositoryRequestHandler;
import com.dt.edge.mec.apps.portal.requesthandler.PassRequestHandler;
import com.dt.edge.mec.apps.portal.requesthandler.UserProfileRequestHandler;
import com.dt.edge.mec.apps.portal.utility.OnBoardUtils;

@RestController
public class EdgeController {

	private static final String typeall = "edges";
	private static final String type = "edge";
	private final Logger logger = LogManager.getLogger(EdgeController.class.getName());
	private static final String ACCEPT_HEADER = "Accept=application/json";
	private static final String EGDENAME = "edgeName";

	@Autowired
	private CentralReopositoryRequestHandler centralReopositoryRequestHandler;
	@Autowired
	private OnBoardUtils boardUtils;
	@Autowired
	private OnBoardRequestHelper requestHandler;
	@Autowired
	private PassRequestHandler passRequest;
	@Autowired
	private UserProfileRequestHandler userprofileHandler;

	/*
	 * clicking on edge from GUI. List of all edge
	 */

	@RequestMapping(value = "edges", method = RequestMethod.GET, headers = ACCEPT_HEADER)
	public ResponseEntity<?> GetListOfEdges() throws MECException {
		ResponseEntity<?> responseString = userprofileHandler.getAllOperatorList();
		return responseString;

	}

	/*
	 * Edge name validation
	 */
	@RequestMapping(value = { "edges/onboard/validateName" }, method = RequestMethod.POST, headers = ACCEPT_HEADER)
	public ResponseEntity<?> validateName(@RequestBody Map<String, String> httpEntity) throws MECException {
		ResponseEntity<?> response = null;
		response = requestHandler.validate(type, httpEntity);
		logger.debug("response after validation service name " + response);
		return response;
	}

	/*
	 * request to sent list of sub operator based on operator name List of all
	 * the edges on the basis of operator and user type from usercatalog
	 */
	@RequestMapping(value = "edges/onboard/{userType}/{companyName}", method = RequestMethod.GET, headers = ACCEPT_HEADER)
	public ResponseEntity<?> getAllsubOperators(@PathVariable("userType") String userType,
			@PathVariable("companyName") String companyName,
			@RequestParam(value = "page_size", required = false) String page_size,
			@RequestParam(value = "sort_by", required = false) String sort_by,
			@RequestParam(value = "sort_order", required = false) String sort_order,
			@RequestParam(value = "page_number", required = false) String page_number

	) throws MECException {
		Map<String, String> matrixParam = new HashMap<String, String>();
		matrixParam.put("userType", userType);
		matrixParam.put("companyName", companyName);
		Map<String, String> queryParam = new HashMap<String, String>();
		queryParam.put("page_size", page_size);
		queryParam.put("sort_by", sort_by);
		queryParam.put("sort_order", sort_order);
		queryParam.put("page_number", page_number);
		ResponseEntity<?> response = centralReopositoryRequestHandler.getAllSubOperatorList(type,
				(HashMap<String, String>) matrixParam, (HashMap<String, String>) queryParam);
		return response;

	} /*
		 * Edge delete
		 */

	@RequestMapping(value = "deleteEdges/{edgeName}", method = RequestMethod.DELETE, headers = ACCEPT_HEADER)
	public ResponseEntity<?> deleteMicroservice(@PathVariable(EGDENAME) String edgeName, HttpServletRequest request)
			throws Exception {
		String url = request.getRequestURI();
		// ResponseEntity<?> devOPsRequestHandlerRes=
		// lLORequestHandler.deleteRequest(edgeName,url);
		// logger.debug("Deleteion response from lLORequestHandler
		// "+devOPsRequestHandlerRes);
		ResponseEntity<?> centralReopositoryRequestHandlerRes = passRequest.deleteRequest(edgeName, url, type);
		logger.debug("Deleteion response from centralReopositoryRequestHandler " + centralReopositoryRequestHandlerRes);
		// ResponseEntity<?> devOPsRequestHandlerRes=
		// lloRequestHandler.deleteRequest(edgeName,url);
		/*
		 * if(devOPsRequestHandlerRes.getStatusCode().equals(HttpStatus.OK)&&
		 * devOPsRequestHandlerRes.getStatusCode().equals(HttpStatus.OK)){
		 * String message =
		 * "Deletion is sucessfull from DevOps and Central Repository"; String
		 * status ="success"; response=new ResponseEntity<>(new
		 * ResponseMessage(devOPsRequestHandlerRes.getStatusCode().toString(),
		 * message, status),HttpStatus.OK);
		 * 
		 * }
		 */
		return centralReopositoryRequestHandlerRes;
	}

	@RequestMapping(value = "/getAllEdges", method = RequestMethod.GET)
	public ResponseEntity<?> getAllEdgesOnCriteria(@RequestParam(value = "operator", required = false) String operator,
			@RequestParam(value = "page_size", required = false) String page_size,
			@RequestParam(value = "sort_by", required = false) String sort_by,
			@RequestParam(value = "sort_order", required = false) String sort_order,
			@RequestParam(value = EGDENAME, required = false) String edgeName,
			@RequestParam(value = "page_number", required = false) String page_number) throws Exception {
		Map<String, String> queryParam = new HashMap<String, String>();
		Map<String, String> matrixParam = new HashMap<String, String>();
		matrixParam.put(EGDENAME, edgeName);
		matrixParam.put("operator", operator);
		queryParam.put("page_size", page_size);
		queryParam.put("sort_by", sort_by);
		queryParam.put("sort_order", sort_order);
		queryParam.put("page_number", page_number);
		return passRequest.getAllRequestHandler(typeall, (HashMap<String, String>) matrixParam,
				(HashMap<String, String>) queryParam);
	}

	@RequestMapping(value = "/onboard/edge", method = RequestMethod.POST, headers = ACCEPT_HEADER)
	public ResponseEntity<?> submittingSummary(@RequestBody Object httpEntity, HttpServletRequest request)
			throws Exception {
		logger.debug("<<<<<<POST senario submittingSummary>>>>");
		String url = request.getRequestURI();
		HashMap<String,String> jsonMap = (HashMap<String,String>) httpEntity;
		ResponseEntity<?> response = null;
		String Jason = null;

		if (jsonMap.get("icon") == null) {
			try {
				String profilepic = userprofileHandler.getProfileIcon(jsonMap.get("telcoUser"));
				jsonMap.put("icon", profilepic);
			} catch (Exception e) {
				if (e instanceof MECException) {
					// requestHandler.deleteMetadata(jsonMap,url);
					// throw e;
				}
				logger.debug("Caught Exception" + e.getMessage());
				// throw new MECException("Server Error", "Server Error",
				// "Failure", HttpStatus.FAILED_DEPENDENCY);
			}
		}
		Jason = boardUtils.ObjectToJsonString(jsonMap);
		logger.debug("Data to be saved: " + Jason);

		response = requestHandler.saveMetaData(Jason, null, url);

		logger.debug("<<<<<<POST senario submittingSummary>>>>");
		return response;
	}

	/*
	 * 
	 * Details of a particular Edge
	 */
	@RequestMapping(value = "edge/details/{edgeName}", method = RequestMethod.GET, headers = ACCEPT_HEADER)
	public ResponseEntity<?> getEdgeDetails(@PathVariable(EGDENAME) String edgeName) throws Exception {
		ResponseEntity<?> response = passRequest.getDetais(type, edgeName);
		return response;

	}

}
