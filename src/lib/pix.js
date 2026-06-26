// Gerador de payload Pix (BR Code / EMV) — funciona 100% no navegador, sem backend.
// Referência: Manual de Padrões para Iniciação do Pix (Banco Central do Brasil)

function tlv(id, value) {
  const length = String(value.length).padStart(2, '0')
  return `${id}${length}${value}`
}

function crc16(payload) {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff
      } else {
        crc = (crc << 1) & 0xffff
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function sanitize(str, maxLength) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .slice(0, maxLength)
}

/**
 * Gera o payload "copia e cola" do Pix estático.
 * @param {Object} params
 * @param {string} params.chave - chave Pix (telefone no formato +55DDDNUMERO, email, cpf, etc)
 * @param {string} params.nome - nome do recebedor (máx 25 caracteres, sem acento)
 * @param {string} params.cidade - cidade do recebedor (máx 15 caracteres, sem acento)
 * @param {number} params.valor - valor em reais (ex: 30.00). Use 0 ou omita para valor livre.
 * @param {string} params.txid - identificador da transação (máx 25 caracteres alfanuméricos, sem espaço)
 * @returns {string} payload Pix pronto para QR Code / copia e cola
 */
export function gerarPayloadPix({ chave, nome, cidade, valor, txid }) {
  const nomeSanitizado = sanitize(nome, 25) || 'RECEBEDOR'
  const cidadeSanitizada = sanitize(cidade, 15) || 'BRASIL'
  const txidSanitizado = (txid || '***').replace(/[^a-zA-Z0-9]/g, '').slice(0, 25) || '***'

  const merchantAccountInfo =
    tlv('00', 'br.gov.bcb.pix') +
    tlv('01', chave)

  let payload =
    tlv('00', '01') + // Payload Format Indicator
    tlv('26', merchantAccountInfo) + // Merchant Account Information (Pix)
    tlv('52', '0000') + // Merchant Category Code
    tlv('53', '986') + // Transaction Currency (BRL)
    (valor && valor > 0 ? tlv('54', valor.toFixed(2)) : '') + // Transaction Amount
    tlv('58', 'BR') + // Country Code
    tlv('59', nomeSanitizado) + // Merchant Name
    tlv('60', cidadeSanitizada) + // Merchant City
    tlv('62', tlv('05', txidSanitizado)) // Additional Data Field (TXID)

  payload += '6304' // CRC16 id + length placeholder
  const crc = crc16(payload)
  return payload + crc
}

/**
 * Formata um número de telefone brasileiro para o formato de chave Pix.
 * Ex: "75991163924" -> "+5575991163924"
 */
export function formatarChaveTelefone(numero) {
  const digits = numero.replace(/\D/g, '')
  if (digits.startsWith('55')) return `+${digits}`
  return `+55${digits}`
}
