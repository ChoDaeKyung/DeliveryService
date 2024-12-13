package com.example.selectfront.service;

import com.example.selectfront.client.SelectClient;
import com.example.selectfront.dto.GetSelectProductResponseDTO;
import com.example.selectfront.dto.SelectRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SelectService {

    private final SelectClient selectClient;

    public String insertSelect(SelectRequestDTO selectRequestDTO) {
        return selectClient.insertSelect(selectRequestDTO);
    }

    public List<GetSelectProductResponseDTO> getProducts() {
        return selectClient.getSelectProduct();
    }

}
