(function () {
    var raiz = document.documentElement;

    function aplicarTema(tema) {
        raiz.setAttribute("data-tema", tema);
    }

    function lerTema() {
        try {
            return localStorage.getItem("tema") === "escuro" ? "escuro" : "claro";
        } catch (erro) {
            return "claro";
        }
    }

    function salvarTema(tema) {
        try {
            localStorage.setItem("tema", tema);
        } catch (erro) {}
    }

    aplicarTema(lerTema());

    function lerLogado() {
        try {
            return localStorage.getItem("logado") === "1";
        } catch (erro) {
            return false;
        }
    }

    function marcarLogado() {
        try {
            localStorage.setItem("logado", "1");
        } catch (erro) {}
        raiz.setAttribute("data-logado", "1");
    }

    function lerUsuario() {
        try {
            return JSON.parse(localStorage.getItem("usuarioLogado")) || null;
        } catch (erro) {
            return null;
        }
    }

    function valorDe(id, padrao) {
        var el = document.getElementById(id);
        return el ? el.value : padrao;
    }

    if (lerLogado()) {
        raiz.setAttribute("data-logado", "1");
    }

    function iniciarTema() {
        var botao = document.querySelector(".btn-modo");

        function atualizarBotao() {
            if (botao) {
                botao.setAttribute("aria-pressed", raiz.getAttribute("data-tema") === "escuro");
            }
        }

        atualizarBotao();

        if (botao) {
            botao.addEventListener("click", function () {
                var novo = raiz.getAttribute("data-tema") === "escuro" ? "claro" : "escuro";
                aplicarTema(novo);
                salvarTema(novo);
                atualizarBotao();
            });
        }
    }

    function iniciarVistas() {
        var pagina = document.querySelector("[data-vista]");
        if (!pagina) {
            return;
        }

        var gatilhos = document.querySelectorAll("[data-ir]");
        var linksTopo = document.querySelectorAll(".topo-link[data-ir]");
        var titulos = {
            entrar: "Entrar - Menu Sweet",
            cadastro: "Cadastro - Menu Sweet"
        };

        var telas = {
            entrar: pagina.querySelector(".vista-entrar"),
            cadastro: pagina.querySelector(".vista-cadastro")
        };
        var classesAnimacao = ["entra-esquerda", "entra-direita", "sai-esquerda", "sai-direita", "saindo"];
        var temporizador = null;

        function limparAnimacao() {
            clearTimeout(temporizador);

            for (var nome in telas) {
                if (telas[nome]) {
                    for (var k = 0; k < classesAnimacao.length; k++) {
                        telas[nome].classList.remove(classesAnimacao[k]);
                    }
                }
            }
        }

        function animarTroca(anterior, vista) {
            var reduzido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            limparAnimacao();

            if (reduzido || anterior === vista || !telas[vista] || !telas[anterior]) {
                return;
            }

            var daEsquerda = vista === "entrar";

            telas[vista].classList.add(daEsquerda ? "entra-esquerda" : "entra-direita");
            telas[anterior].classList.add("saindo", daEsquerda ? "sai-direita" : "sai-esquerda");

            temporizador = setTimeout(limparAnimacao, 520);
        }

        function ir(vista, atualizarEndereco) {
            var anterior = pagina.getAttribute("data-vista");

            if (atualizarEndereco) {
                animarTroca(anterior, vista);
            }

            pagina.setAttribute("data-vista", vista);
            if (titulos[vista]) {
                document.title = titulos[vista];
            }

            for (var i = 0; i < linksTopo.length; i++) {
                linksTopo[i].classList.toggle("ativo", linksTopo[i].getAttribute("data-ir") === vista);
            }

            if (atualizarEndereco && window.history && history.replaceState) {
                history.replaceState(null, "", "#" + vista);
            }
        }

        for (var i = 0; i < gatilhos.length; i++) {
            gatilhos[i].addEventListener("click", function (evento) {
                evento.preventDefault();
                ir(this.getAttribute("data-ir"), true);
            });
        }

        window.addEventListener("hashchange", function () {
            ir(location.hash === "#entrar" ? "entrar" : "cadastro", false);
        });

        ir(location.hash === "#entrar" ? "entrar" : "cadastro", false);
    }

    function iniciarPortao() {
        var portao = document.querySelector(".portao");
        if (!portao) {
            return;
        }

        var modal = portao.querySelector(".portao-modal");
        var formulario = portao.querySelector(".portao-form");

        function ajustar() {
            if (window.innerWidth <= 1024 || !modal) {
                if (modal) modal.style.transform = "";
                return;
            }

            var escala = Math.min(1, (window.innerHeight * 0.86) / 1112, (window.innerWidth * 0.96) / 1348);
            modal.style.transform = "translate(-50%, -50%) scale(" + escala + ")";
        }

        ajustar();
        window.addEventListener("resize", ajustar);

        if (formulario) {
            formulario.addEventListener("submit", function (evento) {
                evento.preventDefault();
                marcarLogado();
                portao.style.display = "none";
            });
        }
    }

    
    function iniciarFormularios() {
        var formCadastro = document.querySelector(".form-cadastro");
        if (formCadastro) {
            formCadastro.addEventListener("submit", function (e) {
                e.preventDefault();
                var usuario = {
                    nome: valorDe("nome", "Usuário"),
                    email: valorDe("email", ""),
                    telefone: valorDe("telefone", ""),
                    cep: valorDe("cep", ""),
                    rua: valorDe("rua", ""),
                    num: valorDe("num", ""),
                    bairro: valorDe("bairro", ""),
                    complemento: valorDe("complemento", "")
                };
                localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
                marcarLogado();
                alert("Cadastro realizado com sucesso!");
                window.location.href = "Cardapioindex.html";
            });
        }

        var formEntrar = document.querySelector(".form-entrar");
        if (formEntrar) {
            formEntrar.addEventListener("submit", function (e) {
                e.preventDefault();
                var emailInput = valorDe("entrar-email", "usuario@menusweet.com");
                var existente = lerUsuario();
                var usuario = existente && existente.email === emailInput
                    ? existente
                    : { nome: emailInput.split("@")[0], email: emailInput };
                localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
                marcarLogado();
                window.location.href = "Cardapioindex.html";
            });
        }

        var formAssinatura = document.querySelector(".form-assinatura");
        if (formAssinatura) {
            formAssinatura.addEventListener("submit", function (e) {
                e.preventDefault();
                var usuario = lerUsuario() || { nome: "Assinante" };
                usuario.cep = valorDe("cep", "");
                usuario.num = valorDe("num", "");
                usuario.rua = valorDe("rua", "");
                usuario.apt = valorDe("apt", "");
                usuario.bairro = valorDe("bairro", "");
                usuario.complemento = valorDe("complemento", "");
                usuario.assinante = true;
                try {
                    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
                } catch (erro) {}
                marcarLogado();
                alert("Assinatura cadastrada com sucesso!");
                window.location.href = "Assinanteindex.html";
            });
        }

        var formEndereco = document.querySelector(".form-endereco");
        if (formEndereco) {
            formEndereco.addEventListener("submit", function (e) {
                e.preventDefault();
                var usuario = lerUsuario() || { nome: "Usuário" };
                usuario.cep = valorDe("cep", "");
                usuario.num = valorDe("num", "");
                usuario.rua = valorDe("rua", "");
                usuario.apt = valorDe("apt", "");
                usuario.bairro = valorDe("bairro", "");
                usuario.complemento = valorDe("complemento", "");
                localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
                alert("Endereço salvo!");
            });
        }
    }

    
    function iniciarUsuario() {
        var userObj = lerUsuario();
        if (!lerLogado() || !userObj) {
            return;
        }

        var linkEntrar = document.querySelector(".topo-link.link-entrar");
        var linkCadastro = document.querySelector(".topo-link.link-cadastro");
        var topoInterno = document.querySelector(".topo-interno");

        if (linkEntrar && linkCadastro && topoInterno) {
            linkEntrar.remove();
            linkCadastro.remove();

            var spanNome = document.createElement("a");
            spanNome.href = "Perfilindex.html";
            spanNome.className = "topo-nome";
            spanNome.textContent = userObj.nome;

            var aPerfil = document.createElement("a");
            aPerfil.href = "Perfilindex.html";
            aPerfil.className = "topo-perfil";
            var imgPerfil = document.createElement("img");
            imgPerfil.src = "perfil.png";
            imgPerfil.alt = "Perfil";
            aPerfil.appendChild(imgPerfil);

            topoInterno.appendChild(spanNome);
            topoInterno.appendChild(aPerfil);
        }

        var nomeFixo = document.querySelector(".topo-nome");
        if (nomeFixo) {
            nomeFixo.textContent = userObj.nome;
        }

        var spanNomeAssinante = document.querySelector(".texto-azul.nome, .pedidos-nome");
        if (spanNomeAssinante) {
            spanNomeAssinante.textContent = userObj.nome;
        }

        var listaEndereco = document.querySelector(".endereco-lista");
        if (listaEndereco) {
            var itensLista = listaEndereco.querySelectorAll("li");
            if (itensLista.length >= 4) {
                itensLista[0].textContent = "Rua: " + (userObj.rua || "") + ", " + (userObj.num || "");
                itensLista[1].textContent = "Bairro: " + (userObj.bairro || "");
                itensLista[2].textContent = "CEP: " + (userObj.cep || "");
                itensLista[3].textContent = "Complemento: " + (userObj.complemento || "Nenhum");
            }
        }

        var campos = ["cep", "num", "rua", "apt", "bairro", "complemento"];
        for (var i = 0; i < campos.length; i++) {
            var input = document.getElementById(campos[i]);
            if (input && userObj[campos[i]]) {
                input.value = userObj[campos[i]];
            }
        }
    }

    
    function iniciarCardapio() {
        var botoesCardapio = document.querySelectorAll(".card-item");

        botoesCardapio.forEach(function (botao) {
            botao.addEventListener("click", function () {
                var elNome = botao.querySelector(".item-nome");
                var elPreco = botao.querySelector(".item-preco");

                var novoProduto = {
                    nome: elNome ? elNome.textContent : "Produto",
                    preco: elPreco ? elPreco.textContent : "R$0,00"
                };

                var carrinho = [];
                try {
                    carrinho = JSON.parse(localStorage.getItem("carrinhoProdutos")) || [];
                } catch (erro) {}
                carrinho.push(novoProduto);
                localStorage.setItem("carrinhoProdutos", JSON.stringify(carrinho));

                var aviso = document.createElement("div");
                aviso.textContent = "✔ Adicionado ao carrinho!";
                aviso.style.position = "fixed";
                aviso.style.bottom = "20px";
                aviso.style.right = "20px";
                aviso.style.backgroundColor = "#ff69b4";
                aviso.style.color = "#fff";
                aviso.style.padding = "10px 20px";
                aviso.style.borderRadius = "8px";
                aviso.style.zIndex = "9999";
                aviso.style.fontFamily = "Quicksand, sans-serif";
                aviso.style.fontWeight = "bold";
                document.body.appendChild(aviso);

                setTimeout(function () {
                    aviso.remove();
                }, 2000);
            });
        });
    }

    
    function lerCarrinho() {
        try {
            return JSON.parse(localStorage.getItem("carrinhoProdutos")) || [];
        } catch (erro) {
            return [];
        }
    }

    function lerPedidos() {
        try {
            return JSON.parse(localStorage.getItem("pedidos")) || [];
        } catch (erro) {
            return [];
        }
    }

    function precoNumero(texto) {
        return parseFloat(String(texto).replace("R$", "").replace(",", ".").trim()) || 0;
    }

    function dinheiro(valor) {
        return "R$" + valor.toFixed(2).replace(".", ",");
    }

    function iniciarCarrinho() {
        var lista = document.querySelector(".pedido-lista");
        if (!lista) {
            return;
        }

        var botaoComprar = document.querySelector(".btn-comprar");
        if (botaoComprar) {
            botaoComprar.addEventListener("click", function () {
                var itens = lerCarrinho();

                if (itens.length === 0) {
                    alert("Seu carrinho está vazio.");
                    return;
                }

                var usuario = lerUsuario();
                if (!lerLogado() || !usuario) {
                    alert("Faça login ou cadastro para finalizar o pedido.");
                    window.location.href = "Cadastroindex.html#entrar";
                    return;
                }

                var total = 0;
                itens.forEach(function (item) {
                    total += precoNumero(item.preco);
                });

                var enderecoTexto = usuario.rua
                    ? usuario.rua + ", " + (usuario.num || "") + " - " + (usuario.bairro || "")
                    : "";

                var pedidos = lerPedidos();
                pedidos.push({
                    numero: pedidos.length + 1,
                    data: new Date().toLocaleString("pt-BR"),
                    itens: itens,
                    total: total,
                    endereco: enderecoTexto
                });

                localStorage.setItem("pedidos", JSON.stringify(pedidos));
                localStorage.removeItem("carrinhoProdutos");

                renderizarCarrinho();
                alert("Pedido realizado com sucesso!");
                window.location.href = "Perfilindex.html";
            });
        }

        renderizarCarrinho();
    }

    function renderizarCarrinho() {
        var lista = document.querySelector(".pedido-lista");
        if (!lista) {
            return;
        }

        var carrinhoSalvo = [];
        try {
            carrinhoSalvo = JSON.parse(localStorage.getItem("carrinhoProdutos")) || [];
        } catch (erro) {}

        var totalGeral = 0;
        lista.innerHTML = "";

        if (carrinhoSalvo.length === 0) {
            var vazio = document.createElement("p");
            vazio.className = "pedido-linha";
            vazio.textContent = "Carrinho vazio";
            lista.appendChild(vazio);
        }

        carrinhoSalvo.forEach(function (prod, index) {
            var linha = document.createElement("p");
            linha.className = "pedido-linha";

            var nome = document.createElement("span");
            nome.className = "linha-nome";
            nome.textContent = (index + 1) + ". " + prod.nome;

            var preco = document.createElement("span");
            preco.className = "linha-preco";
            preco.textContent = prod.preco;

            linha.appendChild(nome);
            linha.appendChild(preco);
            lista.appendChild(linha);

            totalGeral += parseFloat(prod.preco.replace("R$", "").replace(",", ".").trim()) || 0;
        });

        var paragrafoTotal = document.querySelector(".pedido-total");
        if (paragrafoTotal) {
            paragrafoTotal.textContent = "TOTAL: R$" + totalGeral.toFixed(2).replace(".", ",");
        }

        var paragrafoEndereco = document.querySelector(".pedido-endereco");
        var u = lerUsuario();
        if (paragrafoEndereco && u && u.rua) {
            paragrafoEndereco.textContent = "Endereço: " + u.rua + ", " + (u.num || "") + " - " + (u.bairro || "");
        }
    }

    
    function soDigitos(v) {
        return v.replace(/\D/g, "");
    }

    function mascaraCep(v) {
        var d = soDigitos(v).slice(0, 8);
        return d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d;
    }

    function mascaraTelefone(v) {
        var d = soDigitos(v).slice(0, 11);
        if (d.length === 0) return "";
        if (d.length <= 2) return "(" + d;
        var ddd = d.slice(0, 2);
        var resto = d.slice(2);
        if (d.length <= 6) return "(" + ddd + ") " + resto;
        if (d.length <= 10) return "(" + ddd + ") " + resto.slice(0, 4) + "-" + resto.slice(4);
        return "(" + ddd + ") " + resto.slice(0, 5) + "-" + resto.slice(5);
    }

    function limparTexto(v, max) {
        return v.replace(/^\s+/, "").replace(/\s{2,}/g, " ").slice(0, max);
    }

    var regrasCampos = {
        "telefone": { max: 15, modo: "tel", formatar: mascaraTelefone,
            validar: function (v) { var n = soDigitos(v).length; return (n === 10 || n === 11) ? "" : "Digite o telefone com DDD: (00) 00000-0000"; } },
        "nome": { max: 50, modo: "text",
            formatar: function (v) { return limparTexto(v.replace(/[^A-Za-zÀ-ÿ' ]/g, ""), 50); },
            validar: function (v) { return v.trim().length >= 2 ? "" : "Digite seu nome"; } },
        "email": { max: 60, modo: "email", formatar: function (v) { return v.replace(/\s/g, "").slice(0, 60); } },
        "senha": { max: 32, modo: "text", formatar: function (v) { return v.replace(/\s/g, "").slice(0, 32); } },
        "cep": { max: 9, modo: "numeric", formatar: mascaraCep,
            validar: function (v) { return soDigitos(v).length === 8 ? "" : "O CEP deve ter 8 números: 00000-000"; } },
        "num": { max: 6, modo: "numeric", formatar: function (v) { return soDigitos(v).slice(0, 6); } },
        "rua": { max: 60, modo: "text", formatar: function (v) { return limparTexto(v, 60); } },
        "apt": { max: 6, modo: "text", formatar: function (v) { return v.replace(/[^A-Za-z0-9]/g, "").slice(0, 6); } },
        "bairro": { max: 40, modo: "text", formatar: function (v) { return limparTexto(v, 40); } },
        "complemento": { max: 50, modo: "text", formatar: function (v) { return limparTexto(v, 50); } },
        "entrar-email": { max: 60, modo: "email", formatar: function (v) { return v.replace(/\s/g, "").slice(0, 60); } },
        "entrar-senha": { max: 32, modo: "text", formatar: function (v) { return v.replace(/\s/g, "").slice(0, 32); } }
    };

    function iniciarMascaras() {
        Object.keys(regrasCampos).forEach(function (id) {
            var campo = document.getElementById(id);
            if (!campo) {
                return;
            }

            var regra = regrasCampos[id];
            campo.setAttribute("maxlength", regra.max);
            campo.setAttribute("inputmode", regra.modo);

            function atualizar() {
                var novo = regra.formatar(campo.value);
                if (novo !== campo.value) {
                    campo.value = novo;
                }
                if (regra.validar && (campo.value !== "" || campo.required)) {
                    campo.setCustomValidity(regra.validar(campo.value));
                } else {
                    campo.setCustomValidity("");
                }
            }

            campo.addEventListener("input", atualizar);
            atualizar();
        });
    }

    
    function iniciarPedidos() {
        var caixa = document.querySelector(".pedidos-lista");
        if (!caixa) {
            return;
        }

        var pedidos = lerPedidos().slice().reverse();
        caixa.innerHTML = "";

        if (pedidos.length === 0) {
            var vazio = document.createElement("p");
            vazio.className = "pedido-vazio";
            vazio.textContent = "Você ainda não fez nenhum pedido.";
            caixa.appendChild(vazio);
            return;
        }

        pedidos.forEach(function (pedido) {
            var bloco = document.createElement("div");
            bloco.className = "pedido-card";

            var cab = document.createElement("p");
            cab.className = "pedido-card-titulo";
            cab.textContent = "Pedido #" + pedido.numero + " - " + pedido.data;
            bloco.appendChild(cab);

            pedido.itens.forEach(function (item) {
                var linha = document.createElement("p");
                linha.className = "pedido-card-linha";

                var nome = document.createElement("span");
                nome.className = "linha-nome";
                nome.textContent = item.nome;

                var preco = document.createElement("span");
                preco.className = "linha-preco";
                preco.textContent = item.preco;

                linha.appendChild(nome);
                linha.appendChild(preco);
                bloco.appendChild(linha);
            });

            var total = document.createElement("p");
            total.className = "pedido-card-total";
            total.textContent = "TOTAL: " + dinheiro(pedido.total);
            bloco.appendChild(total);

            caixa.appendChild(bloco);
        });
    }

    function executar(funcao) {
        try {
            funcao();
        } catch (erro) {
            console.error(erro);
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        executar(iniciarFormularios);
        executar(iniciarTema);
        executar(iniciarVistas);
        executar(iniciarPortao);
        executar(iniciarUsuario);
        executar(iniciarMascaras);
        executar(iniciarCardapio);
        executar(iniciarCarrinho);
        executar(iniciarPedidos);
    });

    window.addEventListener("storage", function (evento) {
        if (evento.key === "tema") {
            aplicarTema(lerTema());
        }

        if (evento.key === "logado" && lerLogado()) {
            raiz.setAttribute("data-logado", "1");
        }
    });
})();