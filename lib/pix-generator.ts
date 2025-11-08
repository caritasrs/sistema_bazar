// PIX BR Code Generator following Banco Central do Brasil standards
// Based on EMV QR Code Specification

interface PixData {
  pixKey: string
  merchantName: string
  merchantCity: string
  amount: number
  txid?: string
}

function crc16(str: string): string {
  let crc = 0xffff
  const polynomial = 0x1021

  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial
      } else {
        crc <<= 1
      }
    }
  }

  crc &= 0xffff
  return crc.toString(16).toUpperCase().padStart(4, "0")
}

function formatTLV(id: string, value: string): string {
  const length = value.length.toString().padStart(2, "0")
  return `${id}${length}${value}`
}

export function generatePixPayload(data: PixData): string {
  // Payload Format Indicator
  let payload = formatTLV("00", "01")

  // Merchant Account Information
  let merchantAccount = formatTLV("00", "BR.GOV.BCB.PIX") // GUI
  merchantAccount += formatTLV("01", data.pixKey) // Chave PIX
  if (data.txid) {
    merchantAccount += formatTLV("02", data.txid) // Transaction ID
  }
  payload += formatTLV("26", merchantAccount)

  // Merchant Category Code (8398 = Charitable organizations)
  payload += formatTLV("52", "8398")

  // Transaction Currency (986 = BRL)
  payload += formatTLV("53", "986")

  // Transaction Amount
  if (data.amount > 0) {
    const amountStr = data.amount.toFixed(2)
    payload += formatTLV("54", amountStr)
  }

  // Country Code
  payload += formatTLV("58", "BR")

  // Merchant Name
  payload += formatTLV("59", data.merchantName.substring(0, 25))

  // Merchant City
  payload += formatTLV("60", data.merchantCity.substring(0, 15))

  // Additional Data Field Template
  if (data.txid) {
    const additionalData = formatTLV("05", data.txid.substring(0, 25))
    payload += formatTLV("62", additionalData)
  }

  // CRC16 (placeholder)
  payload += "6304"

  // Calculate and append CRC
  const crcValue = crc16(payload)
  payload += crcValue

  return payload
}

export function generatePixQRCodeUrl(payload: string): string {
  // Using QR Server API to generate QR Code image
  const encoded = encodeURIComponent(payload)
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`
}
