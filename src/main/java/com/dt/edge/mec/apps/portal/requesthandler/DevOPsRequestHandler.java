package com.dt.edge.mec.apps.portal.requesthandler;

import java.util.HashMap;
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
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.dt.edge.mec.apps.portal.errorhandler.ClientErrorHandler;
import com.dt.edge.mec.apps.portal.errorhandler.ErrorCodes;
import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.apps.portal.errorhandler.RestErrorHandler;
import com.dt.edge.mec.apps.portal.helper.GenerateRequest;
import com.dt.edge.mec.apps.portal.model.ApplicationServiceDelete;
import com.dt.edge.mec.apps.portal.model.ResponseMessage;
import com.dt.edge.mec.apps.portal.utility.AddHeaders;
import com.dt.edge.mec.apps.portal.utility.GetBaseUrl;

@Component
public class DevOPsRequestHandler {
	private String DevopsModuleName;
	@Value("#{${MEC.DEVOPSURIMAP}}")
	private Map<String, String> DevopsMapUri;
	@Value("#{${MEC.MODULENAMEMAP}}")
	private Map<String, String> moduleNameMap;
	@Autowired
	ErrorCodes errCodes;
	@Autowired
	ClientErrorHandler clientErrorHandler;
	@Autowired
	GenerateRequest generateRequest;
	private String approvalMicro;
	private String approvalApp;
	private String denyAppUrl;
	private String denyMicroUrl;
	@Value("#{${MEC.TypeUri}}")
	private Map<String, String> typeUriMap;
	@Autowired
	private GetBaseUrl baseUrl;
	@Value("${MEC.DevopsUri}")
	private String DevopsUri;
	private static final String FAILURE_STRING = "Failure";
	private static final String SERVER_ERROR_STRING = "Server Error";
	private static final String MICROSERVICENAME = "microServiceName";
	private static final String APPLICATIONNAME = "applicationName";
	private static final String APPROVEDENY_STRING = "approveDeny";
	private final Logger logger = LogManager.getLogger(DevOPsRequestHandler.class.getName());

	/*
	 * sending request for approval to devops
	 */
	@PostConstruct
	public void init() {
		DevopsModuleName = moduleNameMap.get("DEVOPS");
		approvalMicro = DevopsMapUri.get("approvalMicro");
		approvalApp = DevopsMapUri.get("approvalApp");
		denyAppUrl = DevopsMapUri.get("denyAppUrl");
		denyMicroUrl = DevopsMapUri.get("denyMicroUrl");
		logger.info(DevopsMapUri);
	}

	private String getDevopsBaseUri() {
		return baseUrl.getBaseUri(DevopsModuleName) + DevopsUri;
	}

	public ResponseEntity<?> approvalRequest(Object requestData) throws MECException {
		logger.info("<<<< enter approvalRequest >>>>");
		Map<String, String> request = (HashMap<String, String>) requestData;
		UriComponentsBuilder builder = urlMakerForApproval(request);
		HttpHeaders headers = AddHeaders.generateHeaders(MediaType.APPLICATION_JSON);
		HttpEntity<?> entity = new HttpEntity<>(headers);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("methodType", HttpMethod.POST);
		reqMap.put("httpEntity", entity);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit approvalRequest >>>>");
		return new ResponseEntity<>(new ResponseMessage(responseEntity.getStatusCode().toString(), "approved", "success"), HttpStatus.OK);
	}

	private UriComponentsBuilder urlMakerForApproval(Map<String, String> request) throws MECException {
		UriComponentsBuilder builder = null;
		String url = null;
		if (request.get(MICROSERVICENAME) != null && request.get(MICROSERVICENAME) != "") {
			if (checkForApprovalAndDeny(request)) {
				url = approvalMicro.replaceFirst(MICROSERVICENAME, request.get(MICROSERVICENAME));
			} else {
				url = denyMicroUrl.replaceFirst(MICROSERVICENAME, request.get(MICROSERVICENAME));
			}
			logger.debug("Approval or denial url of microServiceName " + url);
			builder = UriComponentsBuilder.fromHttpUrl(getDevopsBaseUri() + url);
		} else {
			if (checkForApprovalAndDeny(request)) {
				url = approvalApp.replaceFirst(APPLICATIONNAME, request.get(APPLICATIONNAME));
			} else {
				url = denyAppUrl.replaceFirst(APPLICATIONNAME, request.get(APPLICATIONNAME));
			}
			// approvalApp=approvalApp.replaceFirst(APPLICATIONNAME,
			// request.get(APPLICATIONNAME));
			logger.debug("Approval or denial url of microServiceName " + url);
			builder = UriComponentsBuilder.fromHttpUrl(getDevopsBaseUri() + url);
		}

		return builder;

	}

	private boolean checkForApprovalAndDeny(Map<String, String> request) throws MECException {
		if (request.get(APPROVEDENY_STRING) == null || request.get(APPROVEDENY_STRING) == "") {
			throw new MECException("Missing value", SERVER_ERROR_STRING, FAILURE_STRING, HttpStatus.FAILED_DEPENDENCY);
		}
		if (request.get(APPROVEDENY_STRING).equals("approve")) {
			return true;
		} else if (request.get(APPROVEDENY_STRING).equals("deny")) {
			return false;
		}
		return false;
	}

	/*
	 * Request for deletion to DevOps
	 */
	public ResponseEntity<?> deleteRequest(String requestData, String url) throws MECException {
		HttpHeaders headers = new HttpHeaders();
		ApplicationServiceDelete msDelete = new ApplicationServiceDelete();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers = AddHeaders.addAccesstokenHeader(headers);
		logger.info("Got request to Delete App/Microservice for Id:" + (String) requestData);
		ResponseEntity<String> responseEntityDeleteApplication = null;
		RestTemplate restTemplateDeleteApplication = new RestTemplate();
		restTemplateDeleteApplication.setErrorHandler(new RestErrorHandler(errCodes.getDevopsErrorStatus()));
		UriComponentsBuilder builder = null;
		try {
			// sending url to Devops to delete
			if (url.contains("getMicroService")) {
				/*
				 * DELETE - /microservice/<MSName>
				 */
				builder = UriComponentsBuilder
						.fromHttpUrl(getDevopsBaseUri() + typeUriMap.get("microservices") + "/" + requestData);
			} else {
				msDelete.setApplicationName(requestData);
				msDelete.setOnBoardStatus("Disabled");
				builder = UriComponentsBuilder
						.fromHttpUrl(getDevopsBaseUri() + typeUriMap.get("applications") + "/" + requestData);
			}
			logger.info("Delete rquest " + builder.build().encode().toUri());
			logger.debug("URL triggerd for deleting app/microservice:" + builder.build().encode().toUri());

			HttpEntity<?> entity = new HttpEntity<>(msDelete, headers);
			responseEntityDeleteApplication = restTemplateDeleteApplication.exchange(builder.build().encode().toUri(),
					HttpMethod.DELETE, entity, String.class);
			clientErrorHandler.handleClientEror(responseEntityDeleteApplication, errCodes.getDevopsErrorStatus());
		} catch (Exception e) {
			if (e instanceof MECException) {
				throw e;
			}
			logger.debug("Caught Exception" + e.getMessage());
			throw new MECException(SERVER_ERROR_STRING, SERVER_ERROR_STRING, FAILURE_STRING,
					HttpStatus.FAILED_DEPENDENCY);
		}

		return new ResponseEntity<ResponseMessage>(new ResponseMessage(
				responseEntityDeleteApplication.getStatusCode().toString(), "Deletion Done", "success"), HttpStatus.OK);
	}

	/*
	 * Sending request to devops for build
	 */
	public ResponseEntity<?> sendRequestToDevOps(String jason, String method, String url, String name)
			throws MECException {
		logger.info("<<<< enter sendRequestToDevOps >>>>");
		logger.debug("Sending request to DevOPS with data " + jason);
		HttpHeaders headers = AddHeaders.generateHeaders(MediaType.APPLICATION_JSON);
		UriComponentsBuilder builder = null;
		HttpEntity<String> entity = new HttpEntity<String>(jason, headers);
		if (url.contains("/onboard/applications")) {
			if ("PUT".equals(method))
				builder = UriComponentsBuilder.fromHttpUrl(getDevopsBaseUri() + typeUriMap.get("applications") + name);
			else
				builder = UriComponentsBuilder.fromHttpUrl(getDevopsBaseUri() + typeUriMap.get("applications"));
		} else {
			if ("PUT".equals(method))
				builder = UriComponentsBuilder.fromHttpUrl(getDevopsBaseUri() + typeUriMap.get("microservices") + name);
			else
				builder = UriComponentsBuilder.fromHttpUrl(getDevopsBaseUri() + typeUriMap.get("microservices"));
		}
		logger.debug("Json object:" + entity.toString());
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("httpEntity", entity);
		if (!"PUT".equals(method)) {
			reqMap.put("methodType", HttpMethod.POST);
		} else {
			reqMap.put("methodType", HttpMethod.PUT);
		}
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		String message = "Request sent succesfully to devops";
		return new ResponseEntity<>(new ResponseMessage(responseEntity.getStatusCode().toString(), message, "success"),
				HttpStatus.OK);
	}

}
