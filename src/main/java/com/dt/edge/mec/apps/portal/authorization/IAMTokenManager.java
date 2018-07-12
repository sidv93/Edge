package com.dt.edge.mec.apps.portal.authorization;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import javax.annotation.PostConstruct;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.dt.edge.mec.iam.proxy.IAMproxy;
import com.dt.edge.mec.iam.proxy.OAuthToken;

@Component
public class IAMTokenManager {
	@Autowired
	private ApiList apiList;
	private static Map<String, List<String>> targetApiMap;
	private static ScheduledExecutorService service = Executors.newSingleThreadScheduledExecutor();;
	private static IAMproxy iamproxy;
	private static volatile OAuthToken oauthToken;
	public static int defaultRefreshTime = 30;
	public static String failureString = "failure";
	final static ReentrantReadWriteLock tokenlock = new ReentrantReadWriteLock();
	final static ReentrantReadWriteLock endpointlock = new ReentrantReadWriteLock();
	private static volatile Map<String, String> endPointMap = new HashMap<String, String>();
	private final static Logger logger = LogManager.getLogger(IAMTokenManager.class.getName());
	@Value("${MEC.IAMIP}")
	private String IAMIP;
	private static String MECPORTALBASEURI;

	public String getIAMIP() {
		return IAMIP;
	}

	public void setIAMIP(String iAMIP) {
		IAMIP = iAMIP;
	}

	public String getIAMPortAddress() {
		return IAMPortAddress;
	}

	public void setIAMPortAddress(String iAMPortAddress) {
		IAMPortAddress = iAMPortAddress;
	}

	@Value("${MEC.IAMPortAddress}")
	private String IAMPortAddress;

	public static Map<String, List<String>> getTargetApiMap() {
		return targetApiMap;
	}

	public static void setTargetApiMap(Map<String, List<String>> targetApiMap) {
		IAMTokenManager.targetApiMap = targetApiMap;
	}

	public static ScheduledExecutorService getService() {
		return service;
	}

	public static void setService(ScheduledExecutorService service) {
		IAMTokenManager.service = service;
	}

	public static int getDefaultRefreshTime() {
		return defaultRefreshTime;
	}

	public static void setDefaultRefreshTime(int defaultRefreshTime) {
		IAMTokenManager.defaultRefreshTime = defaultRefreshTime;
	}

	public static String getFailureString() {
		return failureString;
	}

	public static void setFailureString(String failureString) {
		IAMTokenManager.failureString = failureString;
	}

	public static IAMproxy getIamproxy() {
		return iamproxy;
	}

	public static String getEndPoint(String Module) {
		boolean readlockflag = false;
		try {
			readlockflag = endpointlock.readLock().tryLock(100, TimeUnit.MILLISECONDS);
		} catch (InterruptedException e) {
			//e.printStackTrace();
			logger.info("inside getEndPoint:"+e.getMessage());
		}
		try {
			if (readlockflag) {
				if (endPointMap.containsKey(Module)) {
					return endPointMap.get(Module);
				} else
					return null;
			}
		} finally {
			// logger.info(Thread.currentThread().getName()+readlockflag);
			if (readlockflag)
				endpointlock.readLock().unlock();
		}
		return null;

	}

	public static void setEndPointMap(JSONObject jsonendMap) {
		boolean writelockflag = false;
		Map<String, String> endpoints = new HashMap<String, String>();
		try {
			writelockflag = endpointlock.writeLock().tryLock(100, TimeUnit.MILLISECONDS);
			// logger.info(writelockflag);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			//e.printStackTrace();
			logger.info("inside setEndPointMap:"+e.getMessage());
		}
		try {
			if (writelockflag) {
				if (jsonendMap != null) {
					Iterator entries = jsonendMap.entrySet().iterator();
					while (entries.hasNext()) {
						Entry thisEntry = (Entry) entries.next();
						endpoints.put((String) thisEntry.getKey(), (String) thisEntry.getValue());
					}
				}
				endPointMap = endpoints;
				logger.info("endpoints" + endpoints);
			}
		} finally {
			if (endpointlock.isWriteLockedByCurrentThread())
				endpointlock.writeLock().unlock();
		}

	}

	public IAMTokenManager() {
		super();
	}

	@PostConstruct
	public void initTargetApi() {
		targetApiMap = apiList.getTargetApiMap();
		iamproxy = new IAMproxy(IAMIP, Integer.parseInt(IAMPortAddress));
		logger.info(IAMIP + IAMPortAddress);
		MECPORTALBASEURI = apiList.getMECPORTALBASEURI();
	}

	public static OAuthToken getOauthToken() {

		boolean readlockflag = false;
		try {
			readlockflag = tokenlock.readLock().tryLock(100, TimeUnit.MILLISECONDS);
		} catch (InterruptedException e) {
			//e.printStackTrace();
			logger.info("inside getOauthToken:"+e.getMessage());
		}
		try {
			if (readlockflag)
				return oauthToken;
		} finally {
			// logger.info(Thread.currentThread().getName()+readlockflag);
			if (readlockflag)
				tokenlock.readLock().unlock();
		}
		return null;
	}

	public static OAuthToken registerModule() {

		boolean writelockflag = false;
		try {
			writelockflag = tokenlock.writeLock().tryLock(100, TimeUnit.MILLISECONDS);
			// logger.info(writelockflag);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			//e.printStackTrace();
			logger.info("inside registerModule:"+e.getMessage());
		}
		try {
			if (writelockflag) {
				IAMTokenManager.oauthToken = IAMTokenManager.getIamproxy().registerModule("MECPORTAL", MECPORTALBASEURI,
						IAMTokenManager.getTargetApiMap(), "cloud_api_admin", "Admin@1234");
				logger.info(iamproxy.getEndPoints(oauthToken.getAccessToken()));
				return IAMTokenManager.oauthToken;
			}
		} catch (Exception e) {
			logger.info("Caught exception while registering module:"+e.getMessage());
			IAMTokenManager.oauthToken = null;

		} finally {
			if (tokenlock.isWriteLockedByCurrentThread())
				tokenlock.writeLock().unlock();
		}
		return null;
	}

	public static OAuthToken refreshToken() {
		OAuthToken oauth = null;
		oauth = getOauthToken();
		if (oauth == null) {
			return null;
		}
		boolean writelockflag = false;
		try {
			writelockflag = tokenlock.writeLock().tryLock(100, TimeUnit.MILLISECONDS);
			// logger.info(writelockflag);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			logger.info("inside refreshToken:"+e.getMessage());
			//e.printStackTrace();
		}
		try {
			if (writelockflag) {
				IAMTokenManager.oauthToken = IAMTokenManager.getIamproxy().refreshToken(oauth.getRefreshToken());
				return IAMTokenManager.oauthToken;
			}
		} finally {
			if (tokenlock.isWriteLockedByCurrentThread())
				tokenlock.writeLock().unlock();
		}
		return null;
	}
	/*
	 * @EventListener(ContextRefreshedEvent.class) public static void register()
	 * { logger.info("hello I have started"); logger.info(getTargetApiMap());
	 * oauthToken= registerModule();
	 * logger.info(oauthToken.getAccessToken()+oauthToken.getStatus()+oauthToken
	 * .getErrorMessage()); if(oauthToken==null ){ logger.
	 * info("Registering Module failed Retrying for Registering at time :"+new
	 * Date(new Date().getTime()+defaultRefreshTime*1000));
	 * IAMTokenManager.setEndPointMap(null); service.schedule(new
	 * ModuleRegister(), defaultRefreshTime, TimeUnit.SECONDS); }
	 * 
	 * else if(oauthToken.getAccessToken()==null ||
	 * oauthToken.getStatus().equalsIgnoreCase(failureString) ){ logger.
	 * info("Registering Module failed Retrying for Registering at time :"+new
	 * Date(new Date().getTime()+defaultRefreshTime*1000));
	 * 
	 * IAMTokenManager.setEndPointMap(null); service.schedule(new
	 * ModuleRegister(), defaultRefreshTime, TimeUnit.SECONDS); } else{
	 * logger.info("New scheduled Refresh time :" +new Date(new
	 * Date().getTime()+oauthToken.getExpiresIn()*1000));
	 * IAMTokenManager.setEndPointMap(IAMTokenManager.getIamproxy().getEndPoints
	 * (oauthToken.getAccessToken()));
	 * 
	 * service.schedule(new TokenRefresher(), oauthToken.getExpiresIn(),
	 * TimeUnit.SECONDS); } }
	 */

}
