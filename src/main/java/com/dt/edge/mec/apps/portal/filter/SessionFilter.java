package com.dt.edge.mec.apps.portal.filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.MDC;

import java.io.IOException;

public class SessionFilter implements Filter {

	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException {

		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;
		String url = request.getServletPath();
		System.out.println("url=" + url);
		HttpSession session = null;
		if (url.contains("authenticateUser")) {
			session = request.getSession(false);
			if (session != null) {
				System.out.println("Invalidating session id "+session.getId());
				session.invalidate();
				//response.sendRedirect("/MECPortal/timeout");
			} 
				System.out.println("Creating new session");
				session = request.getSession(true);
				System.out.println("New session id "+session.getId());
				MDC.put("sessionId", session.getId());
				chain.doFilter(req, res);
			}
		 else if (url.contains("index.html") || url.contains("/assets/") || url.contains(".js")
				|| url.contains("timeout") || url.contains(".css")|| url.contains("signUpOpsDevs")) {
			chain.doFilter(req, res);
		} else {
			session = request.getSession(false);
			if (null == session) {
				response.sendRedirect("/MECPortal/timeout");
			} else {
				MDC.put("sessionId", session.getId());
				chain.doFilter(req, res);
			}

		}

	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub

	}

}
