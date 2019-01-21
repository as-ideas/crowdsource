package de.asideas.crowdsource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.subethamail.wiser.Wiser;

@SpringBootApplication
@Import(CrowdSource.class)
public class CrowdSourceExample {

    @Value("${de.asideas.crowdsource.mail.port:1025}")
    private Integer mailServerPort;

    public static void main(String[] args) {

        extractHerokuMongoLabsArgs();
        SpringApplication.run(CrowdSourceExample.class, args);
    }

    private static void extractHerokuMongoLabsArgs() {
        String mongolabUriProperty = System.getenv("MONGODB_URI");
        if (StringUtils.isNotBlank(mongolabUriProperty)) {
            System.setProperty("spring.data.mongodb.uri", mongolabUriProperty);
        }
    }

    @Bean
    public Wiser mailServer() {

        Wiser wiser = new Wiser(mailServerPort);
        wiser.start();
        return wiser;
    }
}
