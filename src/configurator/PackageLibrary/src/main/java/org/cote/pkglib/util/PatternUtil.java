package org.cote.pkglib.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.cote.accountmanager.util.StreamUtil;
import org.cote.pkglib.factories.PackageFactory;
import org.cote.pkglib.objects.PackageType;
import org.cote.pkglib.objects.PatternSetType;
import org.cote.pkglib.objects.PatternType;
import org.cote.pkglib.objects.ResourceType;

public class PatternUtil {
	private static Map<String,Pattern> patterns = new HashMap<String,Pattern>();
	public static final Logger logger = LogManager.getLogger(PatternUtil.class);
	public static Pattern getPattern(String pattern){
		if(pattern == null || pattern.length() == 0) return null;
		if(patterns.containsKey(pattern)) return patterns.get(pattern);
		Pattern p = Pattern.compile(pattern,Pattern.MULTILINE);
		patterns.put(pattern, p);
		return p;
	}
	public static String applyPattern(PatternType pattern, String content){
		String out_content = content;
		String match = pattern.getMatch();
		String use_replace = pattern.getReplace();
		if(pattern.getVolatileReplace() != null) use_replace = pattern.getVolatileReplace();
		
		if(match.equals("%JSC_STRIP_SPACE_AROUND_SPECIAL_CHAR%")){
			match = "\\s*([,:?+\\*\\-=;()<>&!|{])\\s*";
		}
		if(match.equals("%JSC_STRIP_SPACE_AROUND_CONDITIONS%")){
			match = "\\s*\\}[ \\t\\r\\f]*";
		}
		if(match.equals("%JSC_STRIP_EXTRA_SPACE%")){
			match = "(\\s)+";
		}
	
		if(use_replace.equals("%JSC_NEWLINE%")){
			use_replace = System.getProperty("line.separator");
		}
		if(use_replace.equals("%JSC_NEWLINE_HASHFUNCTION%")){
			use_replace = ":\nfunction";
		}
		
		Pattern pat = getPattern(pattern.getMatch());
		if(pat == null) return out_content;
		
		//if(use_replace.length() == 0) logger.info("EMPTY REPLACE: " + pat.toString());
		if(use_replace != null){
			Matcher m = pat.matcher(out_content);
			if(m.find()){
				out_content = m.replaceAll(use_replace);
			}
		}
		else{
			logger.warn("Null replace for " + match);
		}
		return out_content;
	}
	public static String applyPatternsToResource(PackageType pkg, PatternSetType pset, ResourceType rec){
		String out_string = null;

		/* strip out XML comments */
		if(rec.getMimeType().equals("text/javascript")){
			try{
			File f = PackageFactory.getResourceFile(pkg, rec);
	
			BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(f),StandardCharsets.UTF_8));
			StringWriter strWriter = new StringWriter();
			BufferedWriter writer = new BufferedWriter(strWriter);
			
			String line = null;
			Pattern p = Pattern.compile("^\\s*///\\s*(.*)$",Pattern.MULTILINE);
			String returnChar = System.getProperty("line.separator");
			while( (line = reader.readLine()) != null){
				if(p.matcher(line).matches() == false){
					writer.write(line + returnChar);
				}

			}
			reader.close();
			writer.close();
			out_string = strWriter.getBuffer().toString();
			//System.out.println(out_string);
			}
			catch(IOException e){
				e.printStackTrace();
			}
		}
		else{
			out_string = new String(StreamUtil.fileHandleToBytes(new File((new File(pkg.getConfigPath())).getParent(),rec.getSourceFile())),StandardCharsets.UTF_8);

		}
		List<PatternType> patterns = pset.getPatterns();
		PatternType pattern = null;
		for(int p = 0; p < patterns.size(); p++){
			pattern = patterns.get(p);
			if(pattern.getReplace() != null && pattern.getReplace().equals("%VERSION%")){
				pattern.setVolatileReplace(pkg.getMajorVersion() + "." + pkg.getMinorVersion() + "." + pkg.getBuildVersion());
			}
			out_string = applyPattern(pattern, out_string);
		}
		
		return out_string;
	}
}
