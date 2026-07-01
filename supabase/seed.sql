-- ============================================================
-- SOLDI - Seed data (módulos, simulações, missões, conquistas)
-- Execute AFTER 001_initial.sql
-- ============================================================

-- ============================================================
-- MODULES
-- ============================================================
insert into public.modules (slug, title, description, role, order_index, is_locked, icon, total_lessons, color) values
('sdr-fundamentos',    'Fundamentos do SDR',         'Entenda o papel do SDR, métricas essenciais e como funciona o processo de prospecção.',   'SDR', 1, false, 'Target',     3, '#7DC832'),
('sdr-abordagem',      'Abordagem e Prospecção',      'Aprenda como estruturar sua abordagem e gerar interesse genuíno nos leads.',               'SDR', 2, false, 'Phone',      3, '#7DC832'),
('sdr-qualificacao',   'Qualificação de Leads',       'Domine frameworks como BANT e SPIN para qualificar leads com mais eficiência.',           'SDR', 3, false, 'CheckSquare',3, '#7DC832'),
('sdr-objecoes',       'Contorno de Objeções',        'Técnicas práticas para lidar com as principais objeções sem perder o lead.',              'SDR', 4, true,  'Shield',     3, '#7DC832'),
('sdr-followup',       'Follow-up Estratégico',       'Como criar sequências de follow-up que funcionam sem parecer chato.',                     'SDR', 5, true,  'RefreshCw',  3, '#7DC832'),
('sdr-agendamento',    'Agendamento de Reuniões',     'Estratégias e scripts para converter leads em reuniões qualificadas.',                    'SDR', 6, true,  'Calendar',   3, '#7DC832'),
('sdr-passagem',       'Passagem para o Closer',      'Como fazer uma passagem de bastão útil e eficiente que aumenta a taxa de fechamento.',    'SDR', 7, true,  'ArrowRight', 3, '#7DC832'),
-- Módulos futuros (locked, outras roles)
('closer-negociacao',  'Negociação Avançada',         'Técnicas de negociação e fechamento para closers.',                                       'CLOSER',   1, true, 'TrendingUp', 0, '#6366F1'),
('gestor-metricas',    'Gestão de Métricas',          'Como gestores comerciais analisam e melhoram performance do time.',                        'GESTOR',   1, true, 'BarChart2',  0, '#8B5CF6'),
('playbook-comercial', 'Playbook Comercial',          'Crie e documente o playbook de vendas da sua operação.',                                  'PLAYBOOK', 1, true, 'BookOpen',   0, '#EC4899'),
('calls-analise',      'Análise de Calls',            'Analise suas calls e receba feedback automático sobre pontos de melhoria.',               'CALLS',    1, true, 'Mic',        0, '#F59E0B'),
('crm-performance',    'CRM e Performance',           'Acompanhe métricas de pipeline, taxa de conversão e forecast.',                           'CRM',      1, true, 'Database',   0, '#06B6D4')
on conflict (slug) do nothing;

-- ============================================================
-- LESSONS (módulos 1-3 com conteúdo real)
-- ============================================================

-- Fundamentos do SDR
with mod as (select id from public.modules where slug = 'sdr-fundamentos')
insert into public.lessons (module_id, title, content, lesson_type, order_index, xp_reward)
select mod.id, title, content, lesson_type, order_index, xp_reward from mod, (values
  ('O papel do SDR na operação de vendas',
   '## O que é um SDR?\n\nO **Sales Development Representative (SDR)** é o profissional responsável pela parte inicial do funil: prospectar leads, qualificá-los e agendar reuniões para os closers.\n\n### Por que o SDR é crucial?\n- Libera os closers para focar em fechamento\n- Garante que apenas leads qualificados entram no pipeline\n- Permite maior volume de abordagens\n\n### Métricas-chave do SDR\n- **Conexões por dia**: quantos leads você contactou\n- **Taxa de resposta**: % de leads que responderam\n- **Taxa de qualificação**: % de leads que passaram para o próximo passo\n- **Reuniões agendadas por semana**: seu principal entregável\n\n### A mentalidade correta\nO SDR não é um vendedor — é um *qualificador*. Seu trabalho é encontrar os leads certos para a conversa certa na hora certa.',
   'theory', 1, 30),
  ('Atividade: Mapeando seu ICP',
   '## Exercício Prático: Definindo seu Perfil Ideal\n\nAgora que você entende o papel do SDR, a coisa mais importante antes de ligar para alguém é saber **com quem** você quer falar. Isso é o seu ICP (Ideal Customer Profile).\n\n### Passo a passo da atividade\n\nAbra um bloco de notas ou documento e responda a estas 3 perguntas sobre o produto que você vende:\n\n1. **Qual é o cargo da pessoa que decide a compra?** (ex: Diretor de RH, Gerente de Vendas, CEO)\n2. **Qual é o segmento e tamanho ideal da empresa?** (ex: Startups B2B de 50 a 200 funcionários)\n3. **Qual é a dor latente que você resolve?** (ex: Eles perdem muito tempo fazendo relatórios manuais)\n\n### O que fazer com isso?\n\n- Mantenha esse perfil na sua tela durante as simulações e prospecções reais.\n- **Sempre** que for abordar um lead, verifique mentalmente se ele se encaixa nessas 3 respostas.\n- Se não se encaixar, você está perdendo tempo. O foco do SDR é trazer o **lead certo**.',
   'theory', 2, 50),
  ('Simulação: Primeira abordagem com lead frio',
   'Pratique sua primeira abordagem com um lead que nunca ouviu falar da empresa.',
   'simulation', 3, 100)
) as data(title, content, lesson_type, order_index, xp_reward)
on conflict do nothing;

-- Abordagem e Prospecção
with mod as (select id from public.modules where slug = 'sdr-abordagem')
insert into public.lessons (module_id, title, content, lesson_type, order_index, xp_reward)
select mod.id, title, content, lesson_type, order_index, xp_reward from mod, (values
  ('Estrutura de uma boa abordagem',
   '## Como estruturar sua abordagem\n\nUma abordagem eficaz segue uma estrutura clara:\n\n### 1. Abertura (5 segundos)\nCapture a atenção imediatamente. Evite começar com "Meu nome é X da empresa Y".\n\n**Ruim:** "Olá, meu nome é João, da Empresa ABC, tudo bem?"\n\n**Bom:** "Oi [Nome], vi que vocês estão expandindo o time de vendas — tenho algo que pode ajudar nessa transição."\n\n### 2. Proposta de valor (15 segundos)\nDiga o que você faz, para quem e qual resultado gera. Use dados reais.\n\n**Exemplo:** "Ajudamos empresas de SaaS como a [Concorrente deles] a aumentar 40% nas reuniões agendadas em 60 dias."\n\n### 3. Pergunta de qualificação\nTermine com uma pergunta aberta que engaje o lead e revele contexto.\n\n**Exemplo:** "Como vocês estão gerando reuniões hoje?"',
   'theory', 1, 30),
  ('Cold call vs. Cold email vs. LinkedIn',
   '## Comparativo de Canais\n\n| Canal | Taxa de resposta média | Melhor para |\n|-------|----------------------|-------------|\n| Cold Call | 8-12% | Decisores C-level, urgência |\n| Cold Email | 3-7% | Alto volume, nurturing |\n| LinkedIn | 15-25% | Conexão, contexto profissional |\n| WhatsApp | 40-60% | Follow-up, leads quentes |\n\n### Quando usar cada canal?\n- **Cold Call**: quando precisar de resposta rápida\n- **Cold Email**: sequências automatizadas, escala\n- **LinkedIn**: pesquisa + primeiro contato em contexto\n- **WhatsApp**: após já ter tido algum contato prévio',
   'theory', 2, 30),
  ('Simulação: Cold call com gatekepper',
   'Pratique lidar com um assistente/recepcionista antes de chegar ao decisor.',
   'simulation', 3, 100)
) as data(title, content, lesson_type, order_index, xp_reward)
on conflict do nothing;

-- Qualificação de Leads
with mod as (select id from public.modules where slug = 'sdr-qualificacao')
insert into public.lessons (module_id, title, content, lesson_type, order_index, xp_reward)
select mod.id, title, content, lesson_type, order_index, xp_reward from mod, (values
  ('Framework BANT',
   '## BANT — O framework clássico de qualificação\n\n**B**udget — **A**uthority — **N**eed — **T**imeline\n\n### B - Budget (Orçamento)\nO lead tem capacidade financeira de comprar?\n- "Você tem orçamento previsto para isso em 2025?"\n- "Qual é o investimento médio que vocês fazem em ferramentas de vendas?"\n\n### A - Authority (Autoridade)\nEle é o tomador de decisão?\n- "Além de você, quem mais estaria envolvido nessa decisão?"\n- "Essa decisão passa por aprovação do board?"\n\n### N - Need (Necessidade)\nEle tem um problema real que você resolve?\n- "Qual é o maior desafio do time de vendas hoje?"\n- "O que acontece se esse problema não for resolvido?"\n\n### T - Timeline (Prazo)\nHá urgência? Quando ele quer resolver?\n- "Você quer resolver isso em quanto tempo?"\n- "Tem algum evento ou deadline que torna isso urgente?"',
   'theory', 1, 30),
  ('Framework SPIN Selling',
   '## SPIN Selling — Qualificação por perguntas\n\n**S**ituation — **P**roblem — **I**mplication — **N**eed-Payoff\n\n### S - Situation (Situação)\nEntenda o contexto atual.\n- "Como vocês fazem a prospecção hoje?"\n- "Quantos SDRs tem no time?"\n\n### P - Problem (Problema)\nRevele o problema.\n- "O que não está funcionando bem no processo atual?"\n- "Qual parte da prospecção consome mais tempo?"\n\n### I - Implication (Implicação)\nAmplíe as consequências do problema.\n- "Se isso continuar assim, como impacta as metas do trimestre?"\n- "O que acontece com a previsibilidade do pipeline?"\n\n### N - Need-Payoff (Necessidade de solução)\nFaça o lead vender a solução para si mesmo.\n- "Se vocês resolvessem isso, quanto a mais vocês conseguiriam converter?"\n- "Qual seria o impacto no seu time se isso fosse resolvido?"',
   'theory', 2, 30),
  ('Simulação: Qualificação BANT em ligação',
   'Conduza uma qualificação BANT completa com um lead que demonstrou interesse inicial.',
   'simulation', 3, 100)
) as data(title, content, lesson_type, order_index, xp_reward)
on conflict do nothing;

-- ============================================================
-- SIMULATIONS
-- ============================================================
insert into public.simulations (id, title, context, lead_name, lead_company, lead_role, channel, difficulty) values
(uuid_generate_v4(), 'Cold Call: CEO sem tempo', 'Você está ligando para o CEO de uma startup de 50 pessoas. Ele atende, mas está claramente apressado e céticos sobre calls de vendas.', 'Ricardo Mendes', 'TechFlow', 'CEO', 'cold_call', 'medium'),
(uuid_generate_v4(), 'LinkedIn: Interesse inicial', 'O VP de Vendas curtiu um post da sua empresa no LinkedIn. Você enviou uma mensagem e ele respondeu pedindo mais informações.', 'Camila Rocha', 'Nexus Corp', 'VP de Vendas', 'linkedin', 'easy'),
(uuid_generate_v4(), 'Cold Call: Gatekeeper difícil', 'A assistente do diretor comercial atende e questiona o motivo da ligação. Ela é treinada para filtrar chamadas de vendas.', 'Assistente da Marina', 'Grupo Andrade', 'Assistente Executiva', 'cold_call', 'hard'),
(uuid_generate_v4(), 'Follow-up: Lead sumiu', 'Após uma reunião que foi bem, o lead parou de responder há 2 semanas. Você vai tentar um último contato por WhatsApp.', 'Felipe Torres', 'StartupX', 'Head de Operações', 'whatsapp', 'medium'),
(uuid_generate_v4(), 'Cold Email: Resposta com objeção de preço', 'O lead respondeu seu cold email dizendo que achou interessante, mas que o preço parece alto para o tamanho deles.', 'Ana Lima', 'Pequena Empresa SA', 'Sócia-fundadora', 'email', 'medium')
on conflict do nothing;

-- ============================================================
-- SIMULATION TURNS
-- ============================================================

-- Get simulation IDs
do $$
declare
  sim1_id uuid;
  sim2_id uuid;
  sim3_id uuid;
  sim4_id uuid;
  sim5_id uuid;
begin
  select id into sim1_id from public.simulations where title = 'Cold Call: CEO sem tempo' limit 1;
  select id into sim2_id from public.simulations where title = 'LinkedIn: Interesse inicial' limit 1;
  select id into sim3_id from public.simulations where title = 'Cold Call: Gatekeeper difícil' limit 1;
  select id into sim4_id from public.simulations where title = 'Follow-up: Lead sumiu' limit 1;
  select id into sim5_id from public.simulations where title = 'Cold Email: Resposta com objeção de preço' limit 1;

  -- Simulação 1: Cold Call CEO
  insert into public.simulation_turns (simulation_id, turn_index, lead_message, options) values
  (sim1_id, 1, 'Alô? Quem fala? Tenho 3 minutos.', '[
    {"id":"a","text":"Ricardo, boa tarde! Meu nome é [Seu Nome] da Soldi. Como vai? Posso tomar um minuto do seu tempo?","score":20,"feedback":"Começar perguntando se pode tomar o tempo dele após ele já dizer que tem 3 minutos é um desperdício. Também, evite ''como vai'' em cold calls.","is_best":false},
    {"id":"b","text":"Ricardo, 3 minutos é suficiente. Ajudamos startups como a TechFlow a dobrar reuniões agendadas. Isso é relevante pra você agora?","score":90,"feedback":"Perfeito. Você respeitou o tempo limitado, foi direto, usou o nome da empresa dele e fez uma pergunta de qualificação rápida.","is_best":true},
    {"id":"c","text":"Oi Ricardo! Não vou tomar muito do seu tempo, só queria apresentar nossa plataforma de treinamento comercial que ajuda times de vendas.","score":40,"feedback":"Razoável, mas ''não vou tomar muito do seu tempo'' é uma frase desgastada. Faltou personalização e a proposta de valor foi genérica.","is_best":false},
    {"id":"d","text":"Boa tarde! Vi que a TechFlow está crescendo e quero entender melhor os desafios do time comercial de vocês para ver se faz sentido conversarmos.","score":65,"feedback":"Boa personalização, mas em 3 minutos você precisa ir mais direto ao ponto. Reserve perguntas exploratórias para uma conversa mais longa.","is_best":false}
  ]'),
  (sim1_id, 2, 'Ok, fala. O que vocês fazem exatamente?', '[
    {"id":"a","text":"Somos uma plataforma de treinamento para times de SDR. Oferecemos simulações, trilhas de aprendizado e gamificação.","score":50,"feedback":"Correto mas genérico. Você descreveu funcionalidades, não resultados. O que você resolve para ele especificamente?","is_best":false},
    {"id":"b","text":"Treinamos times de SDR com simulações de leads reais. Nossos clientes reduzem o tempo de ramp de novos SDRs de 90 para 30 dias. Isso é um problema pra vocês agora?","score":95,"feedback":"Excelente! Proposta de valor em resultado concreto (ramp time) + pergunta de qualificação imediata. Isso cria engajamento real.","is_best":true},
    {"id":"c","text":"Trabalhamos com treinamento comercial e temos uma metodologia proprietária que aumenta a performance de SDRs usando gamificação e IA.","score":45,"feedback":"Muito focado em você (''nossa metodologia'', ''gamificação e IA''). O lead quer saber o que ele ganha, não como você funciona.","is_best":false},
    {"id":"d","text":"Ajudamos empresas de tecnologia a escalar times de vendas mais rápido. Posso te mandar material por e-mail?","score":30,"feedback":"Mandar material por e-mail agora é enterrar a conversa. Você perdeu a oportunidade de qualificar e avançar para uma reunião.","is_best":false}
  ]'),
  (sim1_id, 3, 'Ramp time não é problema agora. Meu desafio é que os SDRs não sabem lidar com objeções e perdem leads bons.', '[
    {"id":"a","text":"Entendo. Nossa plataforma tem módulo específico de contorno de objeções com simulações de casos reais. Posso agendar 20 min para mostrar exatamente como funciona?","score":85,"feedback":"Muito bom. Você conectou a dor dele diretamente ao seu produto e fez um pedido de reunião com tempo definido. Funcionou.","is_best":true},
    {"id":"b","text":"Perfeito, esse é exatamente o nosso ponto forte! Temos 7 módulos e um deles é especificamente sobre objeções. Além disso, temos gamificação, ranking...","score":30,"feedback":"Você caiu no ''feature dump''. Ele te deu a dor dele e você respondeu com uma lista de features. Foque no problema dele.","is_best":false},
    {"id":"c","text":"Isso é muito comum. Objeção é uma das maiores dificuldades de SDRs. Como você está treinando eles hoje para isso?","score":70,"feedback":"Boa pergunta de aprofundamento, mas você está no limite dos 3 minutos. Seria ideal avançar para um próximo passo.","is_best":false},
    {"id":"d","text":"Entendido. Posso mandar um case de sucesso de uma empresa que tinha esse mesmo problema e como resolvemos?","score":45,"feedback":"Mandar case por e-mail pode funcionar, mas é mais fraco do que pedir uma reunião agora que ele te deu a dor real.","is_best":false}
  ]')
  on conflict do nothing;

  -- Simulação 2: LinkedIn
  insert into public.simulation_turns (simulation_id, turn_index, lead_message, options) values
  (sim2_id, 1, 'Olá! Vi seu post sobre treinamento de SDRs. Achei interessante. O que exatamente vocês oferecem?', '[
    {"id":"a","text":"Olá Camila! A Soldi é uma plataforma de treinamento gamificado para times de vendas. Temos módulos de SDR, closer, gestão comercial e mais. Quer saber mais?","score":55,"feedback":"Correto mas genérico. Listar todos os módulos não ajuda a criar relevância. Pergunte sobre o contexto dela primeiro.","is_best":false},
    {"id":"b","text":"Oi Camila! Que ótimo! Antes de explicar, me conta: qual é o maior desafio do time de SDR da Nexus hoje? Assim consigo ser mais direto no que pode ajudar.","score":90,"feedback":"Excelente movimento. Você criou reciprocidade, demonstrou interesse genuíno e vai coletar informação para personalizar sua resposta.","is_best":true},
    {"id":"c","text":"Oi Camila, obrigado pelo interesse! Posso te enviar nosso deck comercial e você avalia com calma?","score":20,"feedback":"Nunca envie deck antes de entender o contexto. Você pode estar mandando informação irrelevante e perder o lead.","is_best":false},
    {"id":"d","text":"Oi Camila! Treinamos SDRs com simulações de leads reais e nossos clientes veem +40% de reuniões agendadas. Você tem esse desafio?","score":75,"feedback":"Bom uso de dado concreto e pergunta de qualificação. Poderia ser melhor se antes escutasse ela falar do contexto.","is_best":false}
  ]'),
  (sim2_id, 2, 'Nosso time de SDR tem 8 pessoas, mas as taxas de conversão caíram muito no último trimestre. Estamos tentando entender o motivo.', '[
    {"id":"a","text":"Entendo a situação. Geralmente quando as taxas caem, o problema está na abordagem ou na qualificação. Nossa plataforma tem simulações que mostram exatamente onde o SDR está errando. Vale uma call de 30min?","score":85,"feedback":"Ótimo. Você demonstrou conhecimento sobre o problema, conectou à solução e fez o pedido de reunião com tempo claro.","is_best":true},
    {"id":"b","text":"8 SDRs com queda de conversão? Isso é crítico. Me conta mais: vocês têm processo de feedback das calls? Os SDRs têm script?","score":70,"feedback":"Boas perguntas de diagnóstico, mas no LinkedIn você deve ser mais eficiente. Muitas perguntas antes de propor um próximo passo.","is_best":false},
    {"id":"c","text":"Que situação difícil. Nossa plataforma pode resolver isso com nosso módulo de qualificação e o sistema de feedback automático por IA que temos.","score":45,"feedback":"Você foi cedo demais para a solução. Faltou mostrar que entende o problema antes de apresentar o produto.","is_best":false},
    {"id":"d","text":"Interessante. Esse é um problema que a maioria das operações enfrenta em algum momento. Posso te mandar um artigo sobre as principais causas de queda de conversão?","score":30,"feedback":"Mandar artigo não avança a venda. Você tem contexto suficiente para pedir uma reunião agora.","is_best":false}
  ]')
  on conflict do nothing;

  -- Simulação 3: Gatekeeper
  insert into public.simulation_turns (simulation_id, turn_index, lead_message, options) values
  (sim3_id, 1, 'Grupo Andrade, boa tarde. Com quem você quer falar e qual o motivo?', '[
    {"id":"a","text":"Boa tarde! Poderia falar com o Diretor Comercial? É sobre uma parceria estratégica.","score":40,"feedback":"''Parceria estratégica'' é uma frase que gatekeepers reconhecem como de vendas. Deu um passo, mas pode ser melhor.","is_best":false},
    {"id":"b","text":"Boa tarde! Meu nome é [Nome], da Soldi. Liguei para falar com o Diretor Comercial sobre o aumento de performance do time de SDR de vocês. Ele está disponível?","score":75,"feedback":"Bom. Você foi direto, usou o motivo real (performance do time de SDR) e tratou como algo esperado com ''ele está disponível''.","is_best":true},
    {"id":"c","text":"Boa tarde! Gostaria de falar com quem cuida da área de vendas ou treinamento comercial. Vocês têm alguém responsável por isso?","score":60,"feedback":"Flexível e inteligente — você aceita falar com qualquer responsável pela área. Mas faltou nomear o cargo específico e o motivo.","is_best":false},
    {"id":"d","text":"Boa tarde! Tenho uma oportunidade importante para o Grupo Andrade que preciso passar pessoalmente para o diretor.","score":20,"feedback":"''Oportunidade importante'' é uma red flag para gatekeepers. Parece vendedor tentando ser interessante. Seja mais concreto.","is_best":false}
  ]'),
  (sim3_id, 2, 'Ele está em reunião. Você pode me dizer mais sobre o assunto para eu verificar se é interessante passar?', '[
    {"id":"a","text":"Claro! A Soldi é uma plataforma de treinamento comercial que ajuda times de SDR a aumentar reuniões agendadas. Nós trabalhamos com empresas como...","score":50,"feedback":"Você começou a fazer pitch para a assistente. Ela não é sua cliente — não decida por ela. Recupere o controle da situação.","is_best":false},
    {"id":"b","text":"Entendo. Seria mais produtivo eu falar diretamente com ele, mas posso deixar uma mensagem? Qual o melhor horário para retornar?","score":80,"feedback":"Muito bom. Você reconhece a barreira sem confrontar, e já agenda o próximo contato. Isso demonstra profissionalismo.","is_best":true},
    {"id":"c","text":"Prefiro falar diretamente com ele. Quando você acha que ele estará disponível?","score":70,"feedback":"Direto e sem criar atritos. Funciona bem. Poderia adicionar um motivo de urgência leve para criar prioridade.","is_best":false},
    {"id":"d","text":"Tudo bem, o assunto é confidencial e precisa ser tratado diretamente com o decisor.","score":25,"feedback":"''Confidencial'' parece manipulação. Gatekeepers treinados vão rejeitar isso imediatamente e você perde a credibilidade.","is_best":false}
  ]')
  on conflict do nothing;

  -- Simulação 4: Follow-up WhatsApp
  insert into public.simulation_turns (simulation_id, turn_index, lead_message, options) values
  (sim4_id, 1, '[Você vai enviar a primeira mensagem de follow-up no WhatsApp]', '[
    {"id":"a","text":"Oi Felipe! Tudo bem? Só passando para ver se você teve tempo de pensar na nossa conversa 😊","score":20,"feedback":"''Só passando para ver'' e o emoji amigável tornam sua mensagem fraca. Você parece estar pedindo um favor, não trazendo valor.","is_best":false},
    {"id":"b","text":"Felipe, sei que você está atarefado. Trouxe um dado rápido: operações que implementaram treinamento estruturado de SDR aumentam 35% nas reuniões em 60 dias. Vale 15 min essa semana?","score":90,"feedback":"Perfeito. Você não pediu desculpas pelo follow-up, trouxe um insight novo e fez um pedido de reunião com prazo e tempo definidos.","is_best":true},
    {"id":"c","text":"Oi Felipe! Me dá um retorno quando puder sobre nossa conversa?","score":10,"feedback":"Pior abordagem possível. Você está pedindo para ele fazer algo por você, sem trazer nenhum valor.","is_best":false},
    {"id":"d","text":"Felipe, tentei te contatar algumas vezes. Posso entender o que aconteceu desde nossa última conversa?","score":45,"feedback":"A pergunta sobre o que aconteceu é razoável, mas começar mencionando que tentou várias vezes cria pressão negativa.","is_best":false}
  ]'),
  (sim4_id, 2, 'Oi! Desculpa o sumiço. Tivemos uma mudança interna e as prioridades mudaram. Não sei se faz sentido avançar agora.', '[
    {"id":"a","text":"Entendo Felipe. Mudanças internas acontecem. Quando você acha que as coisas estabilizam para retomar?","score":65,"feedback":"Resposta respeitosa. Mas você pode qualificar melhor: o problema sumiu ou só foi adiado? Isso muda sua estratégia.","is_best":false},
    {"id":"b","text":"Faz todo sentido Felipe. Só uma pergunta: a dificuldade com os SDRs que conversamos ainda existe, ou a mudança interna resolveu?","score":90,"feedback":"Excelente. Você não aceita o ''não faz sentido'' sem qualificar. A pergunta é estratégica — se a dor ainda existe, você tem espaço.","is_best":true},
    {"id":"c","text":"Entendo a situação. Posso te contatar daqui a 30 dias para ver se o cenário mudou?","score":40,"feedback":"Você desistiu rápido demais. Não qualificou se a dor ainda existe. Um bom SDR aprofunda antes de adiar.","is_best":false},
    {"id":"d","text":"Sem problemas! Vou te incluir em nossa newsletter com conteúdos de vendas. Quando as coisas melhorarem, fico à disposição!","score":5,"feedback":"Newsletter é a pior saída. Você basicamente jogou o lead fora. Nunca desista sem qualificar se ainda há interesse.","is_best":false}
  ]')
  on conflict do nothing;

  -- Simulação 5: Objeção de preço
  insert into public.simulation_turns (simulation_id, turn_index, lead_message, options) values
  (sim5_id, 1, 'Achei interessante, mas achei o preço alto para o nosso tamanho. Somos uma empresa pequena ainda.', '[
    {"id":"a","text":"Entendo a preocupação, Ana. Antes de falar sobre preço, me conta: qual é o custo de um SDR que não converte bem para vocês hoje?","score":90,"feedback":"Perfeito. Você inverteu a lógica: antes de justificar o preço, faz ela calcular o custo do problema. Isso muda toda a conversa.","is_best":true},
    {"id":"b","text":"Entendo! Temos planos para empresas de todos os tamanhos. Posso te apresentar nosso plano starter que cabe no orçamento de vocês.","score":55,"feedback":"Razoável, mas você foi direto ao desconto/plano menor sem entender o tamanho real do problema. Pode desvalorizar o produto.","is_best":false},
    {"id":"c","text":"Nosso preço reflete o valor que entregamos. Empresas pequenas que investem em treinamento crescem mais rápido.","score":35,"feedback":"Você ficou na defensiva e fez uma afirmação genérica. Isso não remove a objeção de preço concreta dela.","is_best":false},
    {"id":"d","text":"Posso te dar um desconto de 20% para fechar esse mês. Como seria para vocês?","score":10,"feedback":"Dar desconto antes de entender o problema e qualificar o orçamento real é um erro grave. Você desvalorizou o produto sem necessidade.","is_best":false}
  ]'),
  (sim5_id, 2, 'Hmm, nunca pensei assim. Mas ainda assim, mensalmente é muito para a gente absorver agora.', '[
    {"id":"a","text":"Entendo. E se a gente simulasse: se seus SDRs converterem 30% a mais de leads, em quanto tempo o investimento se paga para vocês?","score":85,"feedback":"Ótimo. Você faz ela calcular o ROI por conta própria. Isso é muito mais poderoso do que você afirmar que ''vale a pena''.","is_best":true},
    {"id":"b","text":"Podemos parcelar em 12x para diluir melhor. Ficaria uns R$X por mês, que é o equivalente a uma contratação parcial.","score":60,"feedback":"Comparar com custo de contratação é uma boa analogia, mas você foi direto ao parcelamento sem fazer ela sentir o valor primeiro.","is_best":false},
    {"id":"c","text":"Tudo bem, não tem problema. Quando vocês estiverem num momento melhor financeiramente, pode me acionar.","score":5,"feedback":"Você desistiu completamente. Um bom SDR qualifica até o fim e pelo menos agenda para um futuro próximo e definido.","is_best":false},
    {"id":"d","text":"Ana, o que eu preciso entender: o orçamento não existe hoje ou é uma questão de prioridade? São situações diferentes.","score":75,"feedback":"Boa pergunta de qualificação — você distingue falta de verba de falta de prioridade. Isso revela a objeção real.","is_best":false}
  ]')
  on conflict do nothing;
end $$;

-- ============================================================
-- DAILY MISSIONS
-- ============================================================
insert into public.daily_missions (title, description, mission_type, target_value, xp_reward) values
('Simulação do dia',       'Complete 1 simulação de lead com nota acima de 50',          'simulation_score', 50,  75),
('Treino de módulo',       'Estude ao menos 1 lição de qualquer módulo SDR',              'lesson_complete',  1,   50),
('Simulação perfeita',     'Complete uma simulação com nota acima de 80',                 'simulation_score', 80,  100),
('Maratona de treino',     'Complete 3 simulações em um único dia',                       'simulation_count', 3,   150),
('Primeiro módulo',        'Conclua todas as lições do Módulo Fundamentos do SDR',        'module_complete',  1,   200)
on conflict do nothing;

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
insert into public.achievements (slug, title, description, icon, xp_reward, condition_type, condition_value) values
('first_simulation',    'Primeira Ligação',       'Complete sua primeira simulação',                     '📞', 50,  'simulation_count',  1),
('simulation_5',        'Em Ritmo',               'Complete 5 simulações',                               '🔥', 100, 'simulation_count',  5),
('simulation_20',       'SDR Consistente',        'Complete 20 simulações',                              '💪', 200, 'simulation_count',  20),
('score_90',            'Top Performance',        'Tire nota 90+ em uma simulação',                      '⭐', 150, 'max_score',         90),
('streak_3',            'Streak de 3 dias',       'Entre 3 dias consecutivos',                           '🗓️', 100, 'streak_days',        3),
('streak_7',            'Semana Completa',        'Entre 7 dias consecutivos',                           '🏆', 300, 'streak_days',        7),
('module_1',            'Módulo Concluído',       'Conclua seu primeiro módulo completo',                '📚', 200, 'modules_complete',   1),
('module_3',            'Studioso',               'Conclua 3 módulos completos',                         '🎓', 500, 'modules_complete',   3),
('level_2',             'Subiu de Nível',         'Alcance o nível 2 (SDR Júnior)',                      '🆙', 0,   'level',             2),
('level_5',             'SDR Expert',             'Alcance o nível 5',                                   '🌟', 0,   'level',             5),
('xp_1000',             'Mil Pontos',             'Acumule 1.000 XP',                                    '💎', 0,   'total_xp',          1000)
on conflict (slug) do nothing;
