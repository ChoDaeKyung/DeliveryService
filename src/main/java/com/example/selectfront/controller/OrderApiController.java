package com.example.selectfront.controller;

import com.example.selectfront.dto.order.OrderRequestDTO;
import com.example.selectfront.dto.order.OrderResponseDTO;
import com.example.selectfront.service.OrderListService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orderList")
@Slf4j
public class OrderApiController {
    private final OrderListService orderListService;

    @PostMapping("/orderSend")
    public String sendMessage(@RequestBody OrderRequestDTO orderRequestDTO) {
        return orderListService.sendMessage(orderRequestDTO);
    }
    @GetMapping("/receiveStatus")
    public List<OrderResponseDTO> receiveMessages(@RequestParam String role,
                                                  @RequestParam String userId,
                                                  @RequestParam String status) {

        return orderListService.receiveMessages(role,userId,status);
    }
    @GetMapping("/receiveOrderIdMessages")
    public List<OrderResponseDTO> receiveOrderIdMessages(String orderId) {
        return orderListService.receiveOrderIdMessages(orderId);
    }

    @GetMapping("/orderList")
    public List<OrderResponseDTO> orderLists(@RequestParam String userId, @RequestParam String role) {
        log.info("📌 주문 목록 요청: userId={}, role={}", userId, role);

        List<OrderResponseDTO> orderResponseDTOS = orderListService.receiveOrderList(userId, role);
        if (orderResponseDTOS.isEmpty()) {
            log.info("🚨 주문 목록이 비어 있습니다.");
        } else {
            log.info("📦 주문 목록: {}", orderResponseDTOS);
            // 리스트가 비어있지 않을 때만 getFirst() 실행
            log.info("✅ 첫 번째 주문: {}", orderResponseDTOS.get(0));
        }

        return orderResponseDTOS;
    }

    @GetMapping("/orderCount")
    public int OrderCount(@RequestParam String userId ,@RequestParam String role) {
        log.info("🔍 주문 개수 요청 받음, userId: {}, role: {}", userId,role); // `sout` 대신 log 사용

        int count = orderListService.receiveOrderCount(userId,role);

        log.info("✅ 주문 개수 반환: {}", count); // 결과 값도 log로 출력
        return count;
    }
    @GetMapping("/chatListCount")
    public int ChatCount(@RequestParam String userId ,@RequestParam String role) {
        log.info("🔍 채팅 목록 개수 요청 받음, userId: {}, role: {}", userId,role); // `sout` 대신 log 사용

        int count = orderListService.receiveCountChatList(userId,role);

        log.info("✅ 채팅 개수 반환: {}", count); // 결과 값도 log로 출력
        return count;
    }
}
