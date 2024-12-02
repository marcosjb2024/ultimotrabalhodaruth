// Carregar produtos da página de produtos
function carregarProdutos() {
  const produtosContainer = document.getElementById("produtosContainer");
  if (!produtosContainer) return;

  const produtos = [
    { id: 1,  nome: "212 VIP Rosé",  preco: 629.99, imagem: "img/imagem1.jpg" },
    { id: 2,  nome: "Invictus Victory ",  preco: 569.99, imagem: "img/imagem2.jpg" },
    { id: 3,  nome: "La Nuit Trésor",  preco: 499.99, imagem: "img/imagem3.jpg" },
    { id: 4,  nome: "Gucci Guilty Pour Homme",  preco: 599.99, imagem: "img/imagem4.jpg" },
    { id: 5,  nome: "Kérastase L’Huile Originale",  preco: 459.99, imagem: "img/imagem5.jpg" },
    { id: 6,  nome: "Máscara Kérastase Curl Manifesto Beurre Haute Nutrition",  preco: 399.99, imagem: "img/imagem6.jpg" },
    { id: 7,  nome: "Creme retexturizador Ácido Glicólico",  preco: 64.99, imagem: "img/imagem7.jpg" },
    { id: 8,  nome: "Kit Siàge Nutri Óleos Poderosos",  preco: 294.99, imagem: "img/imagem8.jpg" },
    { id: 9,  nome: "Creme Renew Platinum Noite",  preco: 94.99, imagem: "img/imagem9.jpg" },
    { id: 10, nome: "La Roche-Posay Effaclar Sérum Ultra Concentrado", preco: 124.99, imagem: "img/imagem10.jpg" },    
  ];

  produtosContainer.innerHTML = produtos
    .map(
      (produto) => `
    <div class="produto">
      <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem" />
      <h3>${produto.nome}</h3>
      <p>R$ ${produto.preco.toFixed(2)}</p>
      <button onclick="adicionarAoCarrinho(${produto.id}, '${produto.nome}', ${produto.preco})">
        Adicionar ao Carrinho
      </button>
    </div>
  `
    )
    .join("");
}


// Adicionar produto ao carrinho
function adicionarAoCarrinho(id, nome, preco) {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const index = carrinho.findIndex((item) => item.id === id);

  if (index === -1) {
    carrinho.push({ id, nome, preco, quantidade: 1 });
  } else {
    carrinho[index].quantidade++;
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  alert("Produto adicionado ao carrinho!");
}

// Carregar carrinho na página
function carregarCarrinho() {
  const carrinhoContainer = document.getElementById("carrinhoContainer");
  if (!carrinhoContainer) return;

  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  if (!carrinho.length) {
    carrinhoContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
    return;
  }

  carrinhoContainer.innerHTML = carrinho
    .map(
      (item) => `
    <div class="carrinho-item">
      <p>${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.quantidade}</p>
      <button onclick="removerDoCarrinho(${item.id})">Remover</button>
    </div>
  `
    )
    .join("");

  const total = carrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );
  carrinhoContainer.innerHTML += `<h3>Total: R$ ${total.toFixed(2)}</h3>`;
}

// Remover item do carrinho
function removerDoCarrinho(id) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho = carrinho.filter((item) => item.id !== id);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  carregarCarrinho();
}

// Salvar pedido no checkout
function salvarPedido(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const endereco = document.getElementById("endereco").value;
  const contato = document.getElementById("contato").value;
  const pagamento = document.getElementById("pagamento").value;
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  if (!carrinho.length) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const pedido = {
    id: Math.floor(1000 + Math.random() * 9000), // Gera um número de pedido
    nome,
    endereco,
    contato,
    pagamento,
    produtos: carrinho,
  };

  localStorage.setItem("pedido", JSON.stringify(pedido));
  localStorage.removeItem("carrinho");
  window.location.href = "pedidoConfirmado.html";
}

// Carregar pedido confirmado
function carregarPedidoConfirmado() {
  const dadosPedido = document.getElementById("dadosPedido");
  if (!dadosPedido) return;

  const pedido = JSON.parse(localStorage.getItem("pedido"));
  if (!pedido) {
    dadosPedido.innerHTML = "<p>Nenhum pedido encontrado.</p>";
    return;
  }

  let produtosHtml = "";
  pedido.produtos.forEach((produto) => {
    produtosHtml += `
      <p>${produto.quantidade}x ${produto.nome} - R$ ${(produto.preco * produto.quantidade).toFixed(2)}</p>
    `;
  });

  dadosPedido.innerHTML = `
    <h3>Pedido #${pedido.id}</h3>
    <p><strong>Nome:</strong> ${pedido.nome}</p>
    <p><strong>Endereço:</strong> ${pedido.endereco}</p>
    <p><strong>Contato:</strong> ${pedido.contato}</p>
    <p><strong>Método de Pagamento:</strong> ${pedido.pagamento}</p>
    <h4>Produtos:</h4>
    ${produtosHtml}
  `;
}

// Inicializar eventos
document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos();
  carregarCarrinho();
  carregarPedidoConfirmado();

  const form = document.getElementById("checkoutForm");
  if (form) form.addEventListener("submit", salvarPedido);
});
