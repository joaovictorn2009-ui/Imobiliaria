// Número de WhatsApp da imobiliária (DDI + DDD + número, só dígitos).
// Troque pelo número real definindo NEXT_PUBLIC_WHATSAPP_NUMBER nas variáveis de ambiente da Vercel.
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511999991111'

export const PHONE_DISPLAY = '(11) 3000-0000'
export const PHONE_HREF = 'tel:+551130000000'

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
