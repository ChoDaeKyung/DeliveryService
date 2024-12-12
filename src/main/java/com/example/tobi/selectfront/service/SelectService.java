package com.example.tobi.selectfront.service;

import com.example.tobi.selectfront.client.SelectClient;
import com.example.tobi.selectfront.dto.GetSelectProductResponseDTO;
import com.example.tobi.selectfront.dto.SelectRequestDTO;
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
