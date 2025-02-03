package com.example.selectfront.dto.location;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class DistanceResponse {
    private double distance; // 거리 (미터 단위)
    private int duration;    // 예상 시간 (초 단위)
}
