package com.applyo.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Component
public class RequestLoggingFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String requestId = UUID.randomUUID().toString();
        long startTime = Instant.now().toEpochMilli();
        
        ServerHttpRequest request = exchange.getRequest();
        
        log.info("Request started - ID: {}, Method: {}, Path: {}, Client: {}",
                requestId,
                request.getMethod(),
                request.getPath().value(),
                request.getRemoteAddress());

        ServerHttpRequest modifiedRequest = request.mutate()
                .header("X-Request-Id", requestId)
                .header("X-Request-Start", String.valueOf(startTime))
                .build();

        return chain.filter(exchange.mutate().request(modifiedRequest).build())
                .then(Mono.fromRunnable(() -> {
                    long duration = Instant.now().toEpochMilli() - startTime;
                    log.info("Request completed - ID: {}, Status: {}, Duration: {}ms",
                            requestId,
                            exchange.getResponse().getStatusCode(),
                            duration);
                }));
    }

    @Override
    public int getOrder() {
        return -200;
    }
}
