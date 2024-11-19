package org.example.backend.image.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.image.model.ImageEntity;
import org.example.backend.image.repository.ImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;

    public String uploadImage(MultipartFile imageFile) throws IOException {
        var imageToSave = ImageEntity.builder()
                .name(imageFile.getOriginalFilename())
                .type(imageFile.getContentType())
                .imageData(imageFile.getBytes())
                .build();

        imageRepository.save(imageToSave);
        return "file uploaded successfully : " + imageFile.getOriginalFilename();
    }

    public byte[] downloadImage(String id) {
        Optional<ImageEntity> dbImage = imageRepository.findByImageId(id);

        return dbImage.get().getImageData();
    }
}