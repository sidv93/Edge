package com.dt.edge.mec.apps.portal.requesthandler;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.dt.edge.mec.apps.portal.errorhandler.ClientErrorHandler;
import com.dt.edge.mec.apps.portal.errorhandler.ErrorCodes;
import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.apps.portal.helper.GenerateRequest;
import com.dt.edge.mec.apps.portal.utility.GetBaseUrl;
import com.dt.edge.mec.apps.portal.utility.PortalConstants;

@Component
public class DevopsCRRequestHandler {

	private String devopsCRModuleName;
	@Value("#{${MEC.DEVOPSCRSURIMAP}}")
	private Map<String, String> devOpsCRUri;
	@Value("#{${MEC.MODULENAMEMAP}}")
	private Map<String, String> moduleNameMap;
	@Autowired
	GenerateRequest generateRequest;
	@Autowired
	ErrorCodes errCodes;
	@Autowired
	ClientErrorHandler clientErrorHandler;
	private String viewError;
	private String endPoints;
	@Autowired
	private GetBaseUrl baseUrl;
	private static final String DEVOPSCR_MODULE = "DevopsCatalog";
	private static final String SANDBOX_ENDPOINTS = "sandbox";
	private static final String VIEW_ERROR = "error";
	private final Logger logger = LogManager.getLogger(DevopsCRRequestHandler.class.getName());

	@PostConstruct
	public void init() {
		devopsCRModuleName = moduleNameMap.get(DEVOPSCR_MODULE);
		endPoints = devOpsCRUri.get(SANDBOX_ENDPOINTS);
		viewError = devOpsCRUri.get(VIEW_ERROR);
	}

	private String getDevOpsCRBaseUri() {
		return baseUrl.getBaseUri(devopsCRModuleName);
	}

	public ResponseEntity<?> handleErrorLinkRequest(String type, String name) throws Exception {
		logger.info("<<<< enter handleErrorLinkRequest >>>>");
		if (name.trim().isEmpty()) {
			throw new MECException("Url validation failed.Field missing", "URL validation failed",
					PortalConstants.FAILURE_STRING, HttpStatus.BAD_REQUEST);
		}
		logger.info("Got view error request for" + type + " with name: " + name);
		UriComponentsBuilder builder = UriComponentsBuilder
				.fromHttpUrl(getDevOpsCRBaseUri() + viewError + type + "/" + name);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit handleErrorLinkRequest >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> fetchSandoxEndPoints(String type, String name) throws Exception {
		logger.info("<<<< enter fetchSandoxEndPoints >>>>");
		if (name.trim().isEmpty()) {
			throw new MECException("Url validation failed.Field missing", "URL validation failed",
					PortalConstants.FAILURE_STRING, HttpStatus.BAD_REQUEST);
		}
		logger.info("Got view error request for" + type + " with name: " + name);
		UriComponentsBuilder builder = UriComponentsBuilder
				.fromHttpUrl(getDevOpsCRBaseUri() + endPoints + type + "/" + name);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit fetchSandoxEndPoints >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

}
