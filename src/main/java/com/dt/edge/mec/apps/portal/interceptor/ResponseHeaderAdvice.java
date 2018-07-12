package com.dt.edge.mec.apps.portal.interceptor;

import javax.servlet.http.HttpServletRequest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@ControllerAdvice
public class ResponseHeaderAdvice implements ResponseBodyAdvice<Object> {
	private final Logger logger = LogManager.getLogger(ResponseHeaderAdvice.class.getName());

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
        HttpServletRequest req=servletRequest.getServletRequest();
        logger.debug("setting accessToken in response="+(String)req.getSession().getAttribute("accessToken"));
        logger.debug("response.getHeaders()="+response.getHeaders());
        if (response.getHeaders().containsKey("accessToken")){
        	response.getHeaders().set("accessToken",(String)req.getSession().getAttribute("accessToken"));
        }else{
        	response.getHeaders().add("accessToken",(String)req.getSession().getAttribute("accessToken"));
        }
    	return body;
    }

	
}