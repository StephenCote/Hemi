package org.cote.pkglib.factories;

import java.io.File;

import org.cote.accountmanager.util.FileUtil;
import org.cote.accountmanager.util.JAXBUtil;
import org.cote.pkglib.objects.PackageVersionType;

public class PackageVersionFactory {
	public static boolean exportPackageVersion(PackageVersionType pkgVersion, String path){
		String contents = JAXBUtil.exportObject(PackageVersionType.class, pkgVersion);
		return FileUtil.emitFile(path, contents);
	}
	public static PackageVersionType importPackageVersion(String path){
		File f = new File(path);
		if(f.exists() == false) return null;
		return JAXBUtil.importObject(PackageVersionType.class, FileUtil.getFileAsString(path));
	}
	
	public static void importIntoPackageVersion(PackageVersionType pkgVersion, String path){
		PackageVersionType pkg = importPackageVersion(path);
		if(pkg == null) return;
		pkgVersion.setBuildVersion(pkg.getBuildVersion());
		pkgVersion.setMajorVersion(pkg.getMajorVersion());
		pkgVersion.setMinorVersion(pkgVersion.getMinorVersion());
		pkgVersion.setName(pkg.getName());
	}
	public static String getVersion(PackageVersionType pkg){
		return pkg.getMajorVersion() + "." + pkg.getMinorVersion() + "." + pkg.getBuildVersion();
	}
}
