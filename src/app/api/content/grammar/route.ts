import { NextResponse } from 'next/server'

const grammar = [
  {
    id: 'g1',
    pattern: 'wa wa desu',
    meaning: 'A is B (copula)',
    level: 'N5',
    explanation: 'Basic sentence structure using the topic marker wa and copula desu.',
    examples: ['Watashi wa gakusei desu.', 'Kore wa hon desu.'],
  },
  {
    id: 'g2',
    pattern: 'wo ... masu',
    meaning: 'Object marker + verb',
    level: 'N5',
    explanation: 'The wo particle marks the direct object of a verb.',
    examples: ['Gohan wo tabemasu.', 'Mizu wo nomimasu.'],
  },
  {
    id: 'g3',
    pattern: 'ni ... masu',
    meaning: 'Direction/time marker',
    level: 'N5',
    explanation: 'The ni particle indicates direction, time, or target of an action.',
    examples: ['Gakkou ni ikimasu.', 'Shichi-ji ni okimasu.'],
  },
  {
    id: 'g4',
    pattern: 'de ... masu',
    meaning: 'Place/tool marker',
    level: 'N5',
    explanation: 'The de particle indicates the place of action or means/tool used.',
    examples: ['Toshokan de benkyou shimasu.', 'Hashi de tabemasu.'],
  },
  {
    id: 'g5',
    pattern: 'te-form + imasu',
    meaning: 'Progressive action',
    level: 'N5',
    explanation: 'The te-form combined with imasu indicates an ongoing action.',
    examples: ['Tabe-te imasu.', 'Yo-n-de imasu.'],
  },
  {
    id: 'g6',
    pattern: 'nakereba narimasen',
    meaning: 'Must do something',
    level: 'N4',
    explanation: 'Expresses obligation or necessity.',
    examples: ['Benkyou shinakereba narimasen.', 'Soba ni ikanakereba narimasen.'],
  },
  {
    id: 'g7',
    pattern: 'tai desu',
    meaning: 'Want to do',
    level: 'N5',
    explanation: 'Expresses desire to do something.',
    examples: ['Nihon ni ikitai desu.', 'Sushi wo tabetai desu.'],
  },
  {
    id: 'g8',
    pattern: 'nagara',
    meaning: 'While doing',
    level: 'N4',
    explanation: 'Indicates doing two actions simultaneously.',
    examples: ['Ongaku wo kikinagara benkyou shimasu.', 'Arukinagara hanashimasu.'],
  },
]

export async function GET() {
  return NextResponse.json({ grammar })
}
