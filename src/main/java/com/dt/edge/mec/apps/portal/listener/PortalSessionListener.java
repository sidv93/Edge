package com.dt.edge.mec.apps.portal.listener;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.slf4j.MDC;

import com.dt.edge.mec.apps.portal.authorization.IAMTokenManager;

public class PortalSessionListener implements HttpSessionListener {
	private final Logger logger = LogManager.getLogger(PortalSessionListener.class.getName());

	public void sessionCreated(HttpSessionEvent event) {
		logger.info("Inside PortalSessionListener created session id=" + event.getSession().getId());
	}

	public void sessionDestroyed(HttpSessionEvent event) {
		logger.info("Inside PortalSessionListener destroyed session id=" + event.getSession().getId());
		HttpSession session = event.getSession();
		IAMTokenManager.getIamproxy().logoff((String) session.getAttribute("accessToken"));
		session.setAttribute("accessToken", null);
		MDC.remove("sessionId");
		MDC.clear();
	}

}
