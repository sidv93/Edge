package com.dt.edge.mec.apps.portal.controller;

import java.util.HashMap;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dt.edge.mec.apps.portal.requesthandler.UsageRequestHandler;

@RestController
public class UsageController {
	@Autowired
	@Qualifier("UsageController")
	private UsageRequestHandler requestHandler;
	private final Logger logger = LogManager.getLogger(UsageController.class.getName());
	private final String METRICTYPE = "metricType";
	private final String SEARCHEDCLOUDLETNAME = "searchedCloudletName";
	private final String TIMECYCLE = "timeCycle";

	@RequestMapping(value = "/getPaasUsage", method = RequestMethod.GET)
	public ResponseEntity<?> getCloudletUsage(
			@RequestParam(value = SEARCHEDCLOUDLETNAME, required = false) String searchedCloudletName,
			@RequestParam(value = TIMECYCLE, required = false) String timeCycle,
			@RequestParam(value = METRICTYPE, required = false) String metricType,
			@RequestParam(value = "operatorID", required = false) String operatorID) throws Exception {
		logger.info("<<<< UsageController - getCloudletUsage >>>>");

		HashMap<String, String> querryMap = new HashMap<String, String>();
		querryMap.put(SEARCHEDCLOUDLETNAME, searchedCloudletName);
		querryMap.put(TIMECYCLE, timeCycle);
		querryMap.put(METRICTYPE, metricType);
		querryMap.put("operatorId", operatorID);
		logger.info(querryMap);
		return requestHandler.handleUsageRequest("cloudletUsage", querryMap);
	}

	@RequestMapping(value = "/getMSUsage", method = RequestMethod.GET)
	public ResponseEntity<?> getMSUsage(@RequestParam(value = "msName1", required = false) String appName1,
			@RequestParam(value = "msName2", required = false) String appName2,
			@RequestParam(value = "msName3", required = false) String appName3,
			@RequestParam(value = TIMECYCLE, required = false) String timeCycle,
			@RequestParam(value = METRICTYPE, required = false) String metricType,
			@RequestParam(value = "userid", required = false) String userid) throws Exception {
		logger.info("<<<< UsageController - getMSUsage >>>>");

		HashMap<String, String> querryMap = new HashMap<String, String>();
		querryMap.put("microServiceName1", appName1);
		querryMap.put("microServiceName2", appName2);
		querryMap.put("microServiceName3", appName3);
		querryMap.put(TIMECYCLE, timeCycle);
		querryMap.put(METRICTYPE, metricType);
		querryMap.put("userId", userid);
		logger.info(querryMap);
		return requestHandler.handleUsageRequest("microServiceUsage", querryMap);
		// return requestHandler.handleRequest(request);
	}

	@RequestMapping(value = "/getAppUsage", method = RequestMethod.GET)
	public ResponseEntity<?> getAppUsage(@RequestParam(value = "appName1", required = false) String appName1,
			@RequestParam(value = "appName2", required = false) String appName2,
			@RequestParam(value = "appName3", required = false) String appName3,
			@RequestParam(value = TIMECYCLE, required = false) String timeCycle,
			@RequestParam(value = METRICTYPE, required = false) String metricType,
			@RequestParam(value = "userid", required = false) String userid) throws Exception {
		logger.info("<<<< UsageController - getAppUsage >>>>");

		HashMap<String, String> querryMap = new HashMap<String, String>();
		querryMap.put("applicationName1", appName1);
		querryMap.put("applicationName2", appName2);
		querryMap.put("applicationName3", appName3);
		querryMap.put(TIMECYCLE, timeCycle);
		querryMap.put(METRICTYPE, metricType);
		querryMap.put("userId", userid);
		logger.info(querryMap);
		return requestHandler.handleUsageRequest("applicationUsage", querryMap);
		// return requestHandler.handleRequest(request);
	}

	@RequestMapping(value = "/getTelcoUsage", method = RequestMethod.GET)
	public ResponseEntity<?> getTelcoUsage(
			@RequestParam(value = SEARCHEDCLOUDLETNAME, required = false) String searchedCloudletName,
			@RequestParam(value = TIMECYCLE, required = false) String timeCycle,
			@RequestParam(value = METRICTYPE, required = false) String metricType,
			@RequestParam(value = "telcoUserId", required = false) String telcoUserId) throws Exception {
		logger.info("<<<< UsageController - getTelcoUsage >>>>");

		HashMap<String, String> querryMap = new HashMap<String, String>();
		querryMap.put(SEARCHEDCLOUDLETNAME, searchedCloudletName);
		querryMap.put(TIMECYCLE, timeCycle);
		querryMap.put(METRICTYPE, metricType);
		querryMap.put("telcoUser", telcoUserId);
		logger.info(querryMap);
		return requestHandler.handleUsageRequest("telcoUsage", querryMap);
	}

}
