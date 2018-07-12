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
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;

import com.dt.edge.mec.apps.portal.errorhandler.ClientErrorHandler;
import com.dt.edge.mec.apps.portal.errorhandler.ErrorCodes;
import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.apps.portal.helper.GenerateRequest;
import com.dt.edge.mec.apps.portal.utility.GetBaseUrl;
import com.dt.edge.mec.apps.portal.utility.RequestUtils;

@Component("UsageController")
public class UsageRequestHandler {
	private String applicationCatalogUsageName;
	private String usageModuleName;
	@Value("#{${MEC.TYPECATALOG}}")
	private Map<String, String> TypeCatalog;
	@Value("#{${MEC.MODULENAMEMAP}}")
	private Map<String, String> moduleNameMap;
	@Value("#{${MEC.TypeUri}}")
	private Map<String, String> typeUriMap;
	@Autowired
	private GetBaseUrl baseUrl;
	@Autowired
	GenerateRequest generateRequest;

	@Autowired
	ErrorCodes errCodes;
	@Autowired
	ClientErrorHandler clientErrorHandler;
	@Value("${MEC.cpuUsage}")
	private String cpuUsage;
	@Value("${MEC.latency}")
	private String latency;
	@Value("${MEC.totalusers}")
	private String totalusers;
	@Value("${MEC.topapplicationsURI}")
	private String topapplicationsURI;
	@Value("${MEC.topmicroserviceURI}")
	private String topmicroserviceURI;
	@Value("${MEC.topRecordCount}")
	private String recordCount;
	private final Logger logger = LogManager.getLogger(UsageRequestHandler.class.getName());

	@PostConstruct
	private void init() {
		applicationCatalogUsageName = moduleNameMap.get("applicationCatalogUsage");
		usageModuleName = moduleNameMap.get("USAGEMODULE");
		logger.info("UAjhhsfghsdf" + getusagebaseUri());
	}

	private String getapplicationcatalogbaseuri() {
		return baseUrl.getBaseUri(applicationCatalogUsageName) + TypeCatalog.get("ApplicatioCatalogUsage");
	}

	private String getusagebaseUri() {
		return baseUrl.getBaseUri(usageModuleName);
	}

	public ResponseEntity<?> handleUsageRequest(String type, HashMap querryMap) throws Exception {
		String frequency;
		logger.info("UsageRequestHandler - handleUsageRequest >>>>");
		MultiValueMap<String, String> params = null;
		if (querryMap.containsKey("timeCycle") && querryMap.get("timeCycle") != null) {
			frequency = (String) querryMap.get("timeCycle");
			if (frequency.equalsIgnoreCase("monthly")) {
				frequency = "LAST_30_DAYS";
			}
			if (frequency.equalsIgnoreCase("weekly")) {
				frequency = "LAST_7_DAYS";
			}
			if (frequency.equalsIgnoreCase("daily")) {
				frequency = "LAST_1_DAY";
			}
			if (frequency.equalsIgnoreCase("hourly")) {
				frequency = "LAST_1_HOUR";
			}
			querryMap.put("timeCycle", frequency);
		}
		params = RequestUtils.getQuerryMap(querryMap);
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getusagebaseUri() + typeUriMap.get(type))
				.queryParams(params);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		logger.info("Request triggerd for fetching usage data");
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit UsageRequestHandler - handleUsageRequest >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> getCpuUsage(String userId, String applicationName, String duration, String type)
			throws MECException {
		logger.info("Inside getCpuUsage");
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getapplicationcatalogbaseuri()
				+ typeUriMap.get(type) + cpuUsage + "/" + userId + "/" + applicationName + "/" + duration);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		logger.info("Request triggerd for fetching cpu usage");
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit UsageRequestHandler - getCpuUsage >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> getlatency(String userId, String applicationName, String duration, String type)
			throws MECException {
		logger.info("<<<< Inside getlatency >>>>");
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getapplicationcatalogbaseuri()
				+ typeUriMap.get(type) + latency + "/" + userId + "/" + applicationName + "/" + duration);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		logger.info("Request triggerd for fetching latency");
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit UsageRequestHandler - getlatency >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> gettotalusers(String userId, String applicationName, String duration, String type)
			throws MECException {
		logger.info("<<<< Inside gettotalusers >>>>");
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getapplicationcatalogbaseuri()
				+ typeUriMap.get(type) + totalusers + "/" + userId + "/" + applicationName + "/" + duration);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		logger.info("Request triggerd for getting total users");
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit UsageRequestHandler - gettotalusers >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> getTopApplication(String userId, String metric, String duration, String type)
			throws MECException {
		logger.info("<<<< entry UsageRequestHandler - getTopApplication >>>>");
		UriComponentsBuilder builder = UriComponentsBuilder
				.fromHttpUrl(getapplicationcatalogbaseuri() + typeUriMap.get(type) + topapplicationsURI + "/" + userId
						+ "/" + metric + "/" + duration + "/" + recordCount);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		logger.info("Request triggerd for fetching top applications");
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit UsageRequestHandler - getTopApplication >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> getTopMicroservices(String userId, String metric, String duration, String type)
			throws MECException {
		logger.info("<<<< entry UsageRequestHandler - getTopMicroservices >>>>");
		UriComponentsBuilder builder = UriComponentsBuilder
				.fromHttpUrl(getapplicationcatalogbaseuri() + typeUriMap.get(type) + topmicroserviceURI + "/" + userId
						+ "/" + metric + "/" + duration + "/" + recordCount);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		logger.info("Request triggerd for fetching top microservices");
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit UsageRequestHandler - getTopMicroservices >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> getsession(String userId, String metric, String duration, String type)
			throws MECException {
		logger.info("<<<< entry UsageRequestHandler - getsession >>>>");
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getapplicationcatalogbaseuri()
				+ typeUriMap.get(type) + "/session" + "/" + userId + "/" + metric + "/" + duration);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		logger.info("Request triggerd for fetching sessions");
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit UsageRequestHandler - getsession >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> getusage(String userId, String metric, String type) throws MECException {
		logger.info("<<<< entry UsageRequestHandler - getusage >>>>");
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(
				getapplicationcatalogbaseuri() + typeUriMap.get(type) + "/usage" + "/" + userId + "/" + metric);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		logger.info("Request triggerd for fetching usage details from application catalog");
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit UsageRequestHandler - getusage >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> getcloudlettiles(String companyName, String type) throws MECException {
		logger.info("<<<< entry UsageRequestHandler - getcloudlettiles >>>>");
		UriComponentsBuilder builder = UriComponentsBuilder
				.fromHttpUrl(getapplicationcatalogbaseuri() + typeUriMap.get(type) + "/tiles" + "/" + companyName);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		logger.info("Request triggerd for fetching cloudlet tiles data");
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit UsageRequestHandler - getcloudlettiles >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> getTopCloudlets(String companyName, String infotype, String type) throws MECException {
		logger.info("<<<< entry UsageRequestHandler - getTopCloudlets >>>>");
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getapplicationcatalogbaseuri()
				+ typeUriMap.get(type) + "/topcloudlets" + "/" + companyName + "/" + infotype);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		logger.info("Request triggerd for fetching top cloudlets");
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit UsageRequestHandler - getTopCloudlets >>>>");
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}
}