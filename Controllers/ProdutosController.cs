using exemplo02.Data;
using exemplo02.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization; // 1. Adicionada a importação necessária

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // 2. REGRA GERAL: Exige que o usuário esteja logado (autenticado) para acessar qualquer método deste controlador
    public class ProdutosController(AppDbContext context) : ControllerBase
    {
        // GET: api/Produtos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Produto>>> GetProdutos()
        {
            return await context.Produtos.ToListAsync();
        }

        // GET: api/Produtos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Produto>> GetProduto(int id)
        {
            var produto = await context.Produtos.FindAsync(id);

            if (produto == null)
            {
                return NotFound();
            }

            return produto;
        }

        // POST: api/Produtos
        [HttpPost]
        public async Task<ActionResult<Produto>> PostProduto(Produto produto)
        {
            context.Produtos.Add(produto);
            await context.SaveChangesAsync();

            return CreatedAtAction("GetProduto", new { id = produto.ProdutoID }, produto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduto(int id, Produto produto)
        {
            if (id != produto.ProdutoID)
            {
                return BadRequest();
            }

            context.Entry(produto).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")] // 3. REGRA ESPECÍFICA: Apenas usuários com a role "Administrador" podem excluir
        public async Task<IActionResult> DeleteProduto(int id)
        {
            var produto = await context.Produtos.FindAsync(id);
            if (produto == null)
            {
                return NotFound();
            }

            context.Produtos.Remove(produto);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}