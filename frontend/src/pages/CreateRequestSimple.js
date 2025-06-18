import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';

function CreateRequestSimple() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    urgency: 'normal'
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const categories = [
    'Encanamento',
    'Elétrica',
    'Montagem de Móveis',
    'Pintura',
    'Jardinagem',
    'Limpeza',
    'Carpintaria',
    'Alvenaria',
    'Instalação de Ar Condicionado',
    'Conserto de Eletrodomésticos'
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImagesSelected = (selectedImages) => {
    setImages(selectedImages);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Processar imagens para armazenamento
    const processedImages = [];
    
    // Converter imagens para base64 para armazenamento no localStorage
    const processImages = async () => {
      for (const image of images) {
        const base64 = await convertToBase64(image);
        processedImages.push({
          name: image.name,
          type: image.type,
          data: base64,
          size: image.size
        });
      }
      
      // Armazenar no localStorage para simular persistência
      const requests = JSON.parse(localStorage.getItem('requests') || '[]');
      const newRequest = {
        id: Date.now(),
        ...formData,
        images: processedImages,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      requests.push(newRequest);
      localStorage.setItem('requests', JSON.stringify(requests));
      
      // Redirecionar e mostrar mensagem
      alert('Solicitação criada com sucesso!');
      navigate('/requests');
    };
    
    processImages();
  };
  
  // Função para converter arquivo para base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h2 className="h4 mb-0">Nova Solicitação de Serviço</h2>
              <span className="badge bg-light text-primary">Versão Offline</span>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Título da Solicitação</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ex: Consertar torneira com vazamento"
                    required
                  />
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="category" className="form-label">Categoria</label>
                    <select
                      className="form-select"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="urgency" className="form-label">Urgência</label>
                    <select
                      className="form-select"
                      id="urgency"
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="low">Baixa</option>
                      <option value="normal">Normal</option>
                      <option value="high">Alta</option>
                      <option value="emergency">Emergência</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Localização</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Ex: Rua Principal, 123, Centro"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Descrição Detalhada</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Descreva o problema em detalhes..."
                    required
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="form-label">Fotos (opcional)</label>
                  <ImageUploader 
                    onImagesSelected={handleImagesSelected}
                    maxImages={5}
                  />
                  <small className="text-muted">
                    Adicione até 5 fotos para ajudar os prestadores a entenderem melhor o serviço.
                  </small>
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enviando...
                      </>
                    ) : 'Criar Solicitação'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRequestSimple;