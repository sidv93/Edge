package com.dt.edge.mec.apps.portal.utility;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.dt.edge.mec.apps.portal.authorization.IAMTokenManager;

@Component
public class GetBaseUrl {

	@Value("#{${MEC.BASEURIMAP}}")
	private Map<String, String> BaseUriMap;

	public String getBaseUri(String moduleName) {
		String baseUri = null;
		baseUri = IAMTokenManager.getEndPoint(moduleName);
		if (baseUri == null) {
			// logger.info("Could not get base uri from IAM for module
			// "+moduleName);
			baseUri = BaseUriMap.get(moduleName);
		}
		return baseUri;
	}
}
