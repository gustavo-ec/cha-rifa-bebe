import { formatarChaveTelefone } from './lib/pix'

export const CONFIG = {
  pix: {
    chave: formatarChaveTelefone('75991163924'),
    nomeRecebedor: 'Gustavo Silva Ribeiro',
    cidade: 'Feira de Sant.',
  },

  rifa: {
    nomeBebe: 'Maria Idália',
    titulo: 'Chá Rifa da Maria Idália',
    subtitulo: 'Ela vem aí e a gente quer celebrar com você',
    dataPrevista: 'Setembro de 2026',
    totalNumeros: 200,
    precoPorNumero: 30,
    descricao:
      'Em setembro, nossa família vai ser presenteada com a chegada da Maria Idália! Para ajudar nos preparativos do enxoval e tudo que ela vai precisar, estamos organizando este chá rifa. Cada número é uma forma carinhosa de fazer parte desse momento tão especial.',
  },

  premio: {
    valor: 200,
    descricao: 'R$ 200,00 em dinheiro',
    detalhe: 'O sorteio será realizado pela Loteria Federal. O número do bilhete sorteado define o vencedor.',
  },
}
