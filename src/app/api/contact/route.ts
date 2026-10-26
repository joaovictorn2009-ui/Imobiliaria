import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Informe telefone com DDD'),
  message: z.string().min(10, 'Escreva pelo menos 10 caracteres'),
  property: z.string().optional(),
  honeypot: z.string().optional(),
})

type FormDataType = z.infer<typeof schema>
type ActionResult = { success: boolean; error?: string; errors?: Partial<Record<keyof FormDataType, string>> }

export async function POST(request: NextRequest): Promise<NextResponse<ActionResult>> {
  try {
    const formData = await request.formData()

    const data: Partial<FormDataType> = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
      property: formData.get('property') as string | undefined,
      honeypot: formData.get('honeypot') as string | undefined,
    }

    // Anti-spam: honeypot field deve estar vazio
    if (data.honeypot) {
      return NextResponse.json({ success: false, error: 'Spam detectado' })
    }

    // Validação
    const parsed = schema.safeParse(data)
    if (!parsed.success) {
      const errors: Partial<Record<keyof FormDataType, string>> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormDataType
        errors[key] = issue.message
      }
      return NextResponse.json({ success: false, errors })
    }

    const { name, email, phone, message, property } = parsed.data

    // Rate limiting simples via header (em produção usar Vercel KV/Upstash)
    console.log(`Contact form submission from ${email} at ${new Date().toISOString()}`)

    try {
      // Envio de e-mail via Resend
      // Descomente e configure RESEND_API_KEY nas env vars para ativar
      /*
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      await resend.emails.send({
        from: 'Imobiliária Prime <contato@imobiliariaprime.com.br>',
        to: ['contato@imobiliariaprime.com.br'],
        replyTo: email,
        subject: `Novo contato: ${property ? `Interesse em ${property}` : 'Contato geral'}`,
        html: `
          <h2>Nova mensagem do site</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${phone}</p>
          ${property ? `<p><strong>Imóvel de interesse:</strong> ${property}</p>` : ''}
          <p><strong>Mensagem:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      })
      */

      // Simulação de envio (remover quando configurar Resend)
      await new Promise((resolve) => setTimeout(resolve, 500))

      return NextResponse.json({ success: true })
    } catch (err) {
      console.error('Error sending contact email:', err)
      return NextResponse.json({ success: false, error: 'Falha ao enviar mensagem. Tente novamente.' })
    }
  } catch (err) {
    console.error('Error processing contact form:', err)
    return NextResponse.json({ success: false, error: 'Erro ao processar formulário. Tente novamente.' })
  }
}