package de.asideas.crowdsource.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class Html5UrlModeConfig extends WebMvcConfigurerAdapter {

    private static final Integer TEN_MINUTES_IN_SECONDS = 600;
//
//    @Override
//    public void addViewControllers(ViewControllerRegistry registry) {
//        registry.addViewController("/swagger/").setViewName("forward:/swagger-ui.html");
//        registry.addViewController("/swagger").setViewName("redirect:/swagger/");
//    }


}