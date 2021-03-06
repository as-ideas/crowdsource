package de.asideas.crowdsource.util;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import de.asideas.crowdsource.CrowdSource;

@SpringBootApplication
@Import(CrowdSource.class)
public class CrowdsourceTestApp {
}
