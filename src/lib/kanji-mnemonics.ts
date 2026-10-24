export interface Mnemonic {
  kanji: string
  mnemonic: string
  radicalBreakdown: string
  visualTip: string
}

export const mnemonics: Record<string, Mnemonic> = {
  '山': { kanji: '山', mnemonic: 'Três picos de montanha — desenhe uma montanha com 3 vértices', radicalBreakdown: 'Montanha (山)', visualTip: '🏔️ Parece 3 cumes de montanha' },
  '川': { kanji: '川', mnemonic: 'Três correntes de água fluindo — rios correndo', radicalBreakdown: 'Rio (川)', visualTip: '🌊 Três linhas = três correntes' },
  '木': { kanji: '木', mnemonic: 'Uma árvore com raízes e galhos — copa + tronco', radicalBreakdown: 'Árvore (木)', visualTip: '🌳 Parece uma árvore vista de frente' },
  '林': { kanji: '林', mnemonic: 'Duas árvores lado a lado = floresta pequena', radicalBreakdown: 'Árvore + Árvore', visualTip: '🌲🌲 Duas árvores = bosque' },
  '森': { kanji: '森', mnemonic: 'Três árvores = floresta densa', radicalBreakdown: 'Árvore × 3', visualTip: '🌲🌲🌲 Três árvores = floresta' },
  '水': { kanji: '水', mnemonic: 'Gotas de água pingando — imagine a água escorrendo', radicalBreakdown: 'Água (水)', visualTip: '💧 Parece gotas de água' },
  '火': { kanji: '火', mnemonic: 'Duas pessoas aquecendo as mãos no fogo', radicalBreakdown: 'Fogo (火)', visualTip: '🔥 Parece chamas subindo' },
  '土': { kanji: '土', mnemonic: 'Um pé pisando na terra — ou uma planta brotando', radicalBreakdown: 'Terra (土)', visualTip: '🌍 TERRA = solo, chão' },
  '金': { kanji: '金', mnemonic: 'Ouro brilhando — minério de metal no chão', radicalBreakdown: 'Ouro/Metal (金)', visualTip: '✨ Parece barras de ouro' },
  '人': { kanji: '人', mnemonic: 'Duas pernas caminhando — uma pessoa andando', radicalBreakdown: 'Pessoa (人)', visualTip: '🚶 Parece uma pessoa de perfil' },
  '大': { kanji: '大', mnemonic: 'Pessoa com braços abertos = grande', radicalBreakdown: 'Grande (大)', visualTip: '🤲 Pessoa abrindo braços = GRANDE' },
  '小': { kanji: '小', mnemonic: 'Punho fechado = pequeno', radicalBreakdown: 'Pequeno (小)', visualTip: '🤏 Punho = pequeno' },
  '中': { kanji: '中', mnemonic: 'Uma linha no centro = meio', radicalBreakdown: 'Meio (中)', visualTip: '📍 Linha no centro = MEIO' },
  '日': { kanji: '日', mnemonic: 'O sol por trás de uma janela = dia', radicalBreakdown: 'Sol/Dia (日)', visualTip: '☀️ Janela com sol = DIA' },
  '月': { kanji: '月', mnemonic: 'A lua brilhando — forma de lua crescente', radicalBreakdown: 'Lua/Mês (月)', visualTip: '🌙 Parece uma lua' },
  '口': { kanji: '口', mnemonic: 'Uma boca aberta — boca = boca', radicalBreakdown: 'Boca (口)', visualTip: '👄 Boca aberta = quadro' },
  '目': { kanji: '目', mnemonic: 'Um olho de lado — olho com pálpebra', radicalBreakdown: 'Olho (目)', visualTip: '👁️ Parece um olho' },
  '耳': { kanji: '耳', mnemonic: 'Uma orelha com seu formato curvo', radicalBreakdown: 'Orelha (耳)', visualTip: '👂 Orelha = curva' },
  '手': { kanji: '手', mnemonic: 'Mão aberta com dedos — palma vista de frente', radicalBreakdown: 'Mão (手)', visualTip: '✋ Mão aberta = 4 linhas' },
  '力': { kanji: '力', mnemonic: 'Braco flexionado = força/poder', radicalBreakdown: 'Força (力)', visualTip: '💪 Braço = FORÇA' },
  '刀': { kanji: '刀', mnemonic: 'Uma lâmina de faca — machado curvo', radicalBreakdown: 'Faca (刀)', visualTip: '🔪 Faca = curva com fio' },
  '弓': { kanji: '弓', mnemonic: 'Arco de flecha — curva tensa', radicalBreakdown: 'Arco (弓)', visualTip: '🏹 Arco = corda + bastão' },
  '雨': { kanji: '雨', mnemonic: 'Gotas caindo do céu — nuvens com chuva', radicalBreakdown: 'Chuva (雨)', visualTip: '🌧️ Nuvem com gotas caindo' },
  '田': { kanji: '田', mnemonic: 'Campos de arroz — plantação dividida', radicalBreakdown: 'Campo (田)', visualTip: '🌾 Campo = quadro dividido' },
  '石': { kanji: '石', mnemonic: 'Pedra no chão — rocha dura', radicalBreakdown: 'Pedra (石)', visualTip: '🪨 Pedra = rocha' },
  '花': { kanji: '花', mnemonic: 'Flor brotando da planta', radicalBreakdown: 'Flor (花)', visualTip: '🌸 Flor = planta + broto' },
  '鳥': { kanji: '鳥', mnemonic: 'Pássaro com asas e cauda — pássaro voando', radicalBreakdown: 'Pássaro (鳥)', visualTip: '🐦 Parece um passarinho' },
  '魚': { kanji: '魚', mnemonic: 'Peixe com escamas e rabo — peixe nadando', radicalBreakdown: 'Peixe (魚)', visualTip: '🐟 Peixe com escamas' },
  '馬': { kanji: '馬', mnemonic: 'Cavalo com juba — quatro patas', radicalBreakdown: 'Cavalo (馬)', visualTip: '🐎 Cavalo correndo' },
  '犬': { kanji: '犬', mnemonic: 'Cachorro com orelha e rabo — cachorro late', radicalBreakdown: 'Cachorro (犬)', visualTip: '🐕 Cachorro = pessoa + rabo' },
  '猫': { kanji: '猫', mnemonic: 'Gato com prefixo de animal (犭)', radicalBreakdown: 'Gato (猫)', visualTip: '🐱 Gato = animal + arroz' },
  '立': { kanji: '立', mnemonic: 'Pessoa de pé — personne se levantando', radicalBreakdown: 'Ficar de pé (立)', visualTip: '🧍 Pessoa de pé' },
  '走': { kanji: '走', mnemonic: 'Pessoa correndo — pernas em movimento', radicalBreakdown: 'Correr (走)', visualTip: '🏃 Pessoa correndo' },
  '見': { kanji: '見', mnemonic: 'Olho (目) + pernas (儿) = ver com os olhos', radicalBreakdown: 'Ver (見)', visualTip: '👀 Olho olhando' },
  '言': { kanji: '言', mnemonic: 'Boca falando — palavras saindo da boca', radicalBreakdown: 'Falar (言)', visualTip: '💬 Boca com linhas = fala' },
  '食': { kanji: '食', mnemonic: 'Boca comendo — pessoa sentada comendo', radicalBreakdown: 'Comer (食)', visualTip: '🍚 Pessoa comendo arroz' },
  '飲': { kanji: '飲', mnemonic: 'Pessoa bebendo — copo virado na boca', radicalBreakdown: 'Beber (飲)', visualTip: '🥤 Pessoa bebendo' },
  '行': { kanji: '行', mnemonic: 'Cruz = encruzilhada = ir/caminhar', radicalBreakdown: 'Ir (行)', visualTip: '🚶 Cruz = caminho' },
  '歩': { kanji: '歩', mnemonic: 'Pé + pouco = caminhar devagar', radicalBreakdown: 'Passo (歩)', visualTip: '👣 Passos = poucos passos' },
  '年': { kanji: '年', mnemonic: 'Colheita anual — 12 luas = 1 ano', radicalBreakdown: 'Ano (年)', visualTip: '📅 Ano = 12 meses' },
  '先': { kanji: '先', mnemonic: 'Primeiro = ir antes —âncora no chão', radicalBreakdown: 'Primeiro (先)', visualTip: '⚓ Primeiro lugar' },
  '学': { kanji: '学', mnemonic: 'Teto + criança = estudar na escola', radicalBreakdown: 'Estudar (学)', visualTip: '🏫 Escola = teto + estudante' },
  '先生': { kanji: '先生', mnemonic: 'Pessoa que veio antes = professor', radicalBreakdown: 'Professor (先生)', visualTip: '👨‍🏫 Pessoa que sabe mais' },
  '字': { kanji: '字', mnemonic: 'Teto + filho = caractere escrito', radicalBreakdown: 'Caractere (字)', visualTip: '✍️ Filho escrevendo sob teto' },
  '室': { kanji: '室', mnemonic: 'Teto + terra = sala/quarto', radicalBreakdown: 'Sala (室)', visualTip: '🏠 Teto sobre chão = sala' },
  '家': { kanji: '家', mnemonic: 'Teto + porco = lar (porco = riqueza)', radicalBreakdown: 'Casa (家)', visualTip: '🏡 Teto com porco = LAR' },
  '電': { kanji: '電', mnemonic: 'Chuva + relâmpago = eletricidade', radicalBreakdown: 'Eletricidade (電)', visualTip: '⚡ Chuva com raios = ELETRICIDADE' },
  '車': { kanji: '車', mnemonic: 'Duas rodas e um eixo — carruagem', radicalBreakdown: 'Carro (車)', visualTip: '🚗 Vista de cima do carro' },
  '道': { kanji: '道', mnemonic: 'Caminho (辶) + cabeça (首) = estrada', radicalBreakdown: 'Caminho (道)', visualTip: '🛤️ Caminho = passos + cabeça' },
  '門': { kanji: '門', mnemonic: 'Duas portas — portão aberto', radicalBreakdown: 'Portão (門)', visualTip: '🚪 Portão = duas portas' },
  '間': { kanji: '間', mnemonic: 'Portão (門) + sol (日) = espaço entre', radicalBreakdown: 'Espaço (間)', visualTip: '🔲 Sol entre portas = ESPAÇO' },
  '話': { kanji: '話', mnemonic: 'Palavras (言) + língua (舌) = conversa', radicalBreakdown: 'Conversa (話)', visualTip: '🗣️ Palavras com língua' },
  '買': { kanji: '買', mnemonic: 'Rede (罒) + concha (貝) = comprar', radicalBreakdown: 'Comprar (買)', visualTip: '🛒 Rede + dinheiro = COMPRAR' },
  '売': { kanji: '売', mnemonic: 'Cruz + concha = vender', radicalBreakdown: 'Vender (売)', visualTip: '💰 Cruz + dinheiro = VENDER' },
  '午': { kanji: '午', mnemonic: 'Cavalo descansando = meio-dia', radicalBreakdown: 'Meio-dia (午)', visualTip: '☀️ Sol no topo = MEIO-DIA' },
  '牛': { kanji: '牛', mnemonic: 'Corno de vaca — boi', radicalBreakdown: 'Vaca (牛)', visualTip: '🐂 Corno = vaca' },
  '羊': { kanji: '羊', mnemonic: 'Chifres de cordeiro — ovelha', radicalBreakdown: 'Ovelha (羊)', visualTip: '🐑 Chifres curvos = ovelha' },
  '天': { kanji: '天', mnemonic: 'Grande (大) no céu = céu', radicalBreakdown: 'Céu (天)', visualTip: '☁️ Grande + linha = CÉU' },
  '気': { kanji: '気', mnemonic: 'Ar subindo = energia/espírito', radicalBreakdown: 'Energia (気)', visualTip: '💨 Ar subindo = ENERGIA' },
  '白': { kanji: '白', mnemonic: 'Sol (日) branco = branco', radicalBreakdown: 'Branco (白)', visualTip: '⚪ Sol = BRANCO' },
  '黒': { kanji: '黒', mnemonic: 'Terra (土) + ponto = preto', radicalBreakdown: 'Preto (黒)', visualTip: '⚫ Terra escura = PRETO' },
  '赤': { kanji: '赤', mnemonic: 'Grande (大) + terra = vermelho', radicalBreakdown: 'Vermelho (赤)', visualTip: '🔴 Terra grande = VERMELHO' },
  '青': { kanji: '青', mnemonic: 'Crescimento + terra = azul/verde', radicalBreakdown: 'Azul (青)', visualTip: '🔵 Planta na terra = AZUL' },
  '左': { kanji: '左', mnemonic: 'Mão esquerda segurando ferramenta', radicalBreakdown: 'Esquerda (左)', visualTip: '👈 Mão esquerda = ESQUERDA' },
  '右': { kanji: '右', mnemonic: 'Mão direita segurando boca = comer', radicalBreakdown: 'Direita (右)', visualTip: '👉 Mão direita = DIREITA' },
  '北': { kanji: '北', mnemonic: 'Duas costas de costas = norte', radicalBreakdown: 'Norte (北)', visualTip: '🧭 Costas = NORTE' },
  '南': { kanji: '南', mnemonic: 'Cruz + peixe = sul', radicalBreakdown: 'Sul (南)', visualTip: '🧭 Peixe na cruz = SUL' },
}

export function getMnemonic(kanji: string): Mnemonic | null {
  return mnemonics[kanji] || null
}

export function getRandomMnemonics(count: number): Mnemonic[] {
  const keys = Object.keys(mnemonics)
  const shuffled = [...keys].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((k) => mnemonics[k])
}
