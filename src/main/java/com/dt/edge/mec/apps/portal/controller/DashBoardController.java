package com.dt.edge.mec.apps.portal.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.dt.edge.mec.apps.portal.requesthandler.CentralReopositoryRequestHandler;
import com.dt.edge.mec.apps.portal.requesthandler.UsageRequestHandler;
@RestController
public class DashBoardController {
	
	@Autowired
	@Qualifier("UsageController")
	private UsageRequestHandler requestHandler;
	private final Logger logger = LogManager.getLogger(DashBoardController.class.getName());
	@Autowired
	private CentralReopositoryRequestHandler centralReopositoryRequestHandler;
	
	/*
     * getting usage detail for cpuusage
     */
    @RequestMapping(value = "getAppUsage/cpuusage/{userId}/{applicationName}/{duration}", method = RequestMethod.GET)
    public  ResponseEntity<?> getCpuUsage(@PathVariable("userId") String userId,@PathVariable("applicationName") String applicationName,@PathVariable("duration") String duration) throws Exception {
    	logger.info("<<<< getCpuUsage >>>>");
         return requestHandler.getCpuUsage(userId,applicationName,duration,"applicationusage");
      } 
    
    /*
     * getting letency for last 24 Hour
     */
    @RequestMapping(value = "getAppUsage/latency/{userId}/{applicationName}/{duration}", method = RequestMethod.GET)
    public  ResponseEntity<?> getlatency(@PathVariable("userId") String userId,@PathVariable("applicationName") String applicationName,@PathVariable("duration") String duration) throws Exception {
    	logger.info("<<<<getlatency >>>>");
         return requestHandler.getlatency(userId,applicationName,duration,"applicationusage");
      } 
    
    /*
     * Total Number of user Last 24hrs:
     */
    @RequestMapping(value = "getAppUsage/totalusers/{userId}/{applicationName}/{duration}", method = RequestMethod.GET)
    public  ResponseEntity<?> gettotalusers(@PathVariable("userId") String userId,@PathVariable("applicationName") String applicationName,@PathVariable("duration") String duration) throws Exception {
    	logger.info("<<<< gettotalusers >>>>");
         return requestHandler.gettotalusers(userId,applicationName,duration,"applicationusage");
      } 
    /*
     * getting total credit from userProfile for given userID
     */
    @RequestMapping(value = "totalAvailableCredit/{userId}", method = RequestMethod.GET)
    public  ResponseEntity<?> gettotalAvailableCredit(@PathVariable("userId") String userId) throws Exception {
    	logger.info("<<<< gettotalAvailableCredit >>>>");
         return centralReopositoryRequestHandler.getTotalAvailableCredit(userId);
      } 
    /*
     * get total subscription
     */
    @RequestMapping(value = "getAppUsage/totalsubscription/{userId}", method = RequestMethod.GET)
    public  ResponseEntity<?> gettotalsubscription(@PathVariable("userId") String userId) throws Exception {
    	logger.info("<<<< gettotalAvailableCredit >>>>");
         return centralReopositoryRequestHandler.gettotalsubscription(userId);
      } 
    
   /*
    * get top application
    * 
    */
    @RequestMapping(value = "getAppUsage/getTopApplication/{userId}/{metric}/{duration}", method = RequestMethod.GET)
    public  ResponseEntity<?> getTopApplication(@PathVariable("userId") String userId,@PathVariable("metric") String metric,@PathVariable("duration") String duration) throws Exception {
    	logger.info("<<<< gettotalAvailableCredit >>>>");
         return requestHandler.getTopApplication(userId,metric,duration,"applicationusage");
      } 
     
   @RequestMapping(value = "getAppUsage/getTopMicroservices/{userId}/{metric}/{duration}", method = RequestMethod.GET)
    public  ResponseEntity<?> getTopMicroservices(@PathVariable("userId") String userId,@PathVariable("metric") String metric,@PathVariable("duration") String duration) throws Exception {
    	logger.info("<<<< gettotalAvailableCredit >>>>");
         return requestHandler.getTopMicroservices(userId,metric,duration,"applicationusage");
      }
   @RequestMapping(value = "getMSUsage/getTopMicroservices/{userId}/{metric}/{duration}", method = RequestMethod.GET)
   public  ResponseEntity<?> getMSTopMicroservices(@PathVariable("userId") String userId,@PathVariable("metric") String metric,@PathVariable("duration") String duration) throws Exception {
   	logger.info("<<<< gettotalAvailableCredit >>>>");
        return requestHandler.getTopMicroservices(userId,metric,duration,"microserviceusage");
     }
   @RequestMapping(value = "getMSUsage/session/{userId}/{metric}/{duration}", method = RequestMethod.GET)
   public  ResponseEntity<?> getMSsession(@PathVariable("userId") String userId,@PathVariable("metric") String metric,@PathVariable("duration") String duration) throws Exception {
   	logger.info("<<<< gettotalAvailableCredit >>>>");
        return requestHandler.getsession(userId,metric,duration,"microserviceusage");
     }
   @RequestMapping(value = "getMSUsage/usage/{userId}/{metric}", method = RequestMethod.GET)
   public  ResponseEntity<?> getMSusage(@PathVariable("userId") String userId,@PathVariable("metric") String metric) throws Exception {
   	logger.info("<<<< gettotalAvailableCredit >>>>");
        return requestHandler.getusage(userId,metric,"microserviceusage");
     }
    @RequestMapping(value = "getMSUsage/cpuusage/{userId}/{Name}/{duration}", method = RequestMethod.GET)
    public  ResponseEntity<?> getMSCpuUsage(@PathVariable("userId") String userId,@PathVariable("Name") String applicationName,@PathVariable("duration") String duration) throws Exception {
    	logger.info("<<<< getCpuUsage >>>>");
         return requestHandler.getCpuUsage(userId,applicationName,duration,"microserviceusage");
      }  
    @RequestMapping(value = "/getCloudletUsage/tiles/{companyName}", method = RequestMethod.GET)
    public  ResponseEntity<?> getCloudlTiles(@PathVariable("companyName") String companyName) throws Exception {
    	logger.info("<<<< getcloudletTiles >>>>");
         return requestHandler.getcloudlettiles(companyName,"cloudletusage");
      }
    @RequestMapping(value = "/getCloudletUsage/getTopcloudlets/{companyName}/{infoType}", method = RequestMethod.GET)
    public  ResponseEntity<?> gettopCloudlets(@PathVariable("companyName") String companyName,@PathVariable("infoType") String infoType) throws Exception {
    	logger.info("<<<< getcloudletTiles >>>>");
         return requestHandler.getTopCloudlets(companyName,infoType,"cloudletusage");
      }

}
