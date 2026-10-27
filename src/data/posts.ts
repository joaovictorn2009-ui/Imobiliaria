export interface PostSection {
  heading: string
  paragraphs: string[]
  list?: string[]
}

export interface Post {
  slug: string
  title: string
  excerpt: string
  category: 'Financiamento' | 'Documentação' | 'Bairros'
  date: string // AAAA-MM-DD
  readMinutes: number
  sections: PostSection[]
}

// Conteúdo de orientação geral. Regras de crédito, taxas e impostos mudam: confirme sempre com o banco e o cartório.
export const POSTS: Post[] = [
  {
    slug: 'como-financiar-um-imovel',
    title: 'Como financiar um imóvel: guia dos primeiros passos',
    excerpt: 'Entrada, parcelas, sistemas de amortização e custos extras: o que entender antes de pedir o financiamento.',
    category: 'Financiamento',
    date: '2026-10-20',
    readMinutes: 5,
    sections: [
      {
        heading: 'Comece pelo orçamento, não pelo imóvel',
        paragraphs: [
          'Antes de visitar imóveis, calcule quanto cabe no seu orçamento mensal. Uma referência comum é que a parcela não passe de cerca de 30% da renda bruta da família, mas o limite ideal depende das suas outras despesas.',
          'Some também a reserva para a entrada e para os custos da compra. Entrar no financiamento sem folga no orçamento é o erro mais comum.',
        ],
      },
      {
        heading: 'Entrada, prazo e taxa',
        paragraphs: [
          'A entrada costuma ser uma parte importante do valor do imóvel, e os bancos definem o percentual máximo financiado. Quanto maior a entrada, menor a parcela e o total de juros.',
          'Compare o Custo Efetivo Total (CET), que reúne juros, seguros e tarifas, e não apenas a taxa de juros anunciada.',
        ],
        list: [
          'Simule em mais de um banco: as condições variam entre instituições.',
          'Pergunte se é possível usar o FGTS e em quais condições, pois as regras mudam.',
          'Verifique o seguro obrigatório e as tarifas incluídas na parcela.',
        ],
      },
      {
        heading: 'SAC ou Price?',
        paragraphs: [
          'No SAC as parcelas começam mais altas e diminuem ao longo do tempo, e o total de juros tende a ser menor. Na tabela Price as parcelas são iguais do início ao fim, o que facilita o planejamento, mas costuma custar mais no total.',
        ],
      },
      {
        heading: 'Custos que surpreendem',
        paragraphs: [
          'Além da entrada, reserve dinheiro para o imposto de transmissão (ITBI), a escritura e o registro em cartório. Os valores variam conforme a cidade e o valor do imóvel, então peça uma estimativa antes de fechar negócio.',
        ],
      },
    ],
  },
  {
    slug: 'documentos-para-comprar-imovel',
    title: 'Documentos para comprar um imóvel sem dor de cabeça',
    excerpt: 'A lista de documentos do vendedor, do imóvel e do comprador, e por que conferir tudo antes de assinar.',
    category: 'Documentação',
    date: '2026-10-22',
    readMinutes: 4,
    sections: [
      {
        heading: 'Por que conferir a documentação',
        paragraphs: [
          'Um imóvel pode ter dívidas, penhoras ou pendências que passam para o novo dono. Conferir os documentos antes de pagar o sinal evita prejuízo e atrasos na escritura.',
        ],
      },
      {
        heading: 'Documentos do imóvel',
        paragraphs: ['Peça cópias recentes e confira se os dados batem entre si.'],
        list: [
          'Matrícula atualizada, emitida pelo cartório de registro de imóveis.',
          'Certidão negativa de débitos de IPTU.',
          'Declaração de quitação do condomínio, quando houver.',
          'Habite-se e regularização da construção.',
        ],
      },
      {
        heading: 'Documentos do vendedor',
        paragraphs: ['A situação do vendedor também importa, já que dívidas dele podem afetar o negócio.'],
        list: [
          'RG, CPF e certidão de estado civil.',
          'Certidões negativas cíveis, fiscais e trabalhistas.',
          'Em caso de empresa, documentos societários e certidões da pessoa jurídica.',
        ],
      },
      {
        heading: 'Documentos do comprador',
        paragraphs: [
          'Em geral são documentos pessoais, comprovante de renda e de residência. Se houver financiamento, o banco pode pedir outros papéis.',
        ],
      },
      {
        heading: 'Dica final',
        paragraphs: [
          'Peça a um corretor ou advogado de confiança para revisar o contrato e a documentação. O custo é pequeno perto do valor de um imóvel.',
        ],
      },
    ],
  },
  {
    slug: 'como-escolher-o-bairro',
    title: 'Como escolher o bairro certo: 7 perguntas antes de decidir',
    excerpt: 'Rotina, transporte, barulho e serviços: um roteiro para avaliar a região além do imóvel.',
    category: 'Bairros',
    date: '2026-10-24',
    readMinutes: 4,
    sections: [
      {
        heading: 'O bairro pesa tanto quanto o imóvel',
        paragraphs: [
          'Você pode reformar uma casa, mas não muda a vizinhança. Antes de decidir, visite a região em horários e dias diferentes.',
        ],
      },
      {
        heading: 'As 7 perguntas',
        paragraphs: ['Responda com calma e, se possível, caminhando pelo bairro.'],
        list: [
          'Quanto tempo levo até o trabalho e a escola nos horários de pico?',
          'Há mercado, farmácia e serviços essenciais a pé ou a poucos minutos?',
          'Como é o barulho à noite e nos fins de semana?',
          'Como estão a iluminação e o movimento das ruas ao anoitecer?',
          'Há parques ou áreas de lazer por perto?',
          'Como é o histórico de valorização da região?',
          'Há obras ou projetos previstos que possam mudar o bairro?',
        ],
      },
      {
        heading: 'Use os números a seu favor',
        paragraphs: [
          'Compare o preço por metro quadrado entre bairros parecidos. Nas páginas de bairros do nosso site você vê a média dos imóveis anunciados e os imóveis de cada região.',
        ],
      },
    ],
  },
]

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug)

export const formatPostDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
