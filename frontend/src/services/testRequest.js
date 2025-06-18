// Arquivo para testar a criação de solicitações

// Função para testar a criação de solicitação
async function testCreateRequest() {
  const API_URL = 'http://localhost:8000/api';
  
  // Dados de teste
  const testData = {
    title: 'Teste de Solicitação',
    description: 'Esta é uma solicitação de teste',
    location: 'Rua de Teste, 123',
    user_id: 1
  };
  
  try {
    // Fazer requisição para o endpoint de teste
    const response = await fetch(`${API_URL}/test_api.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    console.log('Resposta do teste:', data);
    
    return data;
  } catch (error) {
    console.error('Erro no teste:', error);
    throw error;
  }
}

export { testCreateRequest };