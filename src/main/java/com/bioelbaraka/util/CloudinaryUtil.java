package com.bioelbaraka.util;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.io.File;
import java.io.IOException;
import java.util.Map;

public class CloudinaryUtil {
    private static final Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "dzjuwcdjo",
            "api_key", "152774553247158",
            "api_secret", "4FtzozXwG3IwNAzYi2OydTFc3I0"
    ));

    public static String upload(File file, String dossier) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file, ObjectUtils.asMap(
                "folder", dossier
        ));
        return (String) uploadResult.get("secure_url");
    }
} 