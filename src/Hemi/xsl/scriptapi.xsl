<?xml
   version="1.0"
   encoding="utf-8"
?>

<xsl:stylesheet
   version="2.0"
   xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
>
<xsl:template match="/"  xml:space="preserve">
<html>
<head>
<title>API<xsl:text> </xsl:text><xsl:value-of select = "/source/name" /><xsl:text> </xsl:text><xsl:choose><xsl:when test = "/source/project/name"><xsl:value-of select = "/source/project/name" /></xsl:when><xsl:otherwise>NO NAME</xsl:otherwise></xsl:choose></title>
<link rel="stylesheet" href="ApiStyles.css" type="text/css" />
</head>
<body>
<xsl:apply-templates select = "/source" />
<p class="copyright">[ Hemi JavaScript Framework - Stephen W. Cote, 2002 - 2013. ]</p>
</body>
</html>
</xsl:template>
<xsl:template match = "source">
<h1><xsl:choose><xsl:when test = "project/name"><xsl:value-of select = "project/name" /></xsl:when><xsl:otherwise>NO NAME</xsl:otherwise></xsl:choose></h1>
<h2><xsl:value-of select = "name" /></h2>
<ul class = "top-nav">
<li><a><xsl:attribute name = "href"><xsl:value-of select = "project/url" /></xsl:attribute><xsl:value-of select = "project/url-title" /></a></li>
<xsl:if test = "index"><li><a><xsl:attribute name = "href"><xsl:value-of select = "index/url" /></xsl:attribute><xsl:value-of select = "index/url-title" /></a></li></xsl:if>
<xsl:if test = "parent"><li><a><xsl:attribute name = "href"><xsl:value-of select = "parent/url" /></xsl:attribute><xsl:value-of select = "parent/url-title" /></a></li></xsl:if>
</ul>
<xsl:if test ="package/description"><h3>Description</h3><p><xsl:value-of select = "package/description" /></p></xsl:if>
<xsl:apply-templates select = "package | indices" />
</xsl:template>
<xsl:template match = "indices">

	<ul class = "index">
         <xsl:for-each
            select="index"
            xml:space="default"
         >
         <li>
			<a><xsl:attribute name="href"><xsl:value-of select = "url" /></xsl:attribute><xsl:value-of select = "url-title" /></a> (<a><xsl:attribute name="href"><xsl:value-of select = "xml-url" /></xsl:attribute>xml</a>)<br />
			<xsl:if test ="description"><p class ="messagedesc"><xsl:value-of select = "description" /></p></xsl:if>
		</li>
         </xsl:for-each>
       </ul>

</xsl:template>
<xsl:template match = "package">

<xsl:choose><xsl:when test = "path"><xsl:attribute name = "class">package</xsl:attribute></xsl:when><xsl:otherwise><xsl:attribute name="class">global</xsl:attribute></xsl:otherwise></xsl:choose>
<xsl:if test = "count(class | static-class) > 1">
<a name="classindex"><xsl:text> </xsl:text></a>
<h3>Class Index</h3>
	<ul class = "index">
         <xsl:for-each
            select="class | static-class"
            xml:space="default"
         >
            <xsl:sort select="name" />
		<li><a><xsl:attribute name="href">#<xsl:value-of select = "name" /></xsl:attribute><xsl:if test = "name() = 'static-class'"><i>static </i></xsl:if><xsl:if test = "../path"><xsl:value-of select = "../path" />.</xsl:if><xsl:value-of select = "name" /></a><xsl:if test = "description">: <xsl:value-of select = "description" /></xsl:if></li>
	</xsl:for-each>
	</ul>	
</xsl:if>
<xsl:apply-templates select = "class | static-class | global" />

</xsl:template>

<xsl:template match = "class | static-class | global">
<xsl:if test = "not(name() = 'global')">
<a><xsl:attribute name = "name"><xsl:value-of select = "name" /></xsl:attribute><xsl:text> </xsl:text></a>
<h3 class = "membertitle"><xsl:if test = "name() = 'static-class'"><i>static </i></xsl:if><xsl:if test = "../path"><xsl:value-of select = "../path" />.</xsl:if><xsl:value-of select = "name" /></h3>
</xsl:if>
<h4>version <xsl:value-of select = "version" /></h4>
<xsl:if test = "description"><p class="desc"><xsl:value-of select = "description" /></p></xsl:if>
<p class = "desc">
<xsl:if test = "example/@implementation='1'">
See <a><xsl:attribute name="href">#<xsl:value-of select = "example[@implementation='1']/name" /></xsl:attribute><xsl:value-of select = "example[@implementation='1']/name" /></a> for an example of implementating the script on a page.<xsl:text> </xsl:text>
</xsl:if>
<xsl:if test = "not(../path/text())">This class resides in the global namespace.<xsl:text> </xsl:text></xsl:if>
<!--
<xsl:choose><xsl:when test = "../library">This class participates in the <xsl:value-of select = "../library" /> library.</xsl:when><xsl:otherwise>This class does not participate in another library.</xsl:otherwise></xsl:choose>
-->
</p>

<xsl:if test = "example | object | method | message | property">
	<h3>Index</h3>
	<xsl:if test = "example">
	<a><xsl:attribute name="name"><xsl:value-of select = "name/text()" />exampleindex</xsl:attribute><xsl:text> </xsl:text></a>
	<h4>Example Index</h4>
	<ul class = "index">
         <xsl:for-each
            select="example"
            xml:space="default"
         >
            <xsl:sort select="name" />
		<li><a><xsl:attribute name="href">#<xsl:value-of select = "name" /></xsl:attribute><xsl:value-of select = "name" /></a><xsl:if test = "description">: <xsl:value-of select = "description" /></xsl:if></li>
	</xsl:for-each>
	</ul>	
	</xsl:if>
	<xsl:if test = "object">
	<a><xsl:attribute name="name"><xsl:value-of select = "name/text()" />objectindex</xsl:attribute><xsl:text> </xsl:text></a>
	<h4>Object Index</h4>
	<ul class = "index">
         <xsl:for-each
            select="object"
            xml:space="default"
         >
            <xsl:sort select="name" />
		<li><xsl:choose><xsl:when test="@private">private</xsl:when><xsl:when test="@virtual">virtual</xsl:when><xsl:otherwise>public</xsl:otherwise></xsl:choose><xsl:text> </xsl:text><a><xsl:attribute name="href">#<xsl:value-of select = "name" /></xsl:attribute><xsl:value-of select = "name" /></a><xsl:if test = "@internal='1'"> (<b>internal</b>)</xsl:if><xsl:if test = "description">: <xsl:value-of select = "description" /></xsl:if></li>
	</xsl:for-each>
	</ul>
	</xsl:if>
	<xsl:if test = "property">
	<a><xsl:attribute name="name"><xsl:value-of select = "name/text()" />propertyindex</xsl:attribute><xsl:text> </xsl:text></a>
	<h4>Property Index</h4>
	<ul class = "index">
         <xsl:for-each
            select="property"
            xml:space="default"
         >
            <xsl:sort select="name" />
		<li><xsl:choose><xsl:when test="@private">private</xsl:when><xsl:when test="@virtual">virtual</xsl:when><xsl:otherwise>public</xsl:otherwise></xsl:choose><xsl:text> </xsl:text><a><xsl:attribute name="href">#<xsl:value-of select = "name" /></xsl:attribute><xsl:value-of select = "name" /></a><xsl:if test = "@internal='1'"> (<b>internal</b>)</xsl:if><xsl:if test = "description">: <xsl:value-of select = "description" /></xsl:if></li>
	</xsl:for-each>
	</ul>
	</xsl:if>
	<xsl:if test = "method">
	<a><xsl:attribute name="name"><xsl:value-of select = "name/text()" />methodindex</xsl:attribute><xsl:text> </xsl:text></a>
	<h4>Method Index</h4>
	<ul class = "index">
         <xsl:for-each
            select="method"
            xml:space="default"
         >
            <xsl:sort select="name" />
		<li><xsl:choose><xsl:when test="@private">private</xsl:when><xsl:when test="@virtual">virtual</xsl:when><xsl:otherwise>public</xsl:otherwise></xsl:choose><xsl:text> </xsl:text><a><xsl:attribute name="href">#<xsl:value-of select = "name" /></xsl:attribute><xsl:value-of select = "name" /></a><xsl:if test = "@internal='1'"> (<b>internal</b>)</xsl:if><xsl:if test = "description">: <xsl:value-of select = "description" /></xsl:if></li>
	
	</xsl:for-each>
	</ul>
	</xsl:if>
	<xsl:if test = "message">
	<a><xsl:attribute name="name"><xsl:value-of select = "name/text()" />messageindex</xsl:attribute><xsl:text> </xsl:text></a>
	<h4>Message Index</h4>
	<ul class = "index">
         <xsl:for-each
            select="message"
            xml:space="default"
         >
            <xsl:sort select="name" />
		<li><xsl:choose><xsl:when test="@private">private</xsl:when><xsl:when test="@virtual">virtual</xsl:when><xsl:otherwise>public</xsl:otherwise></xsl:choose><xsl:text> </xsl:text><a><xsl:attribute name="href">#<xsl:value-of select = "name" /></xsl:attribute><xsl:value-of select = "name" /></a><xsl:if test = "@internal='1'"> (<b>internal</b>)</xsl:if><xsl:if test = "description">: <xsl:value-of select = "description" /></xsl:if></li>
	
	</xsl:for-each>
	</ul>
	</xsl:if>
	<xsl:if test = "example">
	<h3>Examples</h3>
         <xsl:for-each
            select="example"
            xml:space="default"
         >
            <xsl:sort select="name" />
		<xsl:apply-templates select = "." />
	</xsl:for-each>
	</xsl:if>
	<xsl:if test = "object">
	<h3>Objects</h3>
         <xsl:for-each
            select="object"
            xml:space="default"
         >
            <xsl:sort select="name" />
		<xsl:apply-templates select = "." />
	</xsl:for-each>
	</xsl:if>
	<xsl:if test = "property">
	<h3>Properties</h3>
         <xsl:for-each
            select="property"
            xml:space="default"
         >
            <xsl:sort select="name" />
		<xsl:apply-templates select = "." />
	</xsl:for-each>
	</xsl:if>
	<xsl:if test = "method">
	<h3>Methods</h3>
         <xsl:for-each
            select="method"
            xml:space="default"
         >
            <xsl:sort select="name" />
		<xsl:apply-templates select = "." />
	</xsl:for-each>
	</xsl:if>
	<xsl:if test = "message">
	<h3>Messages</h3>
         <xsl:for-each
            select="message"
            xml:space="default"
         >
            <xsl:sort select="name" />
		<xsl:apply-templates select = "." />
	</xsl:for-each>
	</xsl:if>
</xsl:if>
</xsl:template>


<xsl:template match = "example">
<a><xsl:attribute name="name"><xsl:value-of select = "name" /></xsl:attribute></a>
<h3 class="membertitle"><xsl:value-of select = "name" /></h3>
<ul class = "nav">
<li><a href = "#">Top</a></li>
<xsl:if test = "count(../../class | ../../static-class) > 1"><li><a href="#classindex">Class Index</a></li></xsl:if>
<li><a><xsl:attribute name="href">#<xsl:value-of select = "../name/text()" /></xsl:attribute><xsl:value-of select = "../name/text()" /></a></li>
<li><a><xsl:attribute name="href">#<xsl:value-of select = "../name/text()" />exampleindex</xsl:attribute>Examples</a></li>
</ul>

<p class = "exampledesc"><xsl:value-of select = "description" /></p>
<xsl:if test = "syntax">
<h4>Syntax</h4>
<p class = "methodsyntax">
<xsl:value-of select = "syntax/text()" />
</p>
</xsl:if>
<xsl:if test = "code">
<h4>Example Code</h4>
<pre class = "example">
<xsl:for-each select = "code" xml:space="preserve">
<xsl:apply-templates /></xsl:for-each>
</pre>
</xsl:if>
</xsl:template>


<xsl:template match = "object">
<a><xsl:attribute name="name"><xsl:value-of select = "name" /></xsl:attribute></a>
<h3 class="membertitle"><xsl:value-of select = "name" /></h3>
<ul class = "nav">
<li><a href = "#">Top</a></li>
<xsl:if test = "count(../../class | ../../static-class) > 1"><li><a href="#classindex">Class Index</a></li></xsl:if>
<li><a><xsl:attribute name="href">#<xsl:value-of select = "../name/text()" /></xsl:attribute><xsl:value-of select = "../name/text()" /></a></li>
<li><a><xsl:attribute name="href">#<xsl:value-of select = "../name/text()" />objectindex</xsl:attribute>Objects</a></li>
</ul>

<p class = "objectdesc"><xsl:value-of select = "description" />
<xsl:if test = "@private='1'"><xsl:text> </xsl:text>Object is private and should not be directly referenced.</xsl:if>
<xsl:if test = "@virtual='1'"><xsl:text> </xsl:text>Object is virtual and can be overridden.</xsl:if>
</p>
<xsl:if test = "property">
<h4>Properties</h4>
<ul class = "methodparams">
<xsl:for-each select = "property">
<xsl:sort select="name" />
<li>
	<b><xsl:value-of select = "@name" /></b>
	<xsl:text> as </xsl:text>	
	<xsl:value-of select = "@type" />
	<xsl:if test = "text()"><xsl:text>: </xsl:text>	<xsl:value-of select = "text()" /></xsl:if>
</li>
</xsl:for-each>
</ul>
</xsl:if>
<xsl:if test = "method">
<h4>Methods</h4>
<ul class = "methodparams">
<xsl:for-each select = "method">
<xsl:sort select="name" />
<li>
<xsl:choose><xsl:when test = "return-value"><xsl:value-of select = "return-value/@type" /> = </xsl:when><xsl:otherwise>void </xsl:otherwise></xsl:choose>
<b><xsl:value-of select = "name" /></b>(
<xsl:for-each select = "param">
	<xsl:choose><xsl:when test = "@optional"><i><xsl:value-of select="@name" /></i></xsl:when><xsl:otherwise><xsl:value-of select= "@name" /></xsl:otherwise></xsl:choose>
	<xsl:if test="position()!=last()">
      	<xsl:text>, </xsl:text>
      </xsl:if>
</xsl:for-each>)
<p class ="messagedesc"><xsl:value-of select ="description" /></p>
</li>
</xsl:for-each>
</ul>
</xsl:if>

<xsl:if test = "message">
<h4>Messages</h4>
<ul class = "messageparams">
<xsl:for-each select = "message">
<xsl:sort select="name" />
<li>
<xsl:choose><xsl:when test = "return-value"><xsl:value-of select = "return-value/@type" /> = </xsl:when><xsl:otherwise>void </xsl:otherwise></xsl:choose>
<xsl:value-of select = "name" />(
<xsl:for-each select = "param">
	<xsl:choose><xsl:when test = "@optional"><i><xsl:value-of select="@name" /></i></xsl:when><xsl:otherwise><xsl:value-of select= "@name" /></xsl:otherwise></xsl:choose>
	<xsl:if test="position()!=last()">
      	<xsl:text>, </xsl:text>
      </xsl:if>
</xsl:for-each>)
</li>
</xsl:for-each>
</ul>
</xsl:if>
</xsl:template>

<xsl:template match = "property">
<a><xsl:attribute name="name"><xsl:value-of select = "name" /></xsl:attribute></a>
<h3 class="membertitle"><xsl:value-of select = "name" /></h3>
<ul class = "nav">
<li><a href = "#">Top</a></li>
<xsl:if test = "count(../../class | ../../static-class) > 1"><li><a href="#classindex">Class Index</a></li></xsl:if>
<li><a><xsl:attribute name="href">#<xsl:value-of select = "../name/text()" /></xsl:attribute><xsl:value-of select = "../name/text()" /></a></li>
<li><a><xsl:attribute name="href">#<xsl:value-of select = "../name/text()" />propertyindex</xsl:attribute>Properties</a></li>
</ul>
<p class = "propertydesc"><xsl:value-of select = "description" />
<xsl:if test = "@private='1'"><xsl:text> </xsl:text>Property is private and should not be directly referenced.</xsl:if>
<xsl:if test = "@virtual='1'"><xsl:text> </xsl:text>Property is virtual and can be overridden.</xsl:if>
</p>
<h4>Syntax</h4>
<xsl:if test = "@get='1'">
<p class = "propertysyntax">
<xsl:value-of select = "@type" /><xsl:text> = </xsl:text><xsl:choose><xsl:when test = "name(..)='static-class'"><xsl:if test = "../../path"><xsl:value-of select = "../../path/text()" />.</xsl:if><xsl:value-of select = "../name" /></xsl:when><xsl:otherwise><i>object</i></xsl:otherwise></xsl:choose>.<xsl:value-of select = "name" />
</p>
</xsl:if>
<xsl:if test = "@set='1'">
<p class = "propertysyntax">
<xsl:choose><xsl:when test = "name(..) ='static-class'"><xsl:if test = "../../path"><xsl:value-of select = "../../path/text()" />.</xsl:if><xsl:value-of select = "../name" /></xsl:when><xsl:otherwise><i>object</i></xsl:otherwise></xsl:choose>.<xsl:value-of select = "name" /><xsl:text> = </xsl:text><xsl:value-of select = "@type" />
</p>
</xsl:if>
<xsl:if test = "@default">
<h4>Default Value</h4>
<ul class = "methodparams">
<li><xsl:value-of select = "@type" /><xsl:text> </xsl:text><b><xsl:value-of select = "@default" /></b></li>
</ul>
</xsl:if>
</xsl:template>


<xsl:template match = "method">
<a><xsl:attribute name="name"><xsl:value-of select = "name" /></xsl:attribute></a>
<h3 class="membertitle"><xsl:value-of select = "name" /></h3>
<ul class = "nav">
<li><a href = "#">Top</a></li>
<xsl:if test = "count(../../class | ../../static-class) > 1"><li><a href="#classindex">Class Index</a></li></xsl:if>
<li><a><xsl:attribute name="href">#<xsl:value-of select = "../name/text()" /></xsl:attribute><xsl:value-of select = "../name/text()" /></a></li>
<li><a><xsl:attribute name="href">#<xsl:value-of select = "../name/text()" />methodindex</xsl:attribute>Methods</a></li>
</ul>
<p class = "methoddesc"><xsl:value-of select = "description" />
<xsl:if test = "@private='1'"><xsl:text> </xsl:text>Method is private and should not be directly referenced.</xsl:if>
<xsl:if test = "@virtual='1'"><xsl:text> </xsl:text>Method is virtual and can be overridden.</xsl:if>
</p>
<h4>Syntax</h4>
<p class = "methodsyntax">
<xsl:choose><xsl:when test = "return-value"><xsl:value-of select = "return-value/@name" /> = </xsl:when><xsl:otherwise>void </xsl:otherwise></xsl:choose>
<xsl:value-of select = "name" />(
<xsl:for-each select = "param">
	<xsl:choose><xsl:when test = "@optional"><i><xsl:value-of select="@name" /></i></xsl:when><xsl:otherwise><xsl:value-of select= "@name" /></xsl:otherwise></xsl:choose>
	<xsl:if test="position()!=last()">
      	<xsl:text>, </xsl:text>
      </xsl:if>
</xsl:for-each>
)
</p>
<xsl:if test = "param">
<h4>Parameters</h4>
<ul class = "methodparams">
<xsl:for-each select = "param">
<li>
	<b><xsl:value-of select = "@name" /></b>
	<xsl:text> as </xsl:text>	
	<xsl:value-of select = "@type" />
	<xsl:text> </xsl:text>
	<xsl:if test = "@optional"><i>(optional)</i></xsl:if>
	<xsl:if test = "text()"><xsl:text>: </xsl:text>	<xsl:value-of select = "text()" /></xsl:if>
</li>
</xsl:for-each>
</ul>
</xsl:if>
<xsl:if test = "return-value">
<h4>Returns</h4>
<p class = "returnvalue">
	<b><xsl:value-of select = "return-value/@name" /></b>
	<xsl:text> as </xsl:text>	
	<xsl:value-of select = "return-value/@type" />
	<xsl:if test = "return-value/text()"><xsl:text>: </xsl:text> <xsl:value-of select = "return-value/text()" /></xsl:if>
</p>
</xsl:if>
</xsl:template>
<xsl:template match = "a">
<a><xsl:attribute name = "href"><xsl:value-of select="@href" /></xsl:attribute><xsl:value-of select = "." /></a>
</xsl:template>

<xsl:template match = "message">
<a><xsl:attribute name="name"><xsl:value-of select = "name" /></xsl:attribute></a>
<h3 class="membertitle"><xsl:value-of select = "name" /></h3>
<ul class = "nav">
<li><a href = "#">Top</a></li>
<xsl:if test = "count(../../class | ../../static-class) > 1"><li><a href="#classindex">Class Index</a></li></xsl:if>
<li><a><xsl:attribute name="href">#<xsl:value-of select = "../name/text()" /></xsl:attribute><xsl:value-of select = "../name/text()" /></a></li>
<li><a><xsl:attribute name="href">#<xsl:value-of select = "../name/text()" />messageindex</xsl:attribute>Messages</a></li>
</ul>
<p class = "messagedesc"><xsl:value-of select = "description" />
<xsl:if test = "@private='1'"><xsl:text> </xsl:text>Message is private and should not be directly referenced.</xsl:if>
<xsl:if test = "@virtual='1'"><xsl:text> </xsl:text>Message is virtual and can be overridden.</xsl:if>
</p>
<h4>Syntax</h4>
<p class = "messagesyntax">
// User-specified script to subscribe to message
<br />
org.cote.js.message.MessageService.subscribe("<xsl:value-of select = "name" />",<i>_handle_message</i>);
<br />
// Internal: how the message is published to subscribers
<br />
org.cote.js.message.MessageService.publish("<xsl:value-of select = "name" />" 
<xsl:for-each select = "param">
	<xsl:text>, </xsl:text>
	<xsl:choose><xsl:when test = "@optional"><i><xsl:value-of select="@name" /></i></xsl:when><xsl:otherwise><xsl:value-of select= "@name" /></xsl:otherwise></xsl:choose>
</xsl:for-each>
);
<br />
// User-specified script to handle the message subscription
<br />
function <i>_handle_message</i>("<xsl:value-of select = "name" />"
<xsl:for-each select = "param">
	<xsl:text>, </xsl:text>
	<xsl:choose><xsl:when test = "@optional"><i><xsl:value-of select="@name" /></i></xsl:when><xsl:otherwise><xsl:value-of select= "@name" /></xsl:otherwise></xsl:choose>
</xsl:for-each>
){
<br />
// message handler code
<br />
}
</p>
<xsl:if test = "param">
<h4>Parameters</h4>
<ul class = "messageparams">
<xsl:for-each select = "param">
<li>
	<b><xsl:value-of select = "@name" /></b>
	<xsl:text> as </xsl:text>	
	<xsl:value-of select = "@type" />
	<xsl:text> </xsl:text>
	<xsl:if test = "@optional"><i>(optional)</i></xsl:if>
	<xsl:if test = "text()"><xsl:text>: </xsl:text>	<xsl:value-of select = "text()" /></xsl:if>
</li>
</xsl:for-each>
</ul>
</xsl:if>
<xsl:if test = "return-value">
<h4>Returns</h4>
<p class = "returnvalue">
	<b><xsl:value-of select = "return-value/@name" /></b>
	<xsl:text> as </xsl:text>	
	<xsl:value-of select = "return-value/@type" />
	<xsl:if test = "return-value/text()"><xsl:text>: </xsl:text> <xsl:value-of select = "return-value/text()" /></xsl:if>
</p>
</xsl:if>
</xsl:template>
<xsl:template match = "a">
<a><xsl:attribute name = "href"><xsl:value-of select="@href" /></xsl:attribute><xsl:value-of select = "." /></a>
</xsl:template>

<!--
         <xsl:for-each
            select="ducks/ducklings/duckling/name"
            xml:space="default"
         >
            <xsl:sort select="text()" />
-->

</xsl:stylesheet>