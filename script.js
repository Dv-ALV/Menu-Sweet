(function () {
    var raiz = document.documentElement;

    var BAIXAR_AUTOMATICAMENTE = true;          
    var NOME_ARQUIVO_EXPORT = "menusweet_export.json";
    var CHAVE_EXPORT = "menusweetExport";       
    var CIDADE_PADRAO = "Belo Horizonte";       
    var ESTADO_PADRAO = "MG";

    
    var PRODUTOS_ID = {
        "Expresso da casa": 1, "Latte da Biblioteca": 2, "Bolo de Morango": 3, "Croissant Premium": 4,
        "Cappuccino Clássico": 5, "Mocha de Chocolate Meio Amargo": 6, "Macchiato Aveludado": 7,
        "Bentô Cake": 8, "Picole de Sea Salt": 9, "Tartlet de Frutas Vermelhas": 10,
        "Italian Cream de Maçã Verde": 11, "Milkshake Estelar de Baunilha": 12,
        "Frapê de Frutas Silvestres": 13, "Soda de Lichia": 14, "Energetico": 15, "Suco Lata": 16,
        "Refrigerante": 17, "Agua": 18, "O Sanduíche de Frango": 19, "Quiche Rústica": 20,
        "Empadinha Cremosa de Palmito": 21, "Toast de Abacate e Ovo Pochê": 22
    };
    var KITS_ID = {
        "Kit Encontro na Biblioteca": 1, "Kit Síndrome da Adolescência": 2,
        "Kit O Banquete do Cozinheiro": 3, "Kit Flores e Aromas de Chidori": 4,
        "Kit Equivalência de Bolso": 5, "Kit Manhã na Cidade": 6,
        "Kit Pôr do Sol na Torre do Relógio": 7
    };

   
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

    
    function novoExport() {
        return {
            importar: true,
            geradoEm: null,
            dados: {
                Usuarios: [],
                Endereco: [],
                Plano_Assinatura: [],
                Plano_Usuario: [],
                Item_Assinatura: [],
                Pedidos: [],
                Item_pedido: []
            }
        };
    }

    function lerExport() {
        try {
            var d = JSON.parse(localStorage.getItem(CHAVE_EXPORT));
            if (d && d.dados) {
                var base = novoExport();
                for (var tabela in base.dados) {
                    if (!d.dados[tabela]) {
                        d.dados[tabela] = [];
                    }
                }
                return d;
            }
        } catch (erro) {}
        return novoExport();
    }

    function salvarExport(exp) {
        exp.geradoEm = agoraMySQL();
        try {
            localStorage.setItem(CHAVE_EXPORT, JSON.stringify(exp));
        } catch (erro) {
            console.error("Não foi possível guardar a exportação", erro);
        }
    }

    function pad(n) {
        return n < 10 ? "0" + n : "" + n;
    }

    
    function agoraMySQL() {
        var d = new Date();
        return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " +
            pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    }

    function proximoId(lista) {
        var maior = 0;
        for (var i = 0; i < lista.length; i++) {
            if (lista[i].id > maior) {
                maior = lista[i].id;
            }
        }
        return maior + 1;
    }

    function gerarUid() {
        return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }

    function baixarJSON() {
        var exp = lerExport();
        exp.geradoEm = agoraMySQL();
        var texto = JSON.stringify(exp, null, 2);
        try {
            var blob = new Blob([texto], { type: "application/json" });
            var url = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = NOME_ARQUIVO_EXPORT;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        } catch (erro) {
            console.error("Falha ao baixar o JSON", erro);
        }
    }

    function baixarSeAutomatico() {
        if (BAIXAR_AUTOMATICAMENTE) {
            baixarJSON();
        }
    }

    
    function registrarUsuario(usuario, senha) {
        if (!usuario || !usuario.email) {
            console.warn("Exportação: usuário sem e-mail, ignorado.");
            return null;
        }

        var exp = lerExport();
        var lista = exp.dados.Usuarios;
        var achado = null;

        for (var i = 0; i < lista.length; i++) {
            if (lista[i].Email === usuario.email) {
                achado = lista[i];
                break;
            }
        }

        if (!achado) {
            achado = {
                id: proximoId(lista),
                Nome: usuario.nome || "",
                Email: usuario.email,
                Senha: senha || "",
                CPF: null,
                Telefone: usuario.telefone || null,
                Cargo: "cliente",
                data_criacao: agoraMySQL()
            };
            lista.push(achado);
        } else {
            if (usuario.nome) { achado.Nome = usuario.nome; }
            if (usuario.telefone) { achado.Telefone = usuario.telefone; }
            if (senha) { achado.Senha = senha; }
        }

        salvarExport(exp);
        return achado.id;
    }

    
    function registrarEndereco(idUsuario, usuario) {
        if (!idUsuario || !usuario || !usuario.rua) {
            return null;
        }

        var complemento = [];
        if (usuario.apt) { complemento.push("Apt " + usuario.apt); }
        if (usuario.complemento) { complemento.push(usuario.complemento); }

        var novo = {
            Rua: usuario.rua || "",
            Numero: usuario.num || "",
            Complemento: complemento.length ? complemento.join(" - ") : null,
            Bairro: usuario.bairro || "",
            Cidade: CIDADE_PADRAO,
            Estado: ESTADO_PADRAO,
            CEP: usuario.cep || ""
        };

        var exp = lerExport();
        var lista = exp.dados.Endereco;
        var existente = null;

        for (var i = 0; i < lista.length; i++) {
            var e = lista[i];
            if (e.idUsuarios === idUsuario &&
                e.Rua === novo.Rua && e.Numero === novo.Numero &&
                e.Bairro === novo.Bairro && e.CEP === novo.CEP &&
                (e.Complemento || null) === novo.Complemento) {
                existente = e;
                break;
            }
        }

        for (var j = 0; j < lista.length; j++) {
            if (lista[j].idUsuarios === idUsuario) {
                lista[j].endereco_padrao = 0;
            }
        }

        if (!existente) {
            existente = {
                id: proximoId(lista),
                idUsuarios: idUsuario,
                Rua: novo.Rua,
                Numero: novo.Numero,
                Complemento: novo.Complemento,
                Bairro: novo.Bairro,
                Cidade: novo.Cidade,
                Estado: novo.Estado,
                CEP: novo.CEP,
                instrucao: null,
                endereco_padrao: 1
            };
            lista.push(existente);
        } else {
            existente.endereco_padrao = 1;
        }

        salvarExport(exp);
        return existente.id;
    }

    function registrarAssinatura(usuario) {
        var idU = registrarUsuario(usuario);
        var idE = registrarEndereco(idU, usuario);
        if (!idU) {
            return;
        }

        var exp = lerExport();

        if (exp.dados.Plano_Assinatura.length === 0) {
            exp.dados.Plano_Assinatura.push({
                id: 1,
                nome_plano: "Assinatura Mensal",
                descricao_plano: "Assinatura Menu Sweet",
                tempo_plano: "mensal",
                desconto_assinante: 0,
                preco_plano: 100.00,
                atividade: 1
            });
        }

        var jaTem = false;
        for (var i = 0; i < exp.dados.Plano_Usuario.length; i++) {
            var p = exp.dados.Plano_Usuario[i];
            if (p.idUsuarios === idU && p.status === "ativo") {
                p.idEndereco = idE;
                jaTem = true;
            }
        }

        if (!jaTem) {
            exp.dados.Plano_Usuario.push({
                id: proximoId(exp.dados.Plano_Usuario),
                idUsuarios: idU,
                idPlano_Assinatura: 1,
                idEndereco: idE,
                status: "ativo",
                dia_entrega: null, 
                dia_criacao_assinatura: agoraMySQL()
            });
        }

        salvarExport(exp);
    }

    function registrarPedido(itens, usuario) {
        var idU = registrarUsuario(usuario);
        var idE = registrarEndereco(idU, usuario);
        if (!idU) {
            return null;
        }

        
        var grupos = {};
        var ordem = [];
        itens.forEach(function (item) {
            var nome = String(item.nome).trim();
            if (!grupos[nome]) {
                grupos[nome] = { nome: nome, preco: precoNumero(item.preco), qtd: 0 };
                ordem.push(nome);
            }
            grupos[nome].qtd += 1;
        });

        var subtotal = 0;
        ordem.forEach(function (n) {
            subtotal += grupos[n].preco * grupos[n].qtd;
        });
        subtotal = Math.round(subtotal * 100) / 100;

        var exp = lerExport();
        var idPedido = proximoId(exp.dados.Pedidos);

        exp.dados.Pedidos.push({
            id: idPedido,
            uid: gerarUid(), 
            idUsuarios: idU,
            idEndereco: idE,
            status_pedido: "pendente",
            subtotal_pedido: subtotal,
            desconto_pedido: 0,
            frete: 0,
            total_pedido: subtotal,
            data_pedido: agoraMySQL()
        });

        ordem.forEach(function (n) {
            var g = grupos[n];
            var ehKit = KITS_ID.hasOwnProperty(n);
            var idCat = ehKit ? KITS_ID[n] : (PRODUTOS_ID.hasOwnProperty(n) ? PRODUTOS_ID[n] : null);

            exp.dados.Item_pedido.push({
                id: proximoId(exp.dados.Item_pedido),
                idPedidos: idPedido,
                tipo_item: ehKit ? "kit" : "produto",
                idKIT: ehKit ? idCat : null,
                idProdutos: ehKit ? null : idCat,
                preco_pedido: g.preco,
                quantidade_pedido: g.qtd,
                nome_item: n 
            });
        });

        salvarExport(exp);
        return idPedido;
    }

    
    window.MenuSweet = {
        exportarJSON: baixarJSON,
        verJSON: function () { return lerExport(); },
        limparExportacao: function () {
            try { localStorage.removeItem(CHAVE_EXPORT); } catch (erro) {}
        }
    };

    
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

                
                var emailPortao = valorDe("portao-email", "");
                var existente = lerUsuario();
                var usuario = existente && existente.email === emailPortao
                    ? existente
                    : { nome: emailPortao.split("@")[0], email: emailPortao };
                try {
                    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
                } catch (erro) {}

                marcarLogado();
                portao.style.display = "none";
                window.location.reload();
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
                    apt: valorDe("apt", ""),
                    bairro: valorDe("bairro", ""),
                    complemento: valorDe("complemento", "")
                };
               
                var senha = valorDe("senha", "");

                localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
                marcarLogado();

                var idU = registrarUsuario(usuario, senha);
                registrarEndereco(idU, usuario);
                baixarSeAutomatico();

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

                registrarAssinatura(usuario);
                baixarSeAutomatico();

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

                var idU = registrarUsuario(usuario);
                registrarEndereco(idU, usuario);
                baixarSeAutomatico();

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

                
                if (!usuario.rua) {
                    alert("Cadastre seu endereço no perfil para finalizar o pedido.");
                    window.location.href = "Perfilindex.html";
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

                
                registrarPedido(itens, usuario);

                localStorage.removeItem("carrinhoProdutos");

                renderizarCarrinho();
                baixarSeAutomatico();

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

            totalGeral += precoNumero(prod.preco);
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
