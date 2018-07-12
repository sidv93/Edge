package com.dt.edge.mec.apps.portal.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.dt.edge.mec.apps.portal.errorhandler.InvalidClientException;

public class RequestHeaderInterceptor extends HandlerInterceptorAdapter {
	// Obtain a suitable logger.
	private final Logger logger = LogManager.getLogger(RequestHeaderInterceptor.class.getName());

	/**
	 * In this case intercept the request BEFORE it reaches the controller
	 */
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		try {
			if (!request.getRequestURI().contains("/MECPortal/authenticateUser/")
					&& !request.getRequestURI().contains("/assets/")
					&& !request.getRequestURI().contains("/MECPortal/main")
					&& !request.getRequestURI().contains("/MECPortal/vendor")
					&& !request.getRequestURI().contains("/MECPortal/inline")
					&& !request.getRequestURI().contains("/MECPortal/style")
					&& !request.getRequestURI().contains("/MECPortal/downloadSDK")
					&& !request.getRequestURI().contains("/MECPortal/downloadFeedbackFile")
					&& !request.getRequestURI().matches("/MECPortal/")
					&& !request.getRequestURI().matches("/MECPortal/signUpOpsDevs/")
					&& !request.getRequestURI().matches("/MECPortal/timeout")) {
				logger.info("Validating access token " + request.getHeader("accessToken")
						+ " in request header for req:" + request.getRequestURI());
				String sessionToken = (String) request.getSession().getAttribute("accessToken");
				if (sessionToken != null && sessionToken.equals(request.getHeader("accessToken"))) {
					return true;
				} else {
					throw new InvalidClientException();
				}
			}
			return true;
		} catch (InvalidClientException e) {
			logger.info("request update failed");
			throw e;
		}
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		// logger.info("After handling the request");
		super.postHandle(request, response, handler, modelAndView);
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		// logger.info("After rendering the view");
		super.afterCompletion(request, response, handler, ex);
	}

}
