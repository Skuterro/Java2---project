package org.example.backend.image.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.exception.ContextedRuntimeException;
import org.example.backend.image.model.Image;
import org.example.backend.image.repository.ImageRepository;
import org.example.backend.image.utils.ImageUtils;
import org.springframework.http.RequestEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.zip.DataFormatException;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;

    public String uploadImage(MultipartFile imageFile) throws IOException {
        var imageToSave = Image.builder()
                .name(imageFile.getOriginalFilename())
                .type(imageFile.getContentType())
                .imageData(imageFile.getBytes())
                .build();

        Image savedImage = imageRepository.save(imageToSave);
        return savedImage.getImageId();
    }

    public byte[] downloadImage(String id) {
        Optional<Image> dbImage = imageRepository.findByImageId(id);

        return dbImage.get().getImageData();
    }
}