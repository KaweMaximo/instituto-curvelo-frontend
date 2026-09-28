/**
 * dados.js - conteúdo da plataforma separado da apresentação.
 * Para incluir um projeto novo, basta acrescentar um objeto aqui:
 * o card, o filtro e a página de detalhe são gerados automaticamente.
 */
export const CATEGORIAS = {
  oficina: 'Oficinas',
  mentoria: 'Mentoria',
  clube: 'Clubes'
};

export const PROJETOS = [
  {
    id: 'oficinas',
    titulo: 'Oficinas de tecnologia',
    categoria: 'oficina',
    imagem: 'oficina-tecnologia',
    alt: 'Jovens programando em notebooks durante uma oficina',
    resumo: 'Aulas práticas de programação, eletrônica e robótica para estudantes da rede pública.',
    descricao: 'Turmas de até 20 estudantes aprendem lógica de programação, montagem de circuitos e robótica com kits reaproveitados. Ao final do semestre, cada grupo apresenta um projeto para a comunidade.',
    publico: '14 a 18 anos',
    quando: 'Sábados, das 9h às 12h',
    vagasAbertas: true
  },
  {
    id: 'mentoria',
    titulo: 'Mentoria de carreira',
    categoria: 'mentoria',
    imagem: 'mentoria',
    alt: 'Mentora conversando com um estudante em frente a um computador',
    resumo: 'Profissionais voluntários acompanham jovens na escolha de cursos e no primeiro emprego.',
    descricao: 'Cada jovem é acompanhado por uma pessoa voluntária durante seis meses, com encontros on-line quinzenais sobre currículo, entrevistas e escolha de cursos técnicos e superiores.',
    publico: '16 a 24 anos',
    quando: 'Encontros quinzenais on-line',
    vagasAbertas: true
  },
  {
    id: 'clube',
    titulo: 'Clube de eletrônica',
    categoria: 'clube',
    imagem: 'turma-oficina',
    alt: 'Estudantes em uma bancada montando um circuito eletrônico',
    resumo: 'Encontros para montar projetos com sensores e placas, do protótipo à apresentação.',
    descricao: 'Espaço aberto para estudantes que já passaram pelas oficinas continuarem criando: estação meteorológica, irrigação automática e outros projetos ligados a problemas reais do bairro.',
    publico: '12 a 17 anos',
    quando: 'Quinzenal, às quartas',
    vagasAbertas: false
  }
];

export function buscarProjeto(id) {
  return PROJETOS.find((p) => p.id === id) || null;
}
