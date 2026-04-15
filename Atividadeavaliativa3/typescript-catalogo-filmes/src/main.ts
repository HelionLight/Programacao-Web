import { createInterface } from 'readline';
import { stdin as input, stdout as output } from 'process';
import { CatalogoFilmes } from './catalogo-filmes';
import { Filme } from './interfaces/filme';

const rl = createInterface({
  input,
  output
});

const catalogo = new CatalogoFilmes();

function mostrarMenu(): void {
  console.log('\\n=== Catálogo de Filmes ===');
  console.log('1. Adicionar filme');
  console.log('2. Listar todos os filmes');
  console.log('3. Buscar por título');
  console.log('4. Buscar por gênero');
  console.log('5. Remover por título');
  console.log('6. Ordenar por ano');
  console.log('7. Ordenar por avaliação');
  console.log('0. Sair');
}

async function perguntar(pergunta: string): Promise<string> {
  return new Promise((resolve) => rl.question(pergunta, resolve));
}

async function adicionarFilme(): Promise<void> {
  const titulo = await perguntar('Título: ');
  const anoStr = await perguntar('Ano: ');
  const ano = parseInt(anoStr) || 0;
  const genero = await perguntar('Gênero: ');
  const duracaoStr = await perguntar('Duração (min): ');
  const duracao = parseInt(duracaoStr) || 0;
  const avaliacaoStrStr = await perguntar('Avaliação (0-10, opcional): ');
  const avaliacao = avaliacaoStrStr ? parseFloat(avaliacaoStrStr) : undefined;

  try {
    const filme: Filme = { titulo, ano, genero, duracao, avaliacao };
    catalogo.adicionarFilme(filme);
    console.log('✅ Filme adicionado!');
  } catch (error) {
    console.log('❌ Erro:', (error as Error).message);
  }
}

function listarFilmes(): void {
  const filmes = catalogo.listarFilmes();
  if (filmes.length === 0) {
    console.log('Nenhum filme cadastrado.');
    return;
  }
  filmes.forEach((f, i) => {
    console.log(`${i+1}. ${f.titulo} (${f.ano}) - ${f.genero} - ${f.duracao}min ${f.avaliacao !== undefined ? `- Avaliação: ${f.avaliacao}` : ''}`);
  });
}

async function buscarTitulo(): Promise<void> {
  const termo = await perguntar('Digite o título (parcial): ');
  const resultados = catalogo.buscarPorTitulo(termo);
  console.log(`\\nResultados para "${termo}":`);
  resultados.forEach((f, i) => {
    console.log(`${i+1}. ${f.titulo} (${f.ano})`);
  });
  if (resultados.length === 0) console.log('Nenhum filme encontrado.');
}

async function buscarGenero(): Promise<void> {
  const termo = await perguntar('Digite o gênero (parcial): ');
  const resultados = catalogo.buscarPorGenero(termo);
  console.log(`\\nResultados para "${termo}":`);
  resultados.forEach((f, i) => {
    console.log(`${i+1}. ${f.titulo} (${f.ano})`);
  });
  if (resultados.length === 0) console.log('Nenhum filme encontrado.');
}

async function removerFilme(): Promise<void> {
  const titulo = await perguntar('Título para remover: ');
  if (catalogo.removerPorTitulo(titulo)) {
    console.log('✅ Filme removido!');
  } else {
    console.log('❌ Filme não encontrado.');
  }
}

function ordenarAno(): void {
  const ordenados = catalogo.ordenarPorAno();
  console.log('\\nFilmes ordenados por ano:');
  ordenados.forEach(f => console.log(`${f.titulo} (${f.ano})`));
}

function ordenarAvaliacao(): void {
  const ordenados = catalogo.ordenarPorAvaliacao();
  console.log('\\nFilmes ordenados por avaliação (desc):');
  ordenados.forEach(f => console.log(`${f.titulo} - ${f.avaliacao ?? 'N/A'}`));
}

// Loop principal
async function main(): Promise<void> {
  let opcao: string;
  do {
    mostrarMenu();
    opcao = await perguntar('Escolha uma opção: ');

    switch (opcao) {
      case '1': 
        await adicionarFilme(); 
        break;
      case '2': 
        listarFilmes(); 
        break;
      case '3': 
        await buscarTitulo(); 
        break;
      case '4': 
        await buscarGenero(); 
        break;
      case '5': 
        await removerFilme(); 
        break;
      case '6': 
        ordenarAno(); 
        break;
      case '7': 
        ordenarAvaliacao(); 
        break;
      case '0': 
        console.log('Saindo...'); 
        break;
      default: 
        console.log('Opção inválida!');
    }

    if (opcao !== '0') {
      await perguntar('Pressione Enter para continuar...');
    }
  } while (opcao !== '0');
  rl.close();
}

main().catch(console.error);

