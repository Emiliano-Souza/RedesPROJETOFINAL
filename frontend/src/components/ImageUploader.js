import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const ImageUploader = ({ onImagesSelected, maxImages = 5, existingImages = [] }) => {
  const [previewImages, setPreviewImages] = useState(existingImages);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file count
    if (selectedFiles.length + previewImages.length > maxImages) {
      setError(`Você pode enviar no máximo ${maxImages} imagens.`);
      return;
    }
    
    // Validate file types and sizes
    const validFiles = [];
    const invalidFiles = [];
    
    selectedFiles.forEach(file => {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name} não é uma imagem válida.`);
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} excede o tamanho máximo de 5MB.`);
        return;
      }
      
      validFiles.push(file);
    });
    
    if (invalidFiles.length > 0) {
      setError(invalidFiles.join(' '));
      return;
    }
    
    // Create preview URLs for valid files
    const newPreviewImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    // Update state with new images
    setPreviewImages(prevImages => [...prevImages, ...newPreviewImages]);
    setError('');
    
    // Call parent callback with all files
    const allFiles = [...validFiles];
    onImagesSelected(allFiles);
  };

  const removeImage = (index) => {
    setPreviewImages(prevImages => {
      const newImages = [...prevImages];
      
      // Revoke object URL to prevent memory leaks
      if (newImages[index].preview && !newImages[index].url) {
        URL.revokeObjectURL(newImages[index].preview);
      }
      
      newImages.splice(index, 1);
      
      // Call parent callback with updated files
      const files = newImages
        .filter(img => img.file) // Only include new files, not existing ones
        .map(img => img.file);
      
      onImagesSelected(files);
      
      return newImages;
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="image-uploader mb-4">
      <div className="mb-3">
        <button 
          type="button" 
          className="btn btn-outline-primary"
          onClick={triggerFileInput}
          disabled={previewImages.length >= maxImages}
        >
          <i className="fas fa-camera me-2"></i>
          Adicionar Imagens
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="d-none"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        <small className="text-muted ms-3">
          {previewImages.length} de {maxImages} imagens
        </small>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {previewImages.length > 0 && (
        <div className="row g-2">
          {previewImages.map((image, index) => (
            <div key={index} className="col-6 col-md-4 col-lg-3">
              <div className="position-relative">
                <img
                  src={image.url || image.preview}
                  alt={`Preview ${index + 1}`}
                  className="img-thumbnail"
                  style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                  onClick={() => removeImage(index)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ImageUploader.propTypes = {
  onImagesSelected: PropTypes.func.isRequired,
  maxImages: PropTypes.number,
  existingImages: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  )
};

export default ImageUploader;