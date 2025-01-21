package com.example.paymentservice;

import com.example.paymentservice.dto.OrderRequestDTO;
import com.example.paymentservice.service.OrderService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@SpringBootTest
public class OrderServiceConcurrencyTest {

    @Autowired
    private OrderService orderService; // 테스트 대상 서비스

    @MockBean
    private RestTemplate restTemplate; // RestTemplate을 Mock으로 대체

    @Autowired
    private RedissonClient redissonClient;

    @Test
    public void testConcurrentOrderProcessing() throws InterruptedException {
        // Mock 설정: RestTemplate의 postForEntity 메서드 호출 시 가짜 응답 반환
        Mockito.when(restTemplate.postForEntity(Mockito.anyString(), Mockito.any(), Mockito.eq(Map.class)))
                .thenReturn(ResponseEntity.ok(Map.of(
                        "metadata", Map.of("userId", "test-user"),
                        "orderName", "test-order"
                )));

        String testOrderId = "test-order-123"; // 동일한 orderId로 테스트
        ExecutorService executorService = Executors.newFixedThreadPool(10); // 10개의 스레드 풀 생성

        for (int i = 0; i < 10; i++) {
            int threadNumber = i; // 스레드 번호를 구분하기 위해 사용
            executorService.submit(() -> {
                try {
                    OrderRequestDTO requestDTO = OrderRequestDTO.builder()
                            .paymentKey("test-payment-key-" + threadNumber)
                            .orderId(testOrderId) // 동일한 orderId 사용
                            .amount("1000")
                            .build();

                    orderService.CompleteOrder(requestDTO); // 서비스 호출
                } catch (Exception e) {
                    System.err.println("Exception in thread " + threadNumber + ": " + e.getMessage());
                }
            });
        }

        executorService.shutdown();
        executorService.awaitTermination(30, TimeUnit.SECONDS); // 모든 스레드 작업 완료 대기

        // Redis 락 상태 확인
        String lockKey = "lock:order:" + testOrderId;
        boolean isLockExists = redissonClient.getLock(lockKey).isLocked();
        System.out.println("락 상태 확인: " + isLockExists);

        if (!isLockExists) {
            System.out.println("락이 성공적으로 해제되었습니다.");
        } else {
            System.out.println("락이 아직 활성화 상태입니다.");
        }
    }
}