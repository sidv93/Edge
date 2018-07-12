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
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.dt.edge.mec.apps.portal.errorhandler.ClientErrorHandler;
import com.dt.edge.mec.apps.portal.errorhandler.ErrorCodes;
import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.apps.portal.errorhandler.RestErrorHandler;
import com.dt.edge.mec.apps.portal.helper.GenerateRequest;
import com.dt.edge.mec.apps.portal.model.ResponseMessage;
import com.dt.edge.mec.apps.portal.model.UserProfile;
import com.dt.edge.mec.apps.portal.utility.AddHeaders;
import com.dt.edge.mec.apps.portal.utility.GetBaseUrl;
import com.dt.edge.mec.apps.portal.utility.OnBoardUtils;
import com.dt.edge.mec.apps.portal.utility.PortalConstants;
import com.dt.edge.mec.apps.portal.utility.RequestUtils;

@Component
public class CentralReopositoryRequestHandler {
	private String ApplicationCatalogModuleName;
	private String MicroServiceCatalogModuleName;
	private String DevopsCatalogModuleName;
	private String EdgeCatalogModuleName;
	private String CloudletModuleName;
	private String CloudletImageModuleName;
	private String UserModuleName;
	private String DevopsCatalog;
	private String MicroServiceCatalog;
	private String ApplicationCatalog;
	private String EdgeCatalog;
	private String CloudletCatalog;
	private String CloudletImageCatalog;
	private String UserCatalog;
	@Autowired
	GenerateRequest generateRequest;
	@Value("${MEC.subscriptioncount}")
	private String subscriptioncount;
	@Autowired
	UserProfileRequestHandler userProfile;
	@Value("#{${MEC.MODULENAMEMAP}}")
	private Map<String, String> moduleNameMap;
	@Value("#{${MEC.TYPECATALOG}}")
	private Map<String, String> TypeCatalog;
	@Value("${MEC.MSSubscriptions}")
	private String msSubscriptions;
	@Value("${MEC.centralRepoDevOpsViewError}")
	private String centralRepoDevOpsViewError;
	private final static String SUCCESSSTRING = "success";
	private final static String FAILURESTRING = "Failure";
	private final static String SERVEREERORSTRING = "Server Error";
	private final static String MICROSERVICE = "microservice";
	private final static String APPLICATION = "application";
	private final static String EDGE = "edge";
	private final static String CLOUDLET = "cloudlet";
	private final static String CLOUDLETIMAGE = "cloudletImage";
	private final static String APPLICATIONAME = "applicationName";

	@Autowired
	ErrorCodes errCodes;
	@Autowired
	ClientErrorHandler clientErrorHandler;
	@Autowired
	private OnBoardUtils onBoardUtils;
	@Value("#{${MEC.TypeUri}}")
	private Map<String, String> typeUriMap;
	@Autowired
	private GetBaseUrl baseUrl;
	private final Logger logger = LogManager.getLogger(CentralReopositoryRequestHandler.class.getName());

	@PostConstruct
	public void init() {

		ApplicationCatalogModuleName = moduleNameMap.get("APPLICATIONCATALOG");
		MicroServiceCatalogModuleName = moduleNameMap.get("MICROSERVICECATALOG");
		DevopsCatalogModuleName = moduleNameMap.get("DevopsCatalog");
		EdgeCatalogModuleName = moduleNameMap.get("EdgeCatalog");
		CloudletModuleName = moduleNameMap.get("CloudletModule");
		CloudletImageModuleName = moduleNameMap.get("CloudletImageModule");
		UserModuleName = moduleNameMap.get("UserModule");

		MicroServiceCatalog = TypeCatalog.get("MICROSERVICE");
		ApplicationCatalog = TypeCatalog.get("Application");
		DevopsCatalog = TypeCatalog.get("DevopsCatalog");
		EdgeCatalog = TypeCatalog.get("EdgeCatalog");
		CloudletCatalog = TypeCatalog.get("CloudletCatalog");
		CloudletImageCatalog = TypeCatalog.get("CloudletImageCatalog");
		UserCatalog = TypeCatalog.get("UserCatalog");

	/*	logger.info(getApplicationBaseUri());
		logger.info(getMicroServiceBaseUri());
		logger.info(getCloudletImageBaseUri());
		logger.info(getEdgeCataogbaseUri());
		logger.info(getDevopsBaseUri());
		logger.info(getCloudletbaseUri());
		logger.info(getUserBaseUri());*/
	}

	public String getApplicationBaseUri() {
		return baseUrl.getBaseUri(ApplicationCatalogModuleName) + ApplicationCatalog;
	}

	public String getMicroServiceBaseUri() {
		return baseUrl.getBaseUri(MicroServiceCatalogModuleName) + MicroServiceCatalog;
	}

	public String getDevopsBaseUri() {
		return baseUrl.getBaseUri(DevopsCatalogModuleName) + DevopsCatalog;
	}

	public String getEdgeCataogbaseUri() {
		return baseUrl.getBaseUri(EdgeCatalogModuleName) + EdgeCatalog;
	}

	public String getCloudletbaseUri() {
		return baseUrl.getBaseUri(CloudletModuleName) + CloudletCatalog;
	}

	public String getCloudletImageBaseUri() {
		return baseUrl.getBaseUri(CloudletImageModuleName) + CloudletImageCatalog;
	}

	public String getUserBaseUri() {
		return baseUrl.getBaseUri(UserModuleName) + UserCatalog;
	}

	public ResponseEntity<?> getServiceName(String microServiceName) throws MECException {
		logger.info("<<<< enter CentralReopositoryRequestHandler - getServiceName >>>>");
		if (microServiceName == null) {
			throw new MECException("Url validation failed microServiceName missing", "URL validation failed",
					FAILURESTRING, HttpStatus.BAD_REQUEST);
		}
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers = AddHeaders.addAccesstokenHeader(headers);
		RestTemplate requestTemplate = new RestTemplate();
		requestTemplate.setErrorHandler(new RestErrorHandler(errCodes.getCentralRepositoryErrorStatus()));
		ResponseEntity<String> responseFromCentralrepository = null;
		try {
			UriComponentsBuilder builder = null;
			builder = UriComponentsBuilder
					.fromHttpUrl(getMicroServiceBaseUri() + typeUriMap.get(MICROSERVICE) + microServiceName);
			if (builder == null) {
				throw new MECException(PortalConstants.INVALID_ACCESS_MESSAGE, PortalConstants.INVALID_ACCESS_CODE,
						PortalConstants.INVALID_ACCESS_STATUS, HttpStatus.BAD_REQUEST);
			}
			HttpEntity<?> entity = new HttpEntity<>(headers);
			logger.info("URL triggerd for getting a microservice:" + builder.build().encode().toUri());
			responseFromCentralrepository = requestTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET,
					entity, String.class);
			logger.info("responseFromCentralrepository.getStatusCodeValue()="
					+ responseFromCentralrepository.getStatusCodeValue());
			if (responseFromCentralrepository.getStatusCodeValue() == 200) {
				throw new MECException(microServiceName + "already exists", SERVEREERORSTRING, FAILURESTRING,
						HttpStatus.FOUND);
			} else if (responseFromCentralrepository.getStatusCodeValue() != 200) {

				logger.info(microServiceName + "is unique within Microservice catalogue");
			} else {
				clientErrorHandler.handleClientEror(responseFromCentralrepository,
						errCodes.getCentralRepositoryErrorStatus());
			}
		} catch (Exception e) {
			logger.info("exception" + e.getMessage());
			if (e instanceof MECException) {
				throw e;
			}
			throw new MECException(SERVEREERORSTRING, SERVEREERORSTRING, FAILURESTRING, HttpStatus.FAILED_DEPENDENCY);
		}

		try {
			UriComponentsBuilder builder = null;
			builder = UriComponentsBuilder
					.fromHttpUrl(getApplicationBaseUri() + typeUriMap.get(APPLICATION) + microServiceName);
			if (builder == null) {
				throw new MECException(PortalConstants.INVALID_ACCESS_MESSAGE, PortalConstants.INVALID_ACCESS_CODE,
						PortalConstants.INVALID_ACCESS_STATUS, HttpStatus.BAD_REQUEST);
			}
			HttpEntity<?> entity = new HttpEntity<>(headers);
			logger.info("URL triggerd for getting a microservice from application catalogue:"
					+ builder.build().encode().toUri());
			responseFromCentralrepository = requestTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET,
					entity, String.class);
			if (responseFromCentralrepository.getStatusCodeValue() == 200) {
				throw new MECException("Application with name " + microServiceName + "already exists",
						SERVEREERORSTRING, FAILURESTRING, HttpStatus.FOUND);
			} else if (responseFromCentralrepository.getStatusCodeValue() != 200) {
				logger.info(microServiceName + "is unique within Application catalogue");
			} else {
				clientErrorHandler.handleClientEror(responseFromCentralrepository,
						errCodes.getCentralRepositoryErrorStatus());
			}
		} catch (Exception e) {
			logger.info("exception" + e.getMessage());
			if (e instanceof MECException) {
				throw e;
			}
			throw new MECException(SERVEREERORSTRING, SERVEREERORSTRING, FAILURESTRING, HttpStatus.FAILED_DEPENDENCY);
		}

		logger.info("<<<< exit OnBoardRequestHandler - getMicroServiceName >>>>");
		return new ResponseEntity<>(new ResponseMessage("200", "ServiceName is present", SUCCESSSTRING), HttpStatus.OK);

	}

	public ResponseEntity<?> getServiceName(String type, String serviceName) throws MECException {
		logger.info("<<<< enter CentralReopositoryRequestHandler - getMicroServiceName >>>>");
		System.out.println("microservice Id is " + serviceName);
		if (serviceName == null) {
			throw new MECException("Url validation failed microServiceName missing", "URL validation failed",
					FAILURESTRING, HttpStatus.BAD_REQUEST);
		}

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers = AddHeaders.addAccesstokenHeader(headers);
		RestTemplate requestTemplate = new RestTemplate();
		requestTemplate.setErrorHandler(new RestErrorHandler(errCodes.getCentralRepositoryErrorStatus()));
		ResponseEntity<String> responseFromCentralrepository = null;
		try {
			UriComponentsBuilder builder = buildUrlForValidation(type, serviceName);
			HttpEntity<?> entity = new HttpEntity<>(headers);
			if (builder == null) {
				throw new MECException(PortalConstants.INVALID_ACCESS_MESSAGE, PortalConstants.INVALID_ACCESS_CODE,
						PortalConstants.INVALID_ACCESS_STATUS, HttpStatus.BAD_REQUEST);
			}
			logger.info("URL triggerd for getting details:" + builder.build().encode().toUri());
			responseFromCentralrepository = requestTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET,
					entity, String.class);
			if (responseFromCentralrepository == null) {
				throw new MECException(PortalConstants.NULL_RESPONSE_MESSAGE, PortalConstants.NULL_RESPONSE_CODE,
						PortalConstants.NULL_RESPONSE_STATUS, HttpStatus.NO_CONTENT);
			}
			logger.info("responseFromCentralrepository.getStatusCodeValue()="
					+ responseFromCentralrepository.getStatusCodeValue());
			if (responseFromCentralrepository.getStatusCodeValue() == 200) {
				throw new MECException(serviceName + "name already exists", SERVEREERORSTRING, FAILURESTRING,
						HttpStatus.FOUND);
			} else if (responseFromCentralrepository.getStatusCodeValue() != 200) {

				logger.info(serviceName + "name is unique");
			} else {
				clientErrorHandler.handleClientEror(responseFromCentralrepository,
						errCodes.getCentralRepositoryErrorStatus());
			}
		} catch (Exception e) {
			logger.info("exception" + e.getMessage());
			if (e instanceof MECException) {
				throw e;
			}
			throw new MECException(SERVEREERORSTRING, SERVEREERORSTRING, FAILURESTRING, HttpStatus.FAILED_DEPENDENCY);
		}

		return new ResponseEntity<>(new ResponseMessage("200", "Name is unique", SUCCESSSTRING), HttpStatus.OK);
	}

	private UriComponentsBuilder buildUrlForValidation(String type, String serviceName) {
		UriComponentsBuilder builder = null;
		String typeUri = typeUriMap.get(type);
		if (typeUri.contains(EDGE)) {
			builder = UriComponentsBuilder
					.fromHttpUrl(getEdgeCataogbaseUri() + typeUriMap.get(EDGE) + serviceName + "/");
		} else if (typeUri.contains(CLOUDLET)) {
			builder = UriComponentsBuilder
					.fromHttpUrl(getCloudletbaseUri() + typeUriMap.get(CLOUDLET) + serviceName + "/");
		} else if (typeUri.contains(CLOUDLETIMAGE)) {
			builder = UriComponentsBuilder
					.fromHttpUrl(getCloudletImageBaseUri() + typeUriMap.get(CLOUDLETIMAGE) + serviceName + "/");
		}

		return builder;

	}

	public ResponseEntity<?> DeleteSaveMetaData(String microServiceName, String url) throws Exception {
		logger.info("<<<< enter CentralReopositoryRequestHandler - DeleteSaveMetaData >>>>");
		UriComponentsBuilder builder = null;
		if (url.contains(APPLICATION)) {
			logger.info("URL triggerd for deleting application metadata");
			builder = UriComponentsBuilder
					.fromHttpUrl(getApplicationBaseUri() + typeUriMap.get(APPLICATION) + microServiceName);
		} else {
			logger.info("URL triggerd for deleting microservice metadata");
			builder = UriComponentsBuilder
					.fromHttpUrl(getMicroServiceBaseUri() + typeUriMap.get(MICROSERVICE) + microServiceName);
		}
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.DELETE);
		ResponseEntity<String> resposne = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit CentralReopositoryRequestHandler - DeleteSaveMetaData >>>>");
		if (resposne.getStatusCode().equals(HttpStatus.OK)) {
			String message = "Metadata deleted sucessfully";
			return new ResponseEntity<>(
					new ResponseMessage(resposne.getStatusCode().toString(), message, SUCCESSSTRING), HttpStatus.OK);
		} else {
			String errorMgs = "Saving data is failed";
			return new ResponseEntity<>(new ResponseMessage(resposne.getStatusCode().toString(), errorMgs, "failed"),
					HttpStatus.BAD_REQUEST);
		}

	}

	public ResponseEntity<?> saveDataToDB(String Jason, String method, String url) throws MECException {
		logger.info("<<<< enter CentralReopositoryRequestHandler - saveDataToDB >>>>");
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers = AddHeaders.addAccesstokenHeader(headers);
		RestTemplate requestTemplate = new RestTemplate();
		requestTemplate.setErrorHandler(new RestErrorHandler(errCodes.getCentralRepositoryErrorStatus()));
		ResponseEntity<String> resposne = null;
		try {
			HttpEntity<String> metadataEntity = new HttpEntity<String>(Jason, headers);
			resposne = requestBreakerForMSAPP(url, requestTemplate, metadataEntity, method);
			if (resposne == null) {
				throw new MECException(PortalConstants.NULL_RESPONSE_MESSAGE, PortalConstants.NULL_RESPONSE_CODE,
						PortalConstants.NULL_RESPONSE_STATUS, HttpStatus.NO_CONTENT);
			}else{
				logger.debug("Response Body: " + resposne.getBody());
			}
			clientErrorHandler.handleClientEror(resposne, errCodes.getCentralRepositoryErrorStatus());
		} catch (Exception e) {
			logger.info("exception" + e.getMessage());
			if (e instanceof MECException) {
				throw e;
			}
			throw new MECException("Server Error Happened", SERVEREERORSTRING, FAILURESTRING,
					HttpStatus.FAILED_DEPENDENCY);
		}
		if (resposne.getStatusCode().equals(HttpStatus.OK)) {
			String message = "Save data into DB sucessfully";
			return new ResponseEntity<>(
					new ResponseMessage(resposne.getStatusCode().toString(), message, SUCCESSSTRING), HttpStatus.OK);
		} else {
			String errorMgs = "Saving data is failed";
			return new ResponseEntity<>(new ResponseMessage(resposne.getStatusCode().toString(), errorMgs, "failed"),
					HttpStatus.BAD_REQUEST);
		}
	}

	private ResponseEntity<String> requestBreakerForMSAPP(String url, RestTemplate requestTemplate,
			HttpEntity<String> metadataEntity, String method) {
		ResponseEntity<String> resposne = null;
		HashMap<String, String> map = onBoardUtils.stringToObject(metadataEntity.getBody(), new HashMap<>());
		if (url.contains("/onboard/" + APPLICATION)) {
			logger.info("URL triggerd for storing metadata in central repo:" + getApplicationBaseUri()
					+ typeUriMap.get(APPLICATION) + map.get(APPLICATIONAME));
			if (!"PUT".equals(method)) {
				resposne = requestTemplate.exchange(getApplicationBaseUri() + typeUriMap.get(APPLICATION),
						HttpMethod.POST, metadataEntity, String.class);
			} else {
				resposne = requestTemplate.exchange(
						getApplicationBaseUri() + typeUriMap.get(APPLICATION) + map.get(APPLICATIONAME), HttpMethod.PUT,
						metadataEntity, String.class);
			}
		} else if (url.contains("/onboard/" + MICROSERVICE)) {
			logger.info("URL triggerd for storing metadata in central repo:" + getMicroServiceBaseUri()
					+ typeUriMap.get(MICROSERVICE));
			if (!"PUT".equals(method)) {
				resposne = requestTemplate.exchange(getMicroServiceBaseUri() + typeUriMap.get(MICROSERVICE),
						HttpMethod.POST, metadataEntity, String.class);
			} else {
				resposne = requestTemplate.exchange(
						getMicroServiceBaseUri() + typeUriMap.get(MICROSERVICE) + map.get("microServiceName"),
						HttpMethod.PUT, metadataEntity, String.class);
			}
			/*
			 * below it is not decided format from central repo team . Assuming
			 * it is same as Application
			 */
		} else if (url.contains("/submit/cloudlets")) {
			logger.info("URL triggerd for storing metadata in central repo:" + getCloudletbaseUri()
					+ typeUriMap.get(CLOUDLET));

			resposne = requestTemplate.exchange(getCloudletbaseUri() + typeUriMap.get(CLOUDLET), HttpMethod.POST,
					metadataEntity, String.class);
		} else if (url.contains("/cloudletsImage/save")) {
			logger.info("URL triggerd for storing metadata in central repo:" + getCloudletImageBaseUri()
					+ typeUriMap.get(CLOUDLETIMAGE));

			resposne = requestTemplate.exchange(getCloudletImageBaseUri() + typeUriMap.get(CLOUDLETIMAGE),
					HttpMethod.POST, metadataEntity, String.class);
		} else if (url.contains("/onboard/" + EDGE)) {
			// edge url needed for edge onboard request
			logger.info("URL triggerd for storing metadata in central repo:" + getEdgeCataogbaseUri()
					+ typeUriMap.get(EDGE));

			resposne = requestTemplate.exchange(getEdgeCataogbaseUri() + typeUriMap.get(EDGE), HttpMethod.POST,
					metadataEntity, String.class);
		}

		return resposne;
	}

	
	/*
	 * This method will Handled request for microservices .
	 */
	public ResponseEntity<?> getlistOFSubscribedMicroService(String type, HashMap<String, String> pathParam,
			HashMap<String, String> matixParam, HashMap<String, String> querryParam) throws MECException {
		logger.info("<<<< entry getlistOFSubscribedMicroService >>>>");
		logger.info(matixParam);
		logger.info(querryParam);
		MultiValueMap<String, String> params = RequestUtils.getQuerryMap((HashMap<String, String>) querryParam);
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getApplicationBaseUri() + msSubscriptions + "/"
				+ pathParam.get("userId") + "/" + RequestUtils.generateMatrixString(matixParam)).queryParams(params);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		logger.info("URL triggerd for getting list of subscribed microservices");
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit getlistOFSubscribedMicroService >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> getAllSubOperatorList(String type, Map<String, String> matrixParam,
			Map<String, String> querryParam) throws MECException {
		logger.info("<<<< Inside getAllSubOperatorList >>>>");
		String typeUri = typeUriMap.get(type);
		if (matrixParam == null || matrixParam.isEmpty()) {
			throw new MECException("search criteria is  null", "Request validation failed", FAILURESTRING,
					HttpStatus.BAD_REQUEST);
		}
		MultiValueMap<String, String> params = null;
		params = RequestUtils.getQuerryMap((HashMap<String, String>) querryParam);
		UriComponentsBuilder builder = null;// UriComponentsBuilder.fromHttpUrl(centralRepobaseURI
											// +
											// operatorListURl+"/"+operator);
		if (typeUri.contains(EDGE)) {
			logger.info("URL triggerd for getting user list");
			String matriparam = RequestUtils.generateMatrixString(matrixParam);
			builder = UriComponentsBuilder.fromHttpUrl(getUserBaseUri() + "/" + "userprofile/users/" + matriparam)
					.queryParams(params);
		} else if (typeUri.contains(CLOUDLET)) {
			logger.info("URL triggerd for getting list of edges");
			String matriparam = RequestUtils.generateMatrixString(matrixParam);
			builder = UriComponentsBuilder.fromHttpUrl(getEdgeCataogbaseUri() + typeUriMap.get("edges") + matriparam)
					.queryParams(params);

		}
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit getAllSubOperatorList >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	/*
	 * It will give combine json
	 */
	public ResponseEntity<?> getListOfEdgesAndOperators(String type) throws MECException {
		ResponseEntity<?> response = userProfile.getAllOperatorList();
		return response;
	}

	public ResponseEntity<?> getTotalAvailableCredit(String userId) throws MECException {
		logger.info("<<<< Inside getTotalAvailableCredit >>>>");
		UserProfile userfile = userProfile.getUserProfile(userId, null);
		HashMap<String, String> responseMap = new HashMap<>();
		responseMap.put("credit", userfile.getCredits());
		String responseCredit = onBoardUtils.ObjectToJsonString(responseMap);
		logger.info("<<<< exit getTotalAvailableCredit >>>>");
		return new ResponseEntity<String>(responseCredit, HttpStatus.OK);
	}

	public String getListOfEdges(String type, String userName) throws MECException {
		logger.info("<<<< Inside getListOfEdges >>>>");
		String listOfEdges = null;
		String typeUri = typeUriMap.get(type);
		if (userName == null) {
			throw new MECException("userName null", "Request validation failed", FAILURESTRING, HttpStatus.BAD_REQUEST);
		}
		UriComponentsBuilder builder = null;
		if (typeUri.contains(EDGE)) {
			builder = UriComponentsBuilder.fromHttpUrl(getEdgeCataogbaseUri() + typeUriMap.get(EDGE) + userName);
		} else if (typeUri.contains(CLOUDLET)) {
			builder = UriComponentsBuilder.fromHttpUrl(getCloudletbaseUri() + typeUriMap.get(CLOUDLET) + userName);
		} else if (typeUri.contains(CLOUDLETIMAGE)) {
			builder = UriComponentsBuilder
					.fromHttpUrl(getCloudletImageBaseUri() + typeUriMap.get(CLOUDLETIMAGE) + userName);
		}
		logger.info("URL triggerd for getting list of edges:");
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		listOfEdges = responseEntity.getBody();
		logger.info("<<<< exit getListOfEdges >>>>");
		return listOfEdges;
	}

	public ResponseEntity<?> gettotalsubscription(String userId) throws MECException {
		logger.info("<<<< entry gettotalsubscription >>>>");
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(
				getApplicationBaseUri() + typeUriMap.get("application") + subscriptioncount + "/" + userId);
		logger.info("Url triggered for gettotalsubscription");
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit gettotalsubscription >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}
}
