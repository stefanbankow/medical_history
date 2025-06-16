package com.medical.history.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import lombok.Data;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "app")
@Data
public class AppProperties {
    
    private final Jwt jwt = new Jwt();
    private final Cors cors = new Cors();
    
    @Data
    public static class Jwt {
        private String secret;
        private long expiration;
    }
    
    @Data
    public static class Cors {
        private List<String> allowedOrigins;
    }
}
