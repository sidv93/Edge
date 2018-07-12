package com.dt.edge.mec.apps.portal.requesthandler;

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

import com.dt.edge.mec.apps.portal.errorhandler.ClientErrorHandler;
import com.dt.edge.mec.apps.portal.errorhandler.ErrorCodes;
import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.apps.portal.errorhandler.RestErrorHandler;
import com.dt.edge.mec.apps.portal.model.ResponseMessage;
import com.dt.edge.mec.apps.portal.utility.AddHeaders;
import com.dt.edge.mec.apps.portal.utility.GetBaseUrl;
import com.dt.edge.mec.apps.portal.utility.PortalConstants;

@Component
public class BillingRequestHandler {

	private String billingModuleName;
	private String usageModuleName;
	private String usagemodulebaseuri;
	@Value("#{${MEC.MODULENAMEMAP}}")
	private Map<String, String> moduleNameMap;
	private String billingModulebaseURI;
	@Value("#{${MEC.BILLINGURIMAP}}")
	private Map<String, String> BILLINGURIMAP;
	private String billingModuleUpdateCreditURI;
	private String billingModuleUpdateRatesCreditURI;
	private String appBlling;
	private String microBilling;
	private String telcoBlling;
	private String newcoBlling;
	@Autowired
	private ErrorCodes errCodes;
	@Autowired
	private GetBaseUrl baseUrl;
	private String billingModuleAddOrDeleteCreditsURI;
	@Autowired
	ClientErrorHandler clientErrorHandler;
	private final Logger logger = LogManager.getLogger(BillingRequestHandler.class.getName());
	private final String SERVER_ERROR_STRING = "Server Error";

	@PostConstruct
	private void init() {
		newcoBlling = appBlling = BILLINGURIMAP.get("newcoBlling");
		usageModuleName = moduleNameMap.get("USAGEMODULE");
		usagemodulebaseuri = baseUrl.getBaseUri(usageModuleName);
		logger.info("usagemodulename" + usagemodulebaseuri);
		appBlling = BILLINGURIMAP.get("appBlling");
		billingModuleUpdateCreditURI = BILLINGURIMAP.get("billingModuleUpdateCreditURI");
		billingModuleUpdateRatesCreditURI = BILLINGURIMAP.get("billingModuleUpdateRatesCreditURI");
		microBilling = BILLINGURIMAP.get("microBilling");
		billingModuleAddOrDeleteCreditsURI = BILLINGURIMAP.get("billingModuleAddOrDeleteCreditsURI");
		telcoBlling = BILLINGURIMAP.get("telcoBlling");
		billingModuleName = moduleNameMap.get("BILLINGMODULE");
		billingModulebaseURI = baseUrl.getBaseUri(billingModuleName);
		logger.info(billingModulebaseURI);
	}

	public ResponseEntity<?> sendRequestToBilling(String usedCredit, String method) throws MECException {
		billingModulebaseURI = baseUrl.getBaseUri(billingModuleName);

		logger.info("<<<< enter OnBoardRequestHandler - sendRequestToBilling >>>>");
		logger.debug("sending request to Billing module with credit " + usedCredit);
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers = AddHeaders.addAccesstokenHeader(headers);
		RestTemplate requestTemplate = new RestTemplate();
		requestTemplate.setErrorHandler(new RestErrorHandler(errCodes.getBillingErrorStatus()));
		ResponseEntity<?> response = null;
		try {
			HttpEntity<String> metadataEntity = new HttpEntity<String>(usedCredit, headers);
			logger.info(
					"URL triggerd to billing module for credit:" + usagemodulebaseuri + billingModuleUpdateCreditURI);
			logger.info(
					"URL triggerd to billing module for credit:" + usagemodulebaseuri + billingModuleUpdateCreditURI);
			logger.info("Json object:" + metadataEntity.toString());
			if ("POST".equals(method)) {
				response = requestTemplate.exchange(usagemodulebaseuri + billingModuleUpdateCreditURI, HttpMethod.POST,
						metadataEntity, String.class);
				clientErrorHandler.handleClientEror(response, errCodes.getBillingErrorStatus());
			} else {
				response = requestTemplate.exchange(usagemodulebaseuri + billingModuleUpdateRatesCreditURI,
						HttpMethod.POST, metadataEntity, String.class);
				clientErrorHandler.handleClientEror(response, errCodes.getBillingErrorStatus());
			}
		} catch (Exception e) {
			logger.info("Caught Exception " + e.getMessage());
			if (e instanceof MECException) {
				throw e;
			}
			throw new MECException("Server Error Happened", SERVER_ERROR_STRING, "Failure",
					HttpStatus.FAILED_DEPENDENCY);
		}
		logger.info("response from billing module " + response);
		if (response.getStatusCode().equals(HttpStatus.OK)) {
			String message = "Request sent succesfully to billing module";
			return new ResponseEntity<>(new ResponseMessage(response.getStatusCode().toString(), message, "success"),
					HttpStatus.OK);
		} else {
			String errorMgs = "Request to billing module failed";
			return new ResponseEntity<>(new ResponseMessage(response.getStatusCode().toString(), errorMgs, "failed"),
					HttpStatus.BAD_REQUEST);
		}
	}

	/**
	 * 
	 * @param requestData
	 * @return
	 * @throws Exception
	 */
	public ResponseEntity<?> RequestToGetBill(String useriD, String period, String roleType) throws Exception {
		logger.info("Inside RequestToGetBill");
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		RestTemplate restTemplateForBilling = new RestTemplate();
		restTemplateForBilling.setErrorHandler(new RestErrorHandler(errCodes.getBillingErrorStatus()));
		ResponseEntity<String> responseForBilling = null;

		try {
			HttpEntity<String> entity = new HttpEntity<String>(headers);
			String url = filterUrlForbilling(useriD, period, roleType);

			logger.info("URL triggerd for getting bill details:" + url);

			responseForBilling = restTemplateForBilling.exchange(url, HttpMethod.GET, entity, String.class);
			if (responseForBilling == null) {
				throw new MECException(PortalConstants.NULL_RESPONSE_MESSAGE, PortalConstants.NULL_RESPONSE_CODE,
						PortalConstants.NULL_RESPONSE_STATUS, HttpStatus.NO_CONTENT);
			}
			logger.debug(responseForBilling.getBody().toString());
			clientErrorHandler.handleClientEror(responseForBilling, errCodes.getBillingErrorStatus());
		} catch (Exception e) {
			logger.debug("Caught Exception" + e.getMessage());
			if (e instanceof MECException)
				throw e;
			throw new MECException("Server Error", "Server Error", "Failure", HttpStatus.FAILED_DEPENDENCY);
		}
		logger.info("response from billing module " + responseForBilling);
		return new ResponseEntity<String>(responseForBilling.getBody().toString(), HttpStatus.OK);
		// return responseForBilling;
	}

	private String filterUrlForbilling(String useriD, String period, String roleType) {
		String url = null;
		billingModulebaseURI = baseUrl.getBaseUri(billingModuleName);
		logger.info("useriD=" + useriD);
		logger.info("period=" + period);
		logger.info("roleType=" + roleType);
		if (roleType.equals("MicroServiceDeveloper")) {
			url = billingModulebaseURI + microBilling + "/" + useriD + "/" + period + "/" + roleType;
		} else if (roleType.equals("MobileAppsDeveloper")) {
			url = billingModulebaseURI + appBlling + "/" + useriD + "/" + period + "/" + roleType;
		} else if (roleType.equals("TelcoDeveloper")) {
			url = billingModulebaseURI + telcoBlling + "/" + useriD + "/" + period + "/" + roleType;
		} else if (roleType.equals("NewCoDeveloper")) {
			url = billingModulebaseURI + newcoBlling + "/" + useriD + "/" + period + "/" + roleType;
		}
		logger.info("url=" + url);
		return url;
	}

	public ResponseEntity<?> addOrDeleteRequest(String Json) throws Exception {
		billingModulebaseURI = baseUrl.getBaseUri(billingModuleName);

		logger.info("Inside addOrDeleteRequest");
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers = AddHeaders.addAccesstokenHeader(headers);
		RestTemplate restTemplateForBilling = new RestTemplate();
		restTemplateForBilling.setErrorHandler(new RestErrorHandler(errCodes.getBillingErrorStatus()));
		ResponseEntity<String> responseForBilling = null;

		try {
			HttpEntity<String> entity = new HttpEntity<String>(Json, headers);
			String url = usagemodulebaseuri + billingModuleAddOrDeleteCreditsURI;
			logger.info("URL triggerd for getting bill details:" + url);
			logger.info("URL triggerd for getting bill details:" + entity);

			responseForBilling = restTemplateForBilling.exchange(url, HttpMethod.POST, entity, String.class);
			clientErrorHandler.handleClientEror(responseForBilling, errCodes.getBillingErrorStatus());
		} catch (Exception e) {
			logger.debug("Caught Exception" + e.getMessage());
			if (e instanceof MECException) {
				throw e;
			}
			throw new MECException(SERVER_ERROR_STRING, SERVER_ERROR_STRING, "Failure", HttpStatus.FAILED_DEPENDENCY);
		}
		logger.info("response from billing module " + responseForBilling);
		return new ResponseEntity<String>(responseForBilling.getBody().toString(), HttpStatus.OK);
		// return responseForBilling;
	}

}
