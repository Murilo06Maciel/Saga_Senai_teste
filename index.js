// Botão de alto contraste
window.addEventListener('DOMContentLoaded', function() {
	// Adiciona botão no topo do body
	const btn = document.createElement('button');
	btn.textContent = 'Ativar Alto Contraste';
	btn.id = 'contrasteBtn';
	btn.className = 'btn btn-warning mb-4';
	btn.style.position = 'fixed';
	btn.style.top = '24px';
	btn.style.right = '24px';
	btn.style.zIndex = '9999';
	document.body.appendChild(btn);

	btn.addEventListener('click', function() {
		const isContraste = document.body.classList.toggle('contraste');
		// Alterna classes nos principais elementos
		document.querySelectorAll('.container, .navbar, .footer, footer').forEach(el => {
			if (isContraste) {
				el.classList.add('contraste');
			} else {
				el.classList.remove('contraste');
			}
		});
		document.querySelectorAll('.card, .btn, .item-name, .item-price, h1, h2, h3, h4, h5, h6').forEach(el => {
			if (isContraste) {
				el.classList.add('contraste');
			} else {
				el.classList.remove('contraste');
			}
		});
		btn.textContent = isContraste ? 'Desativar Alto Contraste' : 'Ativar Alto Contraste';
	});
});
// Função para falar texto em português
function falar(texto) {
	const utter = new SpeechSynthesisUtterance(texto);
	utter.lang = 'pt-BR';
	utter.rate = 1.2; // velocidade mais rápida
	utter.volume = 1;
	utter.pitch = 1;
	const vozPt = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('pt'));
	if (vozPt) utter.voice = vozPt;
	window.speechSynthesis.cancel(); // interrompe qualquer fala anterior
	window.speechSynthesis.speak(utter);
}

// Adiciona eventos de mouse nos cards e botões
window.addEventListener('DOMContentLoaded', function() {
		// Cards: fala nome e preço
		document.querySelectorAll('.card').forEach(card => {
			card.addEventListener('mouseenter', function() {
				const nome = card.querySelector('.item-name').textContent;
				let preco = card.querySelector('.item-price').textContent.replace('R$', '').trim();
				preco = preco.replace(',', '.');
				const [reais, centavos] = preco.split('.');
				let precoTexto = `${reais} reais`;
				if (centavos && parseInt(centavos) > 0) precoTexto = `${reais} reais e ${centavos} centavos`;
				falar(`${nome}, preço ${precoTexto}`);
			});
			// Botão adicionar: fala ação, nome e preço
			const btn = card.querySelector('.btn');
			if (btn) {
				btn.addEventListener('mouseenter', function() {
					const nome = card.querySelector('.item-name').textContent;
					let preco = card.querySelector('.item-price').textContent.replace('R$', '').trim();
					preco = preco.replace(',', '.');
					const [reais, centavos] = preco.split('.');
					let precoTexto = `${reais} reais`;
					if (centavos && parseInt(centavos) > 0) precoTexto = `${reais} reais e ${centavos} centavos`;
					falar(`Adicionar ao pedido: ${nome}, preço ${precoTexto}`);
				});
				// Adiciona funcionalidade de adicionar ao pedido
				btn.addEventListener('click', function() {
					const nome = card.querySelector('.item-name').textContent;
					const preco = card.querySelector('.item-price').textContent.replace('R$', '').replace(',', '.').trim();
					adicionarPedido(nome, parseFloat(preco));
					falar(`${nome} adicionado ao seu pedido`);
				});
			}
		});

		// Containers: fala nome ao passar o mouse
		const containers = [
			{ id: 'cardapio', texto: 'Cardápio' },
			{ id: 'pedido', texto: 'Seu Pedido' },
			{ id: 'contato', texto: 'Contato' }
		];
		containers.forEach(c => {
			const el = document.getElementById(c.id);
			if (el) {
				el.addEventListener('mouseenter', function() {
					falar(c.texto);
				});
			}
		});

	// Fala ao passar mouse em todos os botões da página (inclusive navbar, footer, etc)
		document.querySelectorAll('button, .nav-link').forEach(botao => {
			botao.addEventListener('mouseenter', function() {
				let texto = '';
				if (botao.id === 'contrasteBtn') {
					texto = botao.textContent.includes('Desativar') ? 'Desativar alto contraste' : 'Ativar alto contraste';
				} else if (botao.classList.contains('btn-info')) {
					texto = 'Clique para ouvir os itens do seu pedido e o total.';
				} else if (botao.classList.contains('btn-danger')) {
					texto = 'Limpar pedido';
				} else if (botao.classList.contains('nav-link')) {
					texto = `Ir para ${botao.textContent}`;
				} else if (botao.classList.contains('btn')) {
					texto = botao.textContent;
				} else {
					texto = botao.textContent;
				}
				if (texto) falar(texto);
			});
		});

		// Adiciona botão para ler o pedido
		const pedidoDiv = document.getElementById('pedido');
		if (pedidoDiv) {
			const lerBtn = document.createElement('button');
			lerBtn.textContent = 'Ouvir Pedido';
			lerBtn.className = 'btn btn-info ms-2';
			lerBtn.style.marginLeft = '12px';
			lerBtn.onclick = lerPedido;
			lerBtn.addEventListener('mouseenter', function() {
				falar('Clique para ouvir os itens do seu pedido e o total.');
			});
			pedidoDiv.appendChild(lerBtn);
		}
});

// Função para adicionar item ao pedido
function adicionarPedido(item, preco) {
	const lista = document.getElementById('lista-pedido');
	const li = document.createElement('li');
	li.textContent = `${item} - R$ ${preco.toFixed(2).replace('.', ',')}`;
	lista.appendChild(li);
	atualizarTotal();
}

// Função para limpar pedido
function limparPedido() {
	const lista = document.getElementById('lista-pedido');
	lista.innerHTML = '';
	atualizarTotal();
	falar('Pedido limpo');
}

// Função para atualizar total
function atualizarTotal() {
	const lista = document.getElementById('lista-pedido');
	const itens = Array.from(lista.children);
	let total = 0;
	itens.forEach(li => {
		const partes = li.textContent.split(' - R$ ');
		if (partes.length === 2) {
			total += parseFloat(partes[1].replace(',', '.'));
		}
	});
	document.getElementById('total').textContent = itens.length ? `Total: R$ ${total.toFixed(2).replace('.', ',')}` : '';
}

// Função para ler o pedido e total
function lerPedido() {
	const lista = document.getElementById('lista-pedido');
	const itens = Array.from(lista.children);
	let texto = '';
	let total = 0;
	if (itens.length === 0) {
		texto = 'Nenhum item no pedido.';
	} else {
		texto = 'Seu pedido: ';
		itens.forEach(li => {
			// Espera que o texto do li seja "Nome - R$ XX,00"
			const partes = li.textContent.split(' - R$ ');
			if (partes.length === 2) {
				let preco = partes[1].replace(',', '.');
				let [reais, centavos] = preco.split('.');
				let precoTexto = `${reais} reais`;
				if (centavos && parseInt(centavos) > 0) precoTexto = `${reais} reais e ${centavos} centavos`;
				texto += `${partes[0]}, ${precoTexto}. `;
				total += parseFloat(preco);
			}
		});
		let totalReais = Math.floor(total);
		let totalCentavos = Math.round((total - totalReais) * 100);
		let totalTexto = `${totalReais} reais`;
		if (totalCentavos > 0) totalTexto += ` e ${totalCentavos} centavos`;
		texto += `Total ${totalTexto}.`;
	}
	falar(texto);
}
// Exemplo de JS para futura interação
// Adicione funcionalidades JS conforme necessário
console.log('Cardápio carregado!');
