<%@ page language="java" contentType="application/javascript; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"
    import = "java.util.Date"
    %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
long defCacheSeconds = 7200;
long expiry = new Date().getTime() + (defCacheSeconds*1000);

response.setHeader("Cache-Control", "public,max-age="+ defCacheSeconds);
response.setDateHeader("Expires", expiry);
response.setCharacterEncoding("UTF-8");

%>
(function(){
   
	if(!window.g_application_path) window.g_application_path = "/AccountManagerService/";
	if(!window.HemiConfig){
		window.HemiConfig = {
			dependencies : ["hemi.data.io","hemi.data.io.proxy","hemi.framework.io.offline.provider"]
		};
	}
	if(!window.HemiConfig.hemi_base) window.HemiConfig.hemi_base= "/HemiFramework/Hemi/";
})();
<c:import url="http://localhost:8080/HemiFramework/Hemi/hemi.comp.js" />
if(!window.HemiEngine) window.HemiEngine=window.Hemi;
<%@include file="pagescript.js" %>
<%@include file="services.registration.js" %>

<%@include file="3rdParty/base64.js" %>
<%@include file="3rdParty/Aes.complete.js" %>

