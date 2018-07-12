package com.dt.edge.mec.apps.portal.authorization;

import java.util.Date;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.dt.edge.mec.iam.proxy.OAuthToken;

public class TokenRefresher implements Runnable {
	private final static Logger logger = LogManager.getLogger(TokenRefresher.class.getName());

	@Override
	public void run() {
		OAuthToken oauth = null;
		oauth = IAMTokenManager.refreshToken();
		ScheduledExecutorService service = IAMTokenManager.getService();
		if (oauth == null) {
			logger.info(" Refresh Failed at time " + new Date() + " Retry with Register at "
					+ new Date(new Date().getTime() + IAMTokenManager.getDefaultRefreshTime() * 1000));
			IAMTokenManager.setEndPointMap(null);

			service.schedule(new ModuleRegister(), IAMTokenManager.getDefaultRefreshTime(), TimeUnit.SECONDS);
		} else if (oauth.getAccessToken() == null
				|| oauth.getStatus().equalsIgnoreCase(IAMTokenManager.getFailureString())) {
			logger.info(" Refresh Failed at time " + new Date() + " Retry with Register at "
					+ new Date(new Date().getTime() + IAMTokenManager.getDefaultRefreshTime() * 1000));
			IAMTokenManager.setEndPointMap(null);

			service.schedule(new ModuleRegister(), IAMTokenManager.getDefaultRefreshTime(), TimeUnit.SECONDS);
		} else {
			logger.info("Refresh Succesfull next refresh at"
					+ new Date(new Date().getTime() + oauth.getExpiresIn() * 1000));
			IAMTokenManager.setEndPointMap(IAMTokenManager.getIamproxy().getEndPoints(oauth.getAccessToken()));

			service.schedule(new TokenRefresher(), oauth.getExpiresIn(), TimeUnit.SECONDS);

		}

	}
}
