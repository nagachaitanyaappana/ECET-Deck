package com.ecetdesk.api.pyq;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SupabasePaperStorageService {
    private static final long MAX_BYTES = 20L * 1024 * 1024;
    private final String supabaseUrl;
    private final String serviceRoleKey;
    private final String bucket;
    private final HttpClient client = HttpClient.newHttpClient();

    public SupabasePaperStorageService(
        @Value("${app.supabase.url:}") String supabaseUrl,
        @Value("${app.supabase.service-role-key:}") String serviceRoleKey,
        @Value("${app.supabase.storage-bucket:pyq-papers}") String bucket) {
        this.supabaseUrl = supabaseUrl == null ? "" : supabaseUrl.replaceAll("/+$", "");
        this.serviceRoleKey = serviceRoleKey == null ? "" : serviceRoleKey;
        this.bucket = bucket == null || bucket.isBlank() ? "pyq-papers" : bucket;
    }

    public UploadedPaper upload(MultipartFile file, int year, String paperType) {
        if (supabaseUrl.isBlank() || serviceRoleKey.isBlank())
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                "PDF upload is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the backend.");
        if (file == null || file.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a PDF file.");
        if (file.getSize() > MAX_BYTES) throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "PDF files must be 20 MB or smaller.");
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equalsIgnoreCase("application/pdf"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PDF files are accepted.");
        try {
            byte[] bytes = file.getBytes();
            if (bytes.length < 5 || bytes[0] != '%' || bytes[1] != 'P' || bytes[2] != 'D' || bytes[3] != 'F' || bytes[4] != '-')
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The selected file does not contain a valid PDF signature.");
            String path = "C23/DCME/" + year + "/" + paperType.toLowerCase() + "-" + UUID.randomUUID() + ".pdf";
            String endpoint = supabaseUrl + "/storage/v1/object/" + encode(bucket) + "/" + encodePath(path);
            HttpRequest request = HttpRequest.newBuilder(URI.create(endpoint))
                .header("apikey", serviceRoleKey)
                .header("Authorization", "Bearer " + serviceRoleKey)
                .header("Content-Type", "application/pdf")
                .header("x-upsert", "false")
                .POST(HttpRequest.BodyPublishers.ofByteArray(bytes))
                .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300)
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Supabase Storage rejected the upload (HTTP " + response.statusCode() + "). Check that the bucket exists and the service key is valid.");
            String publicUrl = supabaseUrl + "/storage/v1/object/public/" + encode(bucket) + "/" + encodePath(path);
            return new UploadedPaper(path, publicUrl);
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Could not upload the PDF to Supabase Storage.", ex);
        }
    }

    private String encode(String value) { return URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20"); }
    private String encodePath(String path) {
        return java.util.Arrays.stream(path.split("/")).map(this::encode).collect(java.util.stream.Collectors.joining("/"));
    }
    public record UploadedPaper(String storagePath, String publicUrl) {}
}
