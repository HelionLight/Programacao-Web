import { Filme } from './interfaces/filme';

export class CatalogoFilmes {
  private filmes: Filme[] = [];

  adicionarFilme(filme: Filme): void {
    // Validação simples da avaliação
    if (filme.avaliacao !== undefined && (filme.avaliacao < 0 || filme.avaliacao > 10)) {
      throw new Error('Avaliação deve estar entre 0 e 10');
    }
    this.filmes.push(filme);
  }

  listarFilmes(): Filme[] {
    return this.filmes;
  }

  buscarPorTitulo(titulo: string): Filme[] {
    return this.filmes.filter(f => f.titulo.toLowerCase().includes(titulo.toLowerCase()));
  }

  buscarPorGenero(genero: string): Filme[] {
    return this.filmes.filter(f => f.genero.toLowerCase().includes(genero.toLowerCase()));
  }

  removerPorTitulo(titulo: string): boolean {
    const index = this.filmes.findIndex(f => f.titulo.toLowerCase() === titulo.toLowerCase());
    if (index > -1) {
      this.filmes.splice(index, 1);
      return true;
    }
    return false;
  }

  // Bônus: ordenar por ano
  ordenarPorAno(): Filme[] {
    return [...this.filmes].sort((a, b) => a.ano - b.ano);
  }

  // Bônus: ordenar por avaliação (desc)
  ordenarPorAvaliacao(): Filme[] {
    return [...this.filmes]
      .sort((a, b) => (b.avaliacao ?? 0) - (a.avaliacao ?? 0));
  }
}

