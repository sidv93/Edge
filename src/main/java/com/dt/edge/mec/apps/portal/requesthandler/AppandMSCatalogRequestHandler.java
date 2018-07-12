package com.dt.edge.mec.apps.portal.requesthandler;

import java.util.Collections;
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
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.dt.edge.mec.apps.portal.errorhandler.ClientErrorHandler;
import com.dt.edge.mec.apps.portal.errorhandler.ErrorCodes;
import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.apps.portal.errorhandler.RestErrorHandler;
import com.dt.edge.mec.apps.portal.helper.GenerateRequest;
import com.dt.edge.mec.apps.portal.model.ApplicationServiceDelete;
import com.dt.edge.mec.apps.portal.model.MicroServiceDelete;
import com.dt.edge.mec.apps.portal.model.ResponseMessage;
import com.dt.edge.mec.apps.portal.utility.AddHeaders;
import com.dt.edge.mec.apps.portal.utility.GetBaseUrl;
import com.dt.edge.mec.apps.portal.utility.OnBoardUtils;
import com.dt.edge.mec.apps.portal.utility.PortalConstants;
import com.dt.edge.mec.apps.portal.utility.RequestUtils;

@Component
public class AppandMSCatalogRequestHandler {
	private String ApplicationCatalogModuleName;
	private String MicroServiceCatalogModuleName;
	private String MicroServiceCatalog;
	private String ApplicationCatalog;
	@Value("#{${MEC.MODULENAMEMAP}}")
	private Map<String, String> moduleNameMap;
	@Value("#{${MEC.TYPECATALOG}}")
	private Map<String, String> TypeCatalog;
	private final static String SUCCESSSTRING = "success";
	private final static String CAUGHTEXCEPTIONSTRING = "CAUGHT EXCEPTION";
	private final static String MICROSERVICE = "microservice";
	private final static String APPLICATION = "application";
	private final static String APPLICATIONAME = "applicationName";
	@Autowired
	private OnBoardUtils onBoardUtils;
	@Value("${MEC.subscriptioncount}")
	private String subscriptioncount;
	@Value("#{${MEC.TypeUri}}")
	private Map<String, String> typeUriMap;
	@Value("#{${MEC.MSCATALOGBURIMAP}}")
	private Map<String, String> msCatalogBUriMap;
	@Autowired
	ErrorCodes errCodes;
	@Autowired
	ClientErrorHandler clientErrorHandler;
	@Autowired
	private GetBaseUrl baseUrl;
	@Autowired
	GenerateRequest generateRequest;
	private final Logger logger = LogManager.getLogger(AppandMSCatalogRequestHandler.class.getName());

	@PostConstruct
	public void init() {
		ApplicationCatalogModuleName = moduleNameMap.get("APPLICATIONCATALOG");
		MicroServiceCatalogModuleName = moduleNameMap.get("MICROSERVICECATALOG");
		MicroServiceCatalog = TypeCatalog.get("MICROSERVICE");
		ApplicationCatalog = TypeCatalog.get("Application");
		logger.info(getApplicationBaseUri());
		logger.info(getMicroServiceBaseUri());
	}

	public String getApplicationBaseUri() {
		return baseUrl.getBaseUri(ApplicationCatalogModuleName) + ApplicationCatalog;
	}

	public String getMicroServiceBaseUri() {
		return baseUrl.getBaseUri(MicroServiceCatalogModuleName) + MicroServiceCatalog;
	}

	public ResponseEntity<?> deleteRequest(String requestData, String url, String type) throws MECException {
		HttpHeaders headers = new HttpHeaders();
		String typeURI = typeUriMap.get(type);
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers = AddHeaders.addAccesstokenHeader(headers);
		logger.info("Got request to " + typeURI + " for Id:" + (String) requestData);
		ResponseEntity<String> responseEntityDeleteApplication = null;
		RestTemplate restTemplateDeleteApplication = new RestTemplate();
		restTemplateDeleteApplication.setErrorHandler(new RestErrorHandler(errCodes.getCentralRepositoryErrorStatus()));
		UriComponentsBuilder builder = null;
		HttpEntity<?> entity = null;
		try {
			if (url.contains("getMicroService")) {
				MicroServiceDelete msDelete = new MicroServiceDelete();
				msDelete.setMicroServiceName(requestData);
				msDelete.setOnBoardStatus("Disabled");
				msDelete.setEnable(false);
				builder = UriComponentsBuilder.fromHttpUrl(getMicroServiceBaseUri() + typeURI + requestData);
				entity = new HttpEntity<>(msDelete, headers);
			} else if (url.contains("getMobileApps")) {
				ApplicationServiceDelete appDelete = new ApplicationServiceDelete();
				appDelete.setApplicationName(requestData);
				appDelete.setOnBoardStatus("Disabled");
				appDelete.setEnable(false);
				builder = UriComponentsBuilder.fromHttpUrl(getApplicationBaseUri() + typeURI + requestData);
				entity = new HttpEntity<>(appDelete, headers);
			}
			if (builder != null) {
				logger.info("URL triggerd for delete request:" + builder.build().encode().toUri());
				logger.debug("entity for delete request:" + entity.toString());
				responseEntityDeleteApplication = restTemplateDeleteApplication
						.exchange(builder.build().encode().toUri(), HttpMethod.PUT, entity, String.class);
			} else {
				throw new MECException(PortalConstants.INVALID_ACCESS_MESSAGE, PortalConstants.INVALID_ACCESS_CODE,
						PortalConstants.INVALID_ACCESS_STATUS, HttpStatus.BAD_REQUEST);
			}
			clientErrorHandler.handleClientEror(responseEntityDeleteApplication,
					errCodes.getCentralRepositoryErrorStatus());
		} catch (Exception e) {
			if (e instanceof MECException) {
				throw e;
			}
			logger.info(CAUGHTEXCEPTIONSTRING + e.getMessage());
			throw new MECException(PortalConstants.SERVER_ERROR_STRING, PortalConstants.SERVER_ERROR_STRING,
					PortalConstants.FAILURE_STRING, HttpStatus.FAILED_DEPENDENCY);
		}
		logger.info("sending message");
		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage(responseEntityDeleteApplication.getStatusCode().toString(), "Deletion Done",
						SUCCESSSTRING),
				HttpStatus.OK);
	}

	public ResponseEntity<?> getAllRequestHandler(String type, Map<String, String> matixParam,
			HashMap<String, String> querryParam) throws Exception {
		String typeUri = typeUriMap.get(type);
		logger.info("typeUri=" + typeUri);
		MultiValueMap<String, String> params = RequestUtils.getQuerryMap((HashMap<String, String>) querryParam);
		UriComponentsBuilder builder = null;
		if (typeUri.contains(APPLICATION)) {
			builder = UriComponentsBuilder
					.fromHttpUrl(getApplicationBaseUri() + typeUri + RequestUtils.generateMatrixString(matixParam))
					.queryParams(params);
		} else if (typeUri.contains(MICROSERVICE)) {
			builder = UriComponentsBuilder
					.fromHttpUrl(getMicroServiceBaseUri() + typeUri + RequestUtils.generateMatrixString(matixParam))
					.queryParams(params);
		} else {
			logger.info("invalid typeUri=" + typeUri);
			throw new MECException(PortalConstants.INVALID_ACCESS_MESSAGE, PortalConstants.INVALID_ACCESS_CODE,
					PortalConstants.INVALID_ACCESS_STATUS, HttpStatus.BAD_REQUEST);
		}
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> getHandleRequestHandler(String type, String name) throws Exception {

		String typeUri = typeUriMap.get(type);
		if (name.trim().isEmpty()) {
			throw new MECException("Url validation failed field missing", "URL validation failed",
					PortalConstants.FAILURE_STRING, HttpStatus.BAD_REQUEST);
		}
		logger.info("Got request for " + type + " Id" + name);
		UriComponentsBuilder builder = null;
		if (typeUri.contains(APPLICATION)) {
			builder = UriComponentsBuilder.fromHttpUrl(getApplicationBaseUri() + typeUri + "/" + name);
		} else {
			builder = UriComponentsBuilder.fromHttpUrl(getMicroServiceBaseUri() + typeUri + "/" + name);
		}
		logger.info("Request triggerd for getting an application detail");
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> gettotalsubscription(String userId) throws MECException {
		logger.info("Request triggered for gettotalsubscription");
		UriComponentsBuilder builder = UriComponentsBuilder
				.fromHttpUrl(getApplicationBaseUri() + typeUriMap.get(APPLICATION) + subscriptioncount + "/" + userId);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		ResponseEntity<String> responseEntityUsage = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit SetUserProfileRequestHandler - handleRequest >>>>");
		return new ResponseEntity<String>(responseEntityUsage.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> editRequestHandler(String type, HashMap<String, String> json) throws Exception {
		HttpHeaders headers = AddHeaders.generateHeaders(MediaType.APPLICATION_JSON);
		String typeUri = typeUriMap.get(type);
		String jason = onBoardUtils.ObjectToJsonString(json);
		logger.info("Got request to Edit application " + jason);
		UriComponentsBuilder builder = null;
		if (typeUri.contains(APPLICATION)) {
			builder = UriComponentsBuilder
					.fromHttpUrl(getApplicationBaseUri() + typeUri + "/" + json.get(APPLICATIONAME));

		} else {
			builder = UriComponentsBuilder
					.fromHttpUrl(getMicroServiceBaseUri() + typeUri + "/" + json.get("microServiceName"));
		}
		HttpEntity<String> editEntity = new HttpEntity<String>(jason, headers);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("methodType", HttpMethod.PUT);
		reqMap.put("httpEntity", editEntity);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage(responseEntity.getStatusCode().toString(), "Edit Done", SUCCESSSTRING),
				HttpStatus.OK);
	}

	public ResponseEntity<?> submitRating(HashMap<String, String> json, HttpMethod methodType) throws MECException {
		HttpHeaders headers = AddHeaders.generateHeaders(MediaType.APPLICATION_JSON);
		String ratingJson = onBoardUtils.ObjectToJsonString(json);
		logger.info("Got request to submit rating " + ratingJson);
		UriComponentsBuilder builder = null;
		if(methodType != null && (methodType.equals(HttpMethod.POST))){
		    builder = UriComponentsBuilder.fromHttpUrl(getMicroServiceBaseUri() + msCatalogBUriMap.get("submitRating"));
		}else if(methodType != null && (methodType.equals(HttpMethod.PUT))){
			builder = UriComponentsBuilder.fromHttpUrl(getMicroServiceBaseUri() + msCatalogBUriMap.get("updateRating"));
		}else{
			throw new MECException(PortalConstants.INVALID_ACCESS_MESSAGE, PortalConstants.INVALID_ACCESS_CODE,
					PortalConstants.INVALID_ACCESS_STATUS, HttpStatus.BAD_REQUEST);
		}
		HttpEntity<String> postEntity = new HttpEntity<String>(ratingJson, headers);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("methodType", methodType);
		reqMap.put("httpEntity", postEntity);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage(responseEntity.getStatusCode().toString(), "Rating Submitted", SUCCESSSTRING),
				HttpStatus.OK);
	}

	public ResponseEntity<?> getMSRating(Map<String, String> matrixParam) throws MECException {
		logger.info("Request triggered for getting rating details given by a user to a microservice");
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getMicroServiceBaseUri()
				+ msCatalogBUriMap.get("getRatingByUser") + matrixParam.get(PortalConstants.USERID)+"/"+matrixParam.get(PortalConstants.MICROSERVICENAME));
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> getMSRatingCount(String microServiceName) throws MECException {
		logger.info("Request triggered for getting count of all the stars");
		UriComponentsBuilder builder = UriComponentsBuilder
				.fromHttpUrl(getMicroServiceBaseUri() + msCatalogBUriMap.get("recCountAllRatings") + microServiceName);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit getMSRatingCount - handleRequest >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> getMSTopReviews(Map<String, String> matixParam,
			HashMap<String, String> queryParam) throws MECException {
		logger.info("Request triggered for getting microservice top reviews");
		MultiValueMap<String, String> params = RequestUtils.getQuerryMap((HashMap<String, String>) queryParam);
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(
				getMicroServiceBaseUri() + msCatalogBUriMap.get("getTopReviews")+"/" + RequestUtils.generateMatrixString(matixParam))
				.queryParams(params);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit getMSRatingReviews - handleRequest >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> getMSRatingReviews(String microServiceName,String rating,
			HashMap<String, String> queryParam) throws MECException {
		logger.info("Request triggered for getting microservice rating reviews");
		MultiValueMap<String, String> params = RequestUtils.getQuerryMap((HashMap<String, String>) queryParam);
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(
				getMicroServiceBaseUri() + msCatalogBUriMap.get("submitRating") + "/" + microServiceName + "/" + rating)
				.queryParams(params);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit getMSRatingReviews - handleRequest >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);	}
}
