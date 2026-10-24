import { NextResponse } from 'next/server'

const conversations = [
  {
    id: 'conv1',
    title: 'At the Convenience Store',
    level: 'N5',
    category: 'shopping',
    scenario: 'You are buying items at a Japanese convenience store.',
    messages: [
      { role: 'staff', japanese: 'いらっしゃいませ！', english: 'Welcome!' },
      { role: 'customer', japanese: 'これをお願いします。', english: 'This one, please.' },
      { role: 'staff', japanese: 'かしこまりました。袋はいりますか？', english: 'Certainly. Do you need a bag?' },
      { role: 'customer', japanese: '大丈夫です。', english: "No, I'm fine." },
      { role: 'staff', japanese: '三百五十円です。', english: 'That will be 350 yen.' },
      { role: 'customer', japanese: 'はい、どうぞ。', english: 'Here you go.' },
      { role: 'staff', japanese: 'ありがとうございます！', english: 'Thank you very much!' },
    ],
  },
  {
    id: 'conv2',
    title: 'Ordering at a Restaurant',
    level: 'N5',
    category: 'dining',
    scenario: 'You are ordering food at a Japanese restaurant.',
    messages: [
      { role: 'staff', japanese: 'いらっしゃいませ。何名様ですか？', english: 'Welcome. How many in your party?' },
      { role: 'customer', japanese: '一人です。', english: 'Just one.' },
      { role: 'staff', japanese: 'こちらの席へどうぞ。メニューをどうぞ。', english: 'This way please. Here is the menu.' },
      { role: 'customer', japanese: 'ラーメンと餃子をお願いします。', english: 'Ramen and gyoza, please.' },
      { role: 'staff', japanese: 'かしこまりました。少々お待ちください。', english: 'Certainly. Please wait a moment.' },
      { role: 'customer', japanese: 'すみません、お水をください。', english: 'Excuse me, water please.' },
      { role: 'staff', japanese: 'はい、どうぞ。', english: 'Here you are.' },
    ],
  },
  {
    id: 'conv3',
    title: 'Asking for Directions',
    level: 'N4',
    category: 'directions',
    scenario: 'You are lost and asking for directions to the train station.',
    messages: [
      { role: 'customer', japanese: 'すみません、駅はどこですか？', english: 'Excuse me, where is the station?' },
      { role: 'staff', japanese: 'この道をまっすぐ行ってください。', english: 'Please go straight down this road.' },
      { role: 'customer', japanese: '距離はどのくらいですか？', english: 'How far is it?' },
      { role: 'staff', japanese: '歩いて十分くらいです。', english: 'About 10 minutes on foot.' },
      { role: 'customer', japanese: 'ありがとうございます！', english: 'Thank you very much!' },
      { role: 'staff', japanese: 'どういたしまして。', english: 'You are welcome.' },
    ],
  },
  {
    id: 'conv4',
    title: 'At the Doctor',
    level: 'N4',
    category: 'medical',
    scenario: 'You are visiting a Japanese doctor because you feel sick.',
    messages: [
      { role: 'staff', japanese: 'どうされましたか？', english: 'What seems to be the problem?' },
      { role: 'customer', japanese: '頭が痛いです。', english: 'I have a headache.' },
      { role: 'staff', japanese: '熱はありますか？', english: 'Do you have a fever?' },
      { role: 'customer', japanese: 'はい、少し熱があります。', english: 'Yes, I have a slight fever.' },
      { role: 'staff', japanese: '風邪ですね。お薬を出します。', english: "It's a cold. I'll prescribe some medicine." },
      { role: 'customer', japanese: 'ありがとうございます。', english: 'Thank you.' },
    ],
  },
]

export async function GET() {
  return NextResponse.json({ conversations })
}
