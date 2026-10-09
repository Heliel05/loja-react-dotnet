import { useState, useEffect } from 'react';

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para o formulário
  const [editingId, setEditingId] = useState(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [categoriaID, setCategoriaID] = useState(''); 

  const API_PRODUTOS = 'http://localhost:5236/api/produtos';
  const API_CATEGORIAS = 'http://localhost:5236/api/categorias';

  // Configuração do cabeçalho com o Token
  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const fetchData = () => {
    setLoading(true);
    
    // Carregar produtos e categorias em simultâneo enviando o Token de autenticação
    Promise.all([
      fetch(API_PRODUTOS, { headers: getHeaders() }).then(res => {
        if (res.status === 401) throw new Error("Não autorizado");
        return res.json();
      }),
      fetch(API_CATEGORIAS, { headers: getHeaders() }).then(res => res.json())
    ])
    .then(([produtosData, categoriasData]) => {
      setProdutos(produtosData);
      setCategorias(categoriasData);
      
      // Define a primeira categoria como padrão no form, se existir
      if (categoriasData.length > 0 && !categoriaID) {
        setCategoriaID(categoriasData[0].categoriaID);
      }
      setLoading(false);
    })
    .catch(error => {
      console.error("Erro ao carregar dados:", error);
      if (error.message === "Não autorizado") {
        alert("Sessão expirada ou usuário não autenticado. Faça login novamente.");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Obter o nome da categoria para o cartão do produto
  const getNomeCategoria = (id) => {
    const categoria = categorias.find(c => c.categoriaID === id);
    return categoria ? categoria.nome : 'Sem Categoria';
  };

  const resetForm = () => {
    setEditingId(null);
    setNome('');
    setDescricao('');
    setPreco('');
    setEstoque('');
    setCategoriaID(categorias.length > 0 ? categorias[0].categoriaID : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const produtoData = {
      nome,
      descricao,
      preco: parseFloat(preco),
      estoque: parseInt(estoque, 10),
      categoriaID: parseInt(categoriaID, 10),
      ativo: "S"
    };

    try {
      let response;
      if (editingId) {
        produtoData.produtoID = editingId;
        response = await fetch(`${API_PRODUTOS}/${editingId}`, {
          method: 'PUT',
          headers: getHeaders(), // Passa o token no PUT
          body: JSON.stringify(produtoData)
        });
      } else {
        response = await fetch(API_PRODUTOS, {
          method: 'POST',
          headers: getHeaders(), // Passa o token no POST
          body: JSON.stringify(produtoData)
        });
      }

      if (response.status === 401) {
        alert("Você precisa estar logado para fazer isso.");
        return;
      }
      if (response.status === 403) {
        alert("Acesso negado: Você não tem permissão para realizar esta ação.");
        return;
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error("Erro ao guardar o produto:", error);
    }
  };

  const handleEdit = (produto) => {
    setEditingId(produto.produtoID);
    setNome(produto.nome);
    setDescricao(produto.descricao || '');
    setPreco(produto.preco);
    setEstoque(produto.estoque);
    if (produto.categoriaID) setCategoriaID(produto.categoriaID);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem a certeza que deseja eliminar este produto?")) {
      try {
        const response = await fetch(`${API_PRODUTOS}/${id}`, {
          method: 'DELETE',
          headers: getHeaders() // Passa o token no DELETE
        });

        // Verificação de Autorização e Autenticação
        if (response.status === 401) {
          alert("Erro: Você não está autenticado.");
          return;
        }
        if (response.status === 403) {
          alert("Erro 403 (Proibido): Apenas Administradores podem excluir produtos!");
          return;
        }

        fetchData(); // Atualiza apenas os produtos após eliminar
      } catch (error) {
        console.error("Erro ao eliminar o produto:", error);
      }
    }
  };

  if (loading) return <p className="p-4 text-center">A carregar dados...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Gestão de Produtos</h2>
      
      {/* Formulário de Registo/Edição */}
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl shadow-md border">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {editingId ? 'Editar Produto' : 'Adicionar Novo Produto'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Nome do Produto</label>
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required className="border p-2 rounded" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Preço (R$)</label>
            <input type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} required className="border p-2 rounded" />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-semibold text-gray-600 mb-1">Descrição</label>
            <input type="text" value={descricao} onChange={e => setDescricao(e.target.value)} className="border p-2 rounded" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Quantidade em Estoque</label>
            <input type="number" value={estoque} onChange={e => setEstoque(e.target.value)} required className="border p-2 rounded" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Categoria</label>
            <select value={categoriaID} onChange={e => setCategoriaID(e.target.value)} required className="border p-2 rounded bg-white">
              <option value="" disabled>Selecione uma categoria</option>
              {categorias.map(cat => (
                <option key={cat.categoriaID} value={cat.categoriaID}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

        </div>
        <div className="mt-6 flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold">
            {editingId ? 'Atualizar Produto' : 'Gravar Produto'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition font-semibold">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Listagem de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtos.map(produto => (
          <div key={produto.produtoID} className="border rounded-xl p-5 shadow-md bg-white hover:shadow-lg transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl text-gray-900">{produto.nome}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border">
                  {getNomeCategoria(produto.categoriaID)}
                </span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">{produto.descricao}</p>
              
              <div className="flex justify-between items-center mt-6 mb-2">
                <span className="font-extrabold text-2xl text-blue-600">
                  {formatarMoeda(produto.preco)}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${produto.estoque > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {produto.estoque > 0 ? `Estoque: ${produto.estoque}` : 'Esgotado'}
                </span>
              </div>
            </div>
            
            {/* Botões de Ação */}
            <div className="flex justify-end gap-2 border-t pt-3 mt-2">
              <button onClick={() => handleEdit(produto)} className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200 transition font-semibold">
                Editar
              </button>
              <button onClick={() => handleDelete(produto.produtoID)} className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition font-semibold">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}