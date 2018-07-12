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
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;

import com.dt.edge.mec.apps.portal.errorhandler.ClientErrorHandler;
import com.dt.edge.mec.apps.portal.errorhandler.ErrorCodes;
import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.apps.portal.helper.GenerateRequest;
import com.dt.edge.mec.apps.portal.model.UserProfile;
import com.dt.edge.mec.apps.portal.utility.AddHeaders;
import com.dt.edge.mec.apps.portal.utility.GetBaseUrl;
import com.dt.edge.mec.apps.portal.utility.OnBoardUtils;
import com.dt.edge.mec.apps.portal.utility.PortalConstants;

@Component
public class UserProfileRequestHandler {
	private String UserModuleName;
	private String UserCatalog;
	@Value("#{${MEC.MODULENAMEMAP}}")
	private Map<String, String> moduleNameMap;
	@Value("#{${MEC.TYPECATALOG}}")
	private Map<String, String> TypeCatalog;
	@Autowired
	GenerateRequest generateRequest;

	@Autowired
	ErrorCodes errCodes;
	@Autowired
	ClientErrorHandler clientErrorHandler;
	@Autowired
	private OnBoardUtils onBoardUtils;
	@Autowired
	private GetBaseUrl baseUrl;
	private final Logger logger = LogManager.getLogger(UserProfileRequestHandler.class.getName());

	@PostConstruct
	public void init() {
		UserModuleName = moduleNameMap.get("UserModule");
		UserCatalog = TypeCatalog.get("UserCatalog");
		logger.info("User" + getUserBaseUri());
	}

	public String getUserBaseUri() {
		return baseUrl.getBaseUri(UserModuleName) + UserCatalog;
	}

	public ResponseEntity<?> getAllOperatorList() throws MECException {
		logger.info("Inside getAllOperatorList");
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getUserBaseUri() + "/" + "userprofile/users/");
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		logger.info("URL triggerd for getting list of users");
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public String getProfileIcon(Object object) throws MECException {
		String userId = (String) object;
		String userpic = null;
		logger.info("<<<< enter getProfileIcon >>>>");
		logger.info("User ID:" + userId);
		MultiValueMap<String, String> params = new LinkedMultiValueMap<String, String>();
		if (userId != null) {
			params.add(PortalConstants.USERID, userId);
		} else {
			throw new MECException("userID null", "Request validation failed", PortalConstants.FAILURE_STRING,
					HttpStatus.BAD_REQUEST);
		}
		logger.info("Request triggerd for getting list of users");
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getUserBaseUri() + "/userprofile/users/")
				.queryParams(params);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		ResponseEntity<String> responseEntityUserProfile = generateRequest.executeRequest(reqMap);
		HashMap userobj = onBoardUtils.stringToObject(responseEntityUserProfile.getBody(), new HashMap());
		userpic = (String) userobj.get("profilePic");
		logger.info("<<<< exit getProfileIcon >>>>");
		return userpic;
	}

	public UserProfile getUserProfile(String userId, String fields) throws MECException {
		logger.info("<<<< enter OnBoardRequestHandler - getUserProfile >>>>");
		logger.info("User ID:" + userId + " credit : " + fields);
		if (userId == null)
			throw new MECException("userID null", "Request validation failed", PortalConstants.FAILURE_STRING,
					HttpStatus.BAD_REQUEST);
		UriComponentsBuilder builder = UriComponentsBuilder
				.fromHttpUrl(getUserBaseUri() + "/userprofile/users/?userId=" + userId);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		logger.info("Request triggerd for fetching an user profile");
		ResponseEntity<String> responseEntityUserProfile = generateRequest.executeRequest(reqMap);
		UserProfile userobj = onBoardUtils.stringToObject(responseEntityUserProfile.getBody(), new UserProfile());
		logger.info("<<<< exit OnBoardRequestHandler - getUserProfile >>>>");
		return userobj;
	}

	public ResponseEntity<?> GetUserProfile(Object requestData) throws Exception {
		logger.info("<<<< enter GetUserProfileRequestHandler - handleRequest >>>>");
		HashMap<String, String> request = (HashMap<String, String>) requestData;
		if (request.get(PortalConstants.USERID) == null || request.get(PortalConstants.USERID).trim().isEmpty()) {
			throw new MECException("userId is missed ", "URL validation failed", PortalConstants.FAILURE_STRING,
					HttpStatus.BAD_REQUEST);
		}
		logger.info("Got request for User profile/credits/cardInfo with userId " + request.get(PortalConstants.USERID));
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(
				getUserBaseUri() + "/" + "userprofile/users/?" + "userId=" + request.get(PortalConstants.USERID));
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		logger.info("Request triggerd for fetching an user profile");
		ResponseEntity<String> responseEntityMicroservice = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit GetUserProfileRequestHandler - handleRequest >>>>");
		return new ResponseEntity<String>(responseEntityMicroservice.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> SetUserProfile(String requestData) throws Exception {
		logger.info("<<<< enter SetUserProfile >>>>");
		HttpHeaders headers = AddHeaders.generateHeaders(MediaType.APPLICATION_JSON);
		HttpEntity<?> entity = new HttpEntity<>(requestData, headers);
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getUserBaseUri() + "/" + "userprofile/users/");
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("methodType", HttpMethod.POST);
		reqMap.put("httpEntity", entity);
		logger.info("Request triggerd for saving an user profile");
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit SetUserProfile >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> UpdateUserProfileRequest(String requestData) throws Exception {
		logger.info("<<<< enter UpdateUserProfileRequest >>>>");
		HttpHeaders headers = AddHeaders.generateHeaders(MediaType.APPLICATION_JSON);
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getUserBaseUri() + "/" + "userprofile/users/");
		HttpEntity<?> entity = new HttpEntity<>(requestData, headers);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("methodType", HttpMethod.PUT);
		reqMap.put("httpEntity", entity);
		logger.info("Request triggerd for updating an user profile");
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit SetUserProfile >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);

	}

}
