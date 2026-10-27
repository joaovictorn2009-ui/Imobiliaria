import type { PlanSpec } from './types'

/**
 * Casa térrea do anúncio "Casa em Condomínio Fechado - Alphaville" (450 m², 4 suítes, 5 banheiros,
 * 4 vagas, living para 3 ambientes, cozinha planejada, área gourmet com churrasqueira, piscina e
 * jardim). A planta é uma reconstrução ILUSTRATIVA a partir dos dados do anúncio, não o projeto oficial.
 *
 * Norte para cima: os quartos ficam ao fundo (norte), a rua e a garagem ao sul.
 * As medidas abaixo são "de projeto"; o motor ajusta a escala para a área do anúncio.
 */
export const ALPHAVILLE: PlanSpec = {
  id: 'alphaville',
  propertyId: '2',
  title: 'Casa em Condomínio - Alphaville',
  subtitle: 'Térrea · 4 suítes · 4 vagas · piscina',
  targetArea: 450,
  ceiling: 3.1,
  pool: { x: 30.8, z: 1.4, w: 6.8, d: 4.6 },
  rooms: [
    // Ala íntima (fundos)
    { id: 'mb', name: 'Suíte master', short: 'Suíte master', rects: [{ x: 0, z: 0, w: 5.0, d: 5.2 }], floor: 'wood', tone: 'timber', desc: 'Suíte principal com closet e banheiro privativo, voltada para o jardim.' },
    { id: 'mc', name: 'Closet da master', short: 'Closet', rects: [{ x: 5.0, z: 0, w: 2.2, d: 5.2 }], floor: 'wood', desc: 'Closet com armários planejados do chão ao teto.' },
    { id: 'mba', name: 'Banheiro da master', short: 'Bwc master', rects: [{ x: 7.2, z: 0, w: 2.8, d: 5.2 }], floor: 'tileLight', desc: 'Banheiro com box de vidro, bancada e janela alta.' },
    { id: 's2', name: 'Suíte 2', short: 'Suíte 2', rects: [{ x: 10, z: 0, w: 4.4, d: 5.2 }], floor: 'wood', desc: 'Suíte com banheiro privativo e armários planejados.' },
    { id: 's2b', name: 'Banheiro suíte 2', short: 'Bwc 2', rects: [{ x: 14.4, z: 0, w: 2.3, d: 5.2 }], floor: 'tileLight', desc: 'Banheiro da suíte 2, com box e janela alta.' },
    { id: 's3', name: 'Suíte 3', short: 'Suíte 3', rects: [{ x: 16.7, z: 0, w: 4.4, d: 5.2 }], floor: 'wood', desc: 'Suíte com banheiro privativo e janela para o jardim.' },
    { id: 's3b', name: 'Banheiro suíte 3', short: 'Bwc 3', rects: [{ x: 21.1, z: 0, w: 2.3, d: 5.2 }], floor: 'tileLight', desc: 'Banheiro da suíte 3, com box e janela alta.' },
    { id: 's4', name: 'Suíte 4', short: 'Suíte 4', rects: [{ x: 23.4, z: 0, w: 4.4, d: 5.2 }], floor: 'wood', desc: 'Suíte de canto, com janelas para o jardim e para a piscina.' },
    { id: 's4b', name: 'Banheiro suíte 4', short: 'Bwc 4', rects: [{ x: 27.8, z: 0, w: 2.2, d: 5.2 }], floor: 'tileLight', desc: 'Banheiro da suíte 4, com box e janela alta.' },
    { id: 'gal', name: 'Galeria', short: 'Galeria', rects: [{ x: 0, z: 5.2, w: 30, d: 1.5 }], floor: 'woodDark', desc: 'Corredor que liga as suítes à área social e de serviço.' },
    // Faixa central
    { id: 'tv', name: 'Estar íntimo', short: 'Estar íntimo', rects: [{ x: 0, z: 6.7, w: 8.4, d: 5.2 }], floor: 'wood', desc: 'Sala de TV reservada para a família.' },
    { id: 'lav', name: 'Lavanderia', short: 'Lavand.', rects: [{ x: 8.4, z: 6.7, w: 3.8, d: 5.2 }], floor: 'tileLight', desc: 'Lavanderia com tanque e bancada.' },
    { id: 'desp', name: 'Despensa e depósito', short: 'Despensa', rects: [{ x: 12.2, z: 6.7, w: 3.8, d: 5.2 }], floor: 'tile', desc: 'Despensa ao lado da cozinha, com prateleiras e depósito.' },
    { id: 'cor', name: 'Circulação', short: 'Circ.', rects: [{ x: 16, z: 6.7, w: 1.3, d: 5.2 }], floor: 'woodDark', desc: 'Passagem que liga o hall à galeria.' },
    { id: 'coz', name: 'Cozinha planejada', short: 'Cozinha', rects: [{ x: 17.3, z: 6.7, w: 6.7, d: 5.2 }], floor: 'tile', desc: 'Cozinha planejada com ilha central, integrada ao living.' },
    { id: 'esc', name: 'Escritório', short: 'Escritório', rects: [{ x: 24, z: 6.7, w: 6, d: 5.2 }], floor: 'wood', desc: 'Home office com janela para o jardim.' },
    // Frente (rua)
    { id: 'garagem', name: 'Garagem (4 vagas)', short: 'Garagem', rects: [{ x: 0, z: 11.9, w: 11.4, d: 6.8 }], floor: 'concrete', tone: 'stone', desc: 'Garagem coberta para 4 carros.' },
    { id: 'lavabo', name: 'Lavabo', short: 'Lavabo', rects: [{ x: 11.4, z: 11.9, w: 2.4, d: 2.6 }], floor: 'tileLight', desc: 'Lavabo social para visitas.' },
    {
      id: 'hall',
      name: 'Hall de entrada',
      short: 'Hall',
      rects: [
        { x: 11.4, z: 14.5, w: 5.9, d: 4.2 },
        { x: 13.8, z: 11.9, w: 3.5, d: 2.6 },
      ],
      floor: 'stone',
      tone: 'timber',
      desc: 'Entrada social com pé-direito generoso.',
    },
    { id: 'living', name: 'Living (3 ambientes)', short: 'Living', rects: [{ x: 17.3, z: 11.9, w: 12.7, d: 6.8 }], floor: 'wood', desc: 'Estar, jantar e TV integrados, com grande vão de vidro para o jardim.' },
    { id: 'gourmet', name: 'Área gourmet', short: 'Gourmet', rects: [{ x: 30, z: 11.9, w: 8, d: 6.8 }], floor: 'stone', open: ['n', 'e', 's'], covered: true, desc: 'Área gourmet coberta com churrasqueira, aberta para a piscina e o jardim.' },
  ],
  doors: [
    // suítes
    { a: 'mb', b: 'gal', kind: 'door', frac: 0.82, into: 'mb' },
    { a: 'mb', b: 'mc', kind: 'door', frac: 0.5, into: 'mc' },
    { a: 'mc', b: 'mba', kind: 'door', frac: 0.5, into: 'mba' },
    { a: 's2', b: 'gal', kind: 'door', frac: 0.2, into: 's2' },
    { a: 's2', b: 's2b', kind: 'door', frac: 0.74, into: 's2b' },
    { a: 's3', b: 'gal', kind: 'door', frac: 0.2, into: 's3' },
    { a: 's3', b: 's3b', kind: 'door', frac: 0.74, into: 's3b' },
    { a: 's4', b: 'gal', kind: 'door', frac: 0.2, into: 's4' },
    { a: 's4', b: 's4b', kind: 'door', frac: 0.74, into: 's4b' },
    // galeria e serviço
    { a: 'gal', b: 'tv', kind: 'door', frac: 0.86, into: 'tv' },
    { a: 'gal', b: 'lav', kind: 'door', frac: 0.5, into: 'lav' },
    { a: 'lav', b: 'desp', kind: 'door', frac: 0.35, into: 'desp' },
    { a: 'desp', b: 'cor', kind: 'door', frac: 0.5, into: 'desp' },
    { a: 'gal', b: 'cor', kind: 'void', w: 1.0 },
    { a: 'gal', b: 'coz', kind: 'door', frac: 0.82, into: 'coz' },
    { a: 'gal', b: 'esc', kind: 'door', frac: 0.2, into: 'esc' },
    { a: 'cor', b: 'coz', kind: 'void', w: 1.4, frac: 0.35 },
    { a: 'cor', b: 'hall', kind: 'void', w: 1.0 },
    // social
    { a: 'hall', b: 'lavabo', kind: 'door', frac: 0.5, into: 'lavabo' },
    { a: 'hall', b: 'garagem', kind: 'door', frac: 0.5, into: 'hall' },
    { a: 'hall', b: 'living', kind: 'void', w: 2.2, frac: 0.7 },
    { a: 'living', b: 'coz', kind: 'void', w: 3.4 },
    { a: 'living', b: 'esc', kind: 'door', frac: 0.5, into: 'esc' },
    { a: 'living', b: 'gourmet', kind: 'slide', w: 3.4 },
    // externas
    { a: 'hall', side: 's', kind: 'door', w: 1.5, frac: 0.5, into: 'hall' },
    { a: 'garagem', side: 's', kind: 'garage', wFrac: 0.92 },
    { a: 'living', side: 's', kind: 'slide', w: 5.4, frac: 0.5 },
  ],
  windows: [
    { room: 'mb', side: 'n', frac: 0.78, w: 1.8 },
    { room: 'mb', side: 'w', frac: 0.5, w: 1.2 },
    { room: 'mba', side: 'n', frac: 0.5, w: 0.8, sill: 1.5, top: 2.2 },
    { room: 's2', side: 'n', frac: 0.5, w: 1.6 },
    { room: 's2b', side: 'n', frac: 0.5, w: 0.7, sill: 1.5, top: 2.2 },
    { room: 's3', side: 'n', frac: 0.5, w: 1.6 },
    { room: 's3b', side: 'n', frac: 0.5, w: 0.7, sill: 1.5, top: 2.2 },
    { room: 's4', side: 'n', frac: 0.5, w: 1.6 },
    { room: 's4b', side: 'n', frac: 0.5, w: 0.7, sill: 1.5, top: 2.2 },
    { room: 's4b', side: 'e', frac: 0.5, w: 0.7, sill: 1.5, top: 2.2 },
    { room: 'gal', side: 'w', frac: 0.5, w: 0.7 },
    { room: 'gal', side: 'e', frac: 0.5, w: 0.7 },
    { room: 'tv', side: 'w', frac: 0.5, w: 1.6 },
    { room: 'esc', side: 'e', frac: 0.5, w: 1.6 },
    { room: 'living', side: 's', frac: 0.12, w: 1.0 },
  ],
  furniture: [
    // suíte master
    { room: 'mb', type: 'bed', fx: 0.46, fz: 0.34, opts: { len: 1.9 } },
    { room: 'mb', type: 'night', fx: 0.2, fz: 0.17 },
    { room: 'mb', type: 'night', fx: 0.72, fz: 0.17 },
    { room: 'mb', type: 'armchair', fx: 0.88, fz: 0.62, rot: -45 },
    { room: 'mb', type: 'tvunit', fx: 0.5, fz: 0.88, rot: 180, opts: {} },
    { room: 'mc', type: 'wardrobe', fx: 0.1, fz: 0.18, rot: 90, opts: { len: 1.5 } },
    { room: 'mc', type: 'wardrobe', fx: 0.1, fz: 0.82, rot: 90, opts: { len: 1.5 } },
    { room: 'mc', type: 'wardrobe', fx: 0.9, fz: 0.18, rot: -90, opts: { len: 1.5 } },
    { room: 'mc', type: 'wardrobe', fx: 0.9, fz: 0.82, rot: -90, opts: { len: 1.5 } },
    { room: 'mba', type: 'shower', fx: 0.74, fz: 0.18 },
    { room: 'mba', type: 'vanity', fx: 0.14, fz: 0.45, rot: 90, opts: { len: 1.4 } },
    { room: 'mba', type: 'toilet', fx: 0.74, fz: 0.9, rot: 180 },
    // suítes 2, 3 e 4
    ...(['s2', 's3', 's4'] as const).flatMap((s) => [
      { room: s, type: 'bed' as const, fx: 0.5, fz: 0.34, opts: { len: 1.6 } },
      { room: s, type: 'night' as const, fx: 0.15, fz: 0.17 },
      { room: s, type: 'night' as const, fx: 0.85, fz: 0.17 },
      { room: s, type: 'wardrobe' as const, fx: 0.5, fz: 0.9, rot: 180, opts: { len: 2.0 } },
    ]),
    ...(['s2b', 's3b', 's4b'] as const).flatMap((s) => [
      { room: s, type: 'shower' as const, fx: 0.5, fz: 0.14 },
      { room: s, type: 'vanity' as const, fx: 0.16, fz: 0.4, rot: 90, opts: { len: 1.0 } },
      { room: s, type: 'toilet' as const, fx: 0.62, fz: 0.9, rot: 180 },
    ]),
    // estar íntimo
    { room: 'tv', type: 'rug', fx: 0.52, fz: 0.5, rot: 90, opts: { len: 3.0 } },
    { room: 'tv', type: 'sofa', fx: 0.3, fz: 0.5, rot: 90 },
    { room: 'tv', type: 'coffee', fx: 0.55, fz: 0.5, rot: 90 },
    { room: 'tv', type: 'tvunit', fx: 0.94, fz: 0.5, rot: -90 },
    // serviço
    { room: 'lav', type: 'washer', fx: 0.34, fz: 0.9, rot: 180 },
    { room: 'lav', type: 'run', fx: 0.74, fz: 0.9, rot: 180, opts: { len: 1.3, color: '#dfe6e8' } },
    { room: 'desp', type: 'shelf', fx: 0.5, fz: 0.92, rot: 180, opts: { len: 2.6 } },
    { room: 'desp', type: 'shelf', fx: 0.08, fz: 0.5, rot: 90, opts: { len: 2.0 } },
    // cozinha
    { room: 'coz', type: 'fridge', fx: 0.1, fz: 0.1 },
    { room: 'coz', type: 'run', fx: 0.46, fz: 0.07, opts: { len: 2.6 } },
    { room: 'coz', type: 'island', fx: 0.55, fz: 0.5, opts: { len: 2.4 } },
    // escritório
    { room: 'esc', type: 'desk', fx: 0.4, fz: 0.2 },
    { room: 'esc', type: 'shelf', fx: 0.94, fz: 0.5, rot: -90, opts: { len: 2.4 } },
    { room: 'esc', type: 'plant', fx: 0.9, fz: 0.9 },
    // garagem: 4 vagas
    { room: 'garagem', type: 'car', fx: 0.13, fz: 0.46, opts: { color: '#2c3e57' } },
    { room: 'garagem', type: 'car', fx: 0.38, fz: 0.46, opts: { color: '#b8bcc2' } },
    { room: 'garagem', type: 'car', fx: 0.63, fz: 0.46, opts: { color: '#7a1f2b' } },
    { room: 'garagem', type: 'car', fx: 0.88, fz: 0.46, opts: { color: '#23272d' } },
    // lavabo e hall
    { room: 'lavabo', type: 'toilet', fx: 0.78, fz: 0.2, rot: 0 },
    { room: 'lavabo', type: 'vanity', fx: 0.3, fz: 0.82, rot: 180, opts: { len: 0.9 } },
    { room: 'hall', type: 'bench', fx: 0.2, fz: 0.92, rot: 180, opts: { len: 1.6 } },
    { room: 'hall', type: 'plant', fx: 0.9, fz: 0.86 },
    // living
    { room: 'living', type: 'rug', fx: 0.66, fz: 0.5, opts: { len: 4.2 } },
    { room: 'living', type: 'sofa', fx: 0.66, fz: 0.62, rot: 180 },
    { room: 'living', type: 'coffee', fx: 0.66, fz: 0.4 },
    { room: 'living', type: 'armchair', fx: 0.46, fz: 0.34, rot: 90 },
    { room: 'living', type: 'armchair', fx: 0.86, fz: 0.34, rot: -90 },
    { room: 'living', type: 'tvunit', fx: 0.8, fz: 0.07, rot: 0 },
    { room: 'living', type: 'dining', fx: 0.24, fz: 0.5 },
    { room: 'living', type: 'plant', fx: 0.94, fz: 0.9 },
    { room: 'living', type: 'plant', fx: 0.06, fz: 0.9 },
    // área gourmet
    { room: 'gourmet', type: 'bbq', fx: 0.2, fz: 0.07, rot: 0 },
    { room: 'gourmet', type: 'outTable', fx: 0.5, fz: 0.52 },
    { room: 'gourmet', type: 'sofaOut', fx: 0.82, fz: 0.2, rot: 0 },
    { room: 'gourmet', type: 'plant', fx: 0.9, fz: 0.9 },
  ],
}
