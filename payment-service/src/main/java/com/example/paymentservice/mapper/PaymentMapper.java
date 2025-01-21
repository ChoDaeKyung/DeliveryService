package com.example.paymentservice.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PaymentMapper {
    void deleteCompleteProductCartList(String userId);
    void deleteProductsCartList(String userId);
}
