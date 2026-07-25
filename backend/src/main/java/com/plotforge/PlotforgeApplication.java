package com.plotforge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * PlotForge backend application entry point.
 * No business logic lives here — this only bootstraps the Spring context.
 */
@SpringBootApplication
public class PlotforgeApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlotforgeApplication.class, args);
    }

}
