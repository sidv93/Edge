
package com.dt.edge.mec.apps.portal.requesthandler;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
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
import com.dt.edge.mec.apps.portal.model.ResponseMessage;
import com.dt.edge.mec.apps.portal.utility.AddHeaders;
import com.dt.edge.mec.apps.portal.utility.GetBaseUrl;
import com.dt.edge.mec.apps.portal.utility.OnBoardUtils;
import com.dt.edge.mec.apps.portal.utility.PortalConstants;
import com.dt.edge.mec.apps.portal.utility.RequestUtils;

@Component
public class PassRequestHandler {
	private String EdgeCatalogModuleName;
	private String CloudletModuleName;
	private String CloudletImageModuleName;
	private String EdgeCatalog;
	private String CloudletCatalog;
	private String CloudletImageCatalog;
	@Value("#{${MEC.MODULENAMEMAP}}")
	private Map<String, String> moduleNameMap;
	@Value("#{${MEC.TYPECATALOG}}")
	private Map<String, String> TypeCatalog;
	@Autowired
	GenerateRequest generateRequest;
	private final static String EDGE = "edge";
	private final static String CLOUDLET = "cloudlet";
	private final static String CLOUDLETIMAGE = "cloudletImage";

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
	private final Logger logger = LogManager.getLogger(PassRequestHandler.class.getName());

	@PostConstruct
	public void init() {
		EdgeCatalogModuleName = moduleNameMap.get("EdgeCatalog");
		CloudletModuleName = moduleNameMap.get("CloudletModule");
		CloudletImageModuleName = moduleNameMap.get("CloudletImageModule");
		EdgeCatalog = TypeCatalog.get("EdgeCatalog");
		CloudletCatalog = TypeCatalog.get("CloudletCatalog");
		CloudletImageCatalog = TypeCatalog.get("CloudletImageCatalog");
		logger.info(getCloudletImageBaseUri());
		logger.info(getEdgeCataogbaseUri());
		logger.info(getCloudletbaseUri());
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

	public ResponseEntity<?> deleteRequest(String requestData, String url, String type) throws MECException {
		logger.info("<<<< entry deleteRequest>>>>");
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

			if (url.contains("deleteEdges")) {
				if (checkForterminateState(requestData)) {
					builder = UriComponentsBuilder.fromHttpUrl(getEdgeCataogbaseUri() + typeURI + requestData + "/");
					entity = new HttpEntity<>(disAbleCloudlets(requestData), headers);
				} else {
					return new ResponseEntity<ResponseMessage>(new ResponseMessage("302",
							"CLoudlet exists on Edge.First delete the cloudlets, then try deleting edge.",
							PortalConstants.SUCCESS_STRING), HttpStatus.FOUND);
				}

			} else if (url.contains("deleteCloudlets")) {
				logger.info("cloudlets disable json" + requestData);
				HashMap<String, String> map = onBoardUtils.stringToObject(requestData, new HashMap<>());
				builder = UriComponentsBuilder
						.fromHttpUrl(getCloudletbaseUri() + typeURI + map.get("cloudletName") + "/");
				entity = new HttpEntity<>(requestData, headers);
			} else if (url.contains("deleteCloudletImage")) {
				logger.info("Json triggerd for deleting cloudlet image :" + disableCloudleImage(requestData));
				builder = UriComponentsBuilder.fromHttpUrl(getCloudletImageBaseUri() + typeURI + requestData + "/");
				entity = new HttpEntity<>(disableCloudleImage(requestData), headers);
			}
			if (builder == null) {
				throw new MECException(PortalConstants.INVALID_ACCESS_MESSAGE, PortalConstants.INVALID_ACCESS_CODE,
						PortalConstants.INVALID_ACCESS_STATUS, HttpStatus.BAD_REQUEST);
			}
			logger.info("URL triggerd for deleting :" + builder.build().encode().toUri());
			responseEntityDeleteApplication = restTemplateDeleteApplication.exchange(builder.build().encode().toUri(),
					HttpMethod.DELETE, entity, String.class);
			clientErrorHandler.handleClientEror(responseEntityDeleteApplication,
					errCodes.getCentralRepositoryErrorStatus());
		} catch (Exception e) {
			if (e instanceof MECException) {
				throw e;
			}
			logger.info(PortalConstants.CAUGHT_EXCEPTION_STRING + e.getMessage());
			throw new MECException(PortalConstants.SERVER_ERROR_STRING, PortalConstants.SERVER_ERROR_STRING,
					PortalConstants.FAILURE_STRING, HttpStatus.FAILED_DEPENDENCY);
		}
		logger.info("<<<< exit deleteRequest>>>>");
		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage(responseEntityDeleteApplication.getStatusCode().toString(), "Deletion Done",
						PortalConstants.SUCCESS_STRING),
				HttpStatus.OK);
	}

	private String disAbleCloudlets(String clouletsName) {
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
	}

	private String disableCloudleImage(String cloudletImageName) {
		StringBuffer sb = new StringBuffer();
		sb.append("{");
		sb.append("\n");
		sb.append("\"status\"");
		sb.append(":");
		sb.append("\"Disabled\",");
		sb.append("\n");
		sb.append("\"imageName\"");
		sb.append(":");
		sb.append("\"");
		sb.append(cloudletImageName);
		sb.append("\"");
		sb.append("}");
		return sb.toString();
	}

	private boolean checkForterminateState(String requestData) throws MECException {
		boolean state = false;
		HttpHeaders headers = AddHeaders.generateHeaders(MediaType.APPLICATION_JSON);
		MultiValueMap<String, String> queryParam = new LinkedMultiValueMap<>();
		if (requestData == null) {

			throw new MECException("userID null", "Request validation failed", PortalConstants.FAILURE_STRING,
					HttpStatus.BAD_REQUEST);
		}

		// queryParam.add("edgeName", requestData);
		queryParam.add("page_size", "0");
		queryParam.add("sort_by", "cloudletName");
		queryParam.add("sort_order", "1");
		queryParam.add("page_number", "0");
		ResponseEntity<String> responseEntityUserProfile = null;
		RestTemplate restTemplateUserProfile = new RestTemplate();
		restTemplateUserProfile.setErrorHandler(new RestErrorHandler(errCodes.getCentralRepositoryErrorStatus()));
		try {
			UriComponentsBuilder builder = null;// UriComponentsBuilder.fromHttpUrl(centralRepobaseURI
												// +
												// operatorListURl+"/"+operator);

			builder = UriComponentsBuilder
					.fromHttpUrl(getCloudletbaseUri() + typeUriMap.get("cloudlets") + "edgeName=" + requestData)
					.queryParams(queryParam);
			HttpEntity<?> entity = new HttpEntity<>(headers);
			logger.info("URL triggerd for getting list of cloudlets on edge :" + requestData + " "
					+ builder.build().encode().toUri());
			responseEntityUserProfile = restTemplateUserProfile.exchange(builder.build().encode().toUri(),
					HttpMethod.GET, entity, String.class);

			if (responseEntityUserProfile.getStatusCodeValue() == 404) {

				logger.info("No cloudlet exists on edge.Cloudlet can be deleted");
				return true;

			} else if (responseEntityUserProfile.getStatusCodeValue() == 200) {
				logger.debug("CLoudlets profile in Json " + responseEntityUserProfile.getBody());
				state = isTerminateState(responseEntityUserProfile.getBody());
				return state;
			}

			clientErrorHandler.handleClientEror(responseEntityUserProfile, errCodes.getCentralRepositoryErrorStatus());

		} catch (Exception e) {
			if (e instanceof MECException) {
				throw e;
			}
			logger.debug(PortalConstants.CAUGHT_EXCEPTION_STRING + e.getMessage());
			throw new MECException(PortalConstants.SERVER_ERROR_STRING, PortalConstants.SERVER_ERROR_STRING,
					PortalConstants.FAILURE_STRING, HttpStatus.FAILED_DEPENDENCY);
		}
		return state;

	}

	private boolean isTerminateState(String body) {
		JSONArray jsonarray = new JSONArray(body);
		logger.info(jsonarray.length());
		int i = 0;
		boolean state = true;
		while (i < jsonarray.length()) {
			JSONObject s = jsonarray.getJSONObject(i);
			if (s.getString("onBoardStatus").equalsIgnoreCase("terminated")) {
				i++;
			} else {
				state = false;
				break;
			}
		}
		return state;
	}

	public ResponseEntity<?> getAllRequestHandler(String type, Map<String, String> matixParam,
			HashMap<String, String> querryParam) throws Exception {
		logger.info("<<<< entry getAllRequestHandler>>>>");
		String typeUri = null;
		MultiValueMap<String, String> params = null;
		typeUri = typeUriMap.get(type);
		logger.info("typeUri=" + typeUri);
		params = RequestUtils.getQuerryMap((HashMap<String, String>) querryParam);
		UriComponentsBuilder builder = null;
		if (typeUri.contains(EDGE)) {
			builder = UriComponentsBuilder
					.fromHttpUrl(getEdgeCataogbaseUri() + typeUri + RequestUtils.generateMatrixString(matixParam))
					.queryParams(params);
		} else if (typeUri.contains("cloudletImages")) {
			builder = UriComponentsBuilder
					.fromHttpUrl(getCloudletImageBaseUri() + typeUri + RequestUtils.generateMatrixString(matixParam))
					.queryParams(params);
		} else if (typeUri.contains("cloudlets")) {
			builder = UriComponentsBuilder
					.fromHttpUrl(getCloudletbaseUri() + typeUri + RequestUtils.generateMatrixString(matixParam))
					.queryParams(params);
		}
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit getAllRequestHandler>>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	/*
	 * This method will Handled request for microservices .
	 */
	public ResponseEntity<?> getDetais(String type, String edgeName) throws MECException {
		logger.info("<<<< entry getDetais>>>>");
		logger.debug("User ID:" + edgeName);
		String typeUri = typeUriMap.get(type);
		if (edgeName == null) {
			throw new MECException("edgeName null", "Request validation failed", PortalConstants.FAILURE_STRING,
					HttpStatus.BAD_REQUEST);
		}
		UriComponentsBuilder builder = null;
		if (typeUri.contains(EDGE)) {
			// http://172.19.74.253:8082/edgecatalog/edge/{EdgeName}
			logger.info("Request triggerd for fetching an edge details");
			builder = UriComponentsBuilder.fromHttpUrl(getEdgeCataogbaseUri() + typeUriMap.get(EDGE) + edgeName + "/");
		} else if (typeUri.equals("/cloudlet/")) {
			// http://172.19.74.253:8082/cloudletcatalog/cloudlet/{CloudletName}
			logger.info("Request triggerd for fetching a cloudlet details");
			builder = UriComponentsBuilder
					.fromHttpUrl(getCloudletbaseUri() + typeUriMap.get(CLOUDLET) + edgeName + "/");
		} else if (typeUri.equals("/cloudletImage/")) {
			// http://172.19.74.253:8082/cloudletcatalog/cloudletImage/{ImageName}
			logger.info("Request triggerd for fetching a cloudlet image details");
			builder = UriComponentsBuilder
					.fromHttpUrl(getCloudletImageBaseUri() + typeUriMap.get(CLOUDLETIMAGE) + edgeName + "/");
		}
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit getDetais>>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

}
