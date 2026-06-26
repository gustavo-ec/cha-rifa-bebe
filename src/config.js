// ============================================================
// CONFIGURAÇÃO DA RIFA — edite aqui os dados principais
// ============================================================

import { formatarChaveTelefone } from './lib/pix'

export const CONFIG = {
  // Dados do recebedor do Pix
  pix: {
    chave: formatarChaveTelefone('75991163924'),
    nomeRecebedor: 'Gustavo Silva Ribeiro',
    cidade: 'Feira de Sant.',
  },

  // Dados da rifa
  rifa: {
    titulo: 'Chá Rifa da Bebê',
    subtitulo: 'Ajude a gente a preparar a chegada dela',
    dataPrevista: 'Setembro de 2026',
    totalNumeros: 200,
    precoPorNumero: 30,
    // Texto livre que aparece na página, pode editar à vontade
    descricao:
      'Em setembro nossa família vai ganhar um novo membro! Para ajudar com os preparativos da chegada da nossa filha, estamos organizando esta rifa. Cada número contribui diretamente para o enxoval, quarto e tudo que ela vai precisar. Obrigado por fazer parte desse momento com a gente.',
  },
}
