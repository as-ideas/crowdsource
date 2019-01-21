package de.asideas.crowdsource.config;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.WriteConcern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import static java.util.stream.Collectors.toList;

@Configuration
@EnableMongoAuditing
@ComponentScan(basePackages = "de.asideas.crowdsource.repository", excludeFilters = @ComponentScan.Filter(Configuration.class))
@EnableMongoRepositories(basePackages = "de.asideas.crowdsource.repository")
public class MongoDBConfig extends AbstractMongoConfiguration {

    private final Logger LOG = LoggerFactory.getLogger(getClass());

    @Value("#{'${de.asideas.crowdsource.db.hosts:127.0.0.1}'.split(',')}")
    private List<String> hosts;

    @Value("${de.asideas.crowdsource.db.port:27017}")
    private int port;

    @Value("${de.asideas.crowdsource.db.name:crowdsource}")
    private String databaseName;

    @Value("${de.asideas.crowdsource.db.username:crowdsource}")
    private String username;

    @Value("${de.asideas.crowdsource.db.password:}")
    private String password;

    @Override
    protected String getDatabaseName() {
        return databaseName;
    }

    @Override
    public Mongo mongo() throws Exception {

        List<ServerAddress> serverAddresses = hosts.stream()
            .map(this::createServerAddress)
            .collect(toList());

        LOG.info("Connecting to DB hosts: {}...", serverAddresses);

        if (serverAddresses.size() == 1) {
            // create a mongo client that connects to a single database,
            // this is NOT the same as calling the constructor with a list of ServerAddresses with only one element!
            return new MongoClient(serverAddresses.get(0), mongoCredentials());
        } else {
            // create a mongo client that connects to a replicaset
            MongoClientOptions options = MongoClientOptions.builder()
                .writeConcern(WriteConcern.ACKNOWLEDGED)
                .build();
            return new MongoClient(serverAddresses, mongoCredentials(), options);
        }
    }

    @Bean
    public GridFsTemplate gridFsTemplate() throws Exception {
        return new GridFsTemplate(mongoDbFactory(), mappingMongoConverter());
    }

    private List<MongoCredential> mongoCredentials() {
        List<MongoCredential> res = new ArrayList<>(1);

        if (!username.isEmpty() && !password.isEmpty()) {
            res.add(MongoCredential.createCredential(username, databaseName, password.toCharArray()));
        }

        return res;
    }

    private ServerAddress createServerAddress(String host) {
        try {
            return new ServerAddress(host, port);
        } catch (UnknownHostException e) {
            throw new RuntimeException(e);
        }
    }
}
