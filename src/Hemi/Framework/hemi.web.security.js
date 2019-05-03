/// <source>
/// <name>Hemi.web.security</name>
/// <project>
/// 	<name>Hemi JavaScript Framework</name>
/// 	<url-title>Hemi JavaScript Framework</url-title>
/// 	<url>/Hemi/</url>
/// </project>
///
/// <package>
///	<path>Hemi.web</path>
///	<library>Hemi</library>
///	<description>Utilities for exploit mitigation.</description>
/// <static-class>
///		<name>security</name>
///		<description>A utility class for providing client support for exploit mitigation (requires corresponding server-side support).</description>
(function(){
	HemiEngine.namespace("web.security", HemiEngine, {
		dependencies : ["hemi.app"],
		/// <property type = "array" get = "1">
		/// 	<name>PageTickets</name>
		/// 	<description>Array of tickets included with the Web page.  Tickets should be included for server-side requests requiring the presence of a ticket.</description>
		/// </property>
		PageTickets : [],

		/// <method>
		/// 	<name>AddPageTicket</name>
		///		<param name="sId" type="String">Ticket identifier.</param>
		///		<param name="sUri" type="String" optional = "1">URL used to restrict the use of the ticket.</param>
		/// 	<description>Adds a new page ticket to the PageTickets array.  Used to reduce CSRF exploit potential.  A page ticket is a guid stored with the session, optionally for a specific server resource, and which may be required to complete an action.  Refer to the Hemi/Components/component.session.xml component, Account Manager 4 project, and Core Web project for a reference implementation.</description>
		/// </method>
		AddPageTicket : function(i,u){
			var _p = HemiEngine.web.security.PageTickets;
			HemiEngine.web.security.PageTickets.push({
				id:i,
				uri:u
			});
			/*
			if(g_page_tickets.length && document.forms.length && document.forms[0]["PageTicket"])
				document.forms[0]["PageTicket"].value = i;
			}
			*/
		},
		/// <method>
		/// 	<name>GetSession</name>
		///		<return-value type = "object" name = "oSession">Returns the session object from the registry.</return-value>
		/// 	<description>Returns any session object added to the registry.  Hemi includes the Session component for use with Account Manager 4.  This can easily be updated to fit any desired server configuration.</description>
		/// </method>
		GetSession : function(){
			return HemiEngine.registry.service.getObject("session");
		},
		/// <method>
		/// 	<name>IsAuthenticated</name>
		///		<return-value type = "boolean" name = "bAuth">Returns a bit indicating whether the session includes an authentication bit.</return-value>
		/// 	<description>Uses the Session Component to determine whether the current session has been authenticated.</description>
		/// </method>
		IsAuthenticated : function(){
			var o = HemiEngine.web.security.GetSession();
			if(!o) return 0;
			return o.GetBoolParam("IsLoggedIn");
		}
	});
}());
/// </static-class>
/// </package>
/// </source>