package com.dt.edge.mec.apps.portal.utility;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.multipart.MultipartFile;


public class FileUtils {
	private static final Logger logger = LogManager.getLogger(FileUtils.class.getName());

	/**
	 * 
	 * @param files
	 * @return
	 * @throws IOException
	 */
	public static byte[] createZipFile(MultipartFile[] files) throws IOException {
		logger.info("<<<< FileUtils - createZipFile >>>>");
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		ZipOutputStream zipfile = new ZipOutputStream(bos);
		String fileName = null;
		ZipEntry zipentry = null;
		for (MultipartFile multipartFile : files) {
			fileName = (String) multipartFile.getOriginalFilename();
			logger.info("Reading filename=" + fileName);
			zipentry = new ZipEntry(fileName);
			zipfile.putNextEntry(zipentry);
			zipfile.write((byte[]) multipartFile.getBytes());
			zipfile.closeEntry();
		}
		zipfile.flush();
		zipfile.close();
		return bos.toByteArray();
	}
}
