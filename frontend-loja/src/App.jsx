import { useState } from 'react';
import ListaProdutos from './ListaProdutos';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5236/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Salva o token
        setToken(data.token);
      } else {
        alert('Credenciais inválidas!');
      }
    } catch (error) {
      console.error("Erro no login", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // Se não tem token, mostra a tela de login
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md border flex flex-col gap-4 w-96">
          <h2 className="text-2xl font-bold text-center">Login da Loja</h2>
          <input type="text" placeholder="Usuário (admin ou comum)" value={usuario} onChange={e => setUsuario(e.target.value)} className="border p-2 rounded" />
          <input type="password" placeholder="Senha (123)" value={senha} onChange={e => setSenha(e.target.value)} className="border p-2 rounded" />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded font-bold">Entrar</button>
        </form>
      </div>
    );
  }

  // Se tem token, mostra o sistema
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto mb-4 flex justify-end px-6">
         <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Sair (Logout)</button>
      </div>
      <ListaProdutos />
    </div>
  );
}

export default App;