CREATE DATABASE IF NOT EXISTS menusweet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE menusweet;

CREATE TABLE IF NOT EXISTS Usuarios (
    id INT NOT NULL AUTO_INCREMENT,
    Nome VARCHAR(45) NOT NULL,
    Email VARCHAR(45) NOT NULL,
    Senha VARCHAR(45) NOT NULL,
    CPF VARCHAR(45) NOT NULL,
    Telefone VARCHAR(45),
    Cargo ENUM('cliente','administrador','atendente') NOT NULL DEFAULT 'cliente',
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY Email_UNIQUE (Email),
    UNIQUE KEY CPF_UNIQUE (CPF)
);

-- idUsuarios era BIGINT apontando para Usuarios.id (INT): o MySQL recusa a FK.
-- Corrigido para INT em Endereco, Plano_Usuario e Pedidos.
CREATE TABLE IF NOT EXISTS Endereco (
    id INT NOT NULL AUTO_INCREMENT,
    idUsuarios INT NOT NULL,
    Rua VARCHAR(45) NOT NULL,
    Numero VARCHAR(45) NOT NULL,
    Complemento VARCHAR(45),
    Bairro VARCHAR(45) NOT NULL,
    Cidade VARCHAR(45) NOT NULL,
    Estado VARCHAR(45) NOT NULL,
    CEP VARCHAR(9) NOT NULL,
    instrucao VARCHAR(45),
    endereco_padrao TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY fk_Usuarios_Endereco (idUsuarios),
    CONSTRAINT fk_Endereco_Usuarios FOREIGN KEY (idUsuarios)
        REFERENCES Usuarios (id)
);

CREATE TABLE IF NOT EXISTS Categorias (
    id INT NOT NULL AUTO_INCREMENT,
    nome_categoria VARCHAR(45) NOT NULL,
    descricao TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Produtos (
    id INT NOT NULL AUTO_INCREMENT,
    idCategoria INT NOT NULL,
    nome_produto VARCHAR(45) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    caloria DECIMAL(8,2),
    proteina DECIMAL(8,2),
    carboidratos DECIMAL(8,2),
    PRIMARY KEY (id),
    CONSTRAINT fk_Produtos_Categorias FOREIGN KEY (idCategoria)
        REFERENCES Categorias (id)
);

CREATE TABLE IF NOT EXISTS KIT (
    id INT NOT NULL AUTO_INCREMENT,
    nome_kit VARCHAR(45) NOT NULL,
    descricao_kit TEXT,
    preco_kit DECIMAL(10,2) NOT NULL,
    percentual_desconto DECIMAL(5,2) NOT NULL DEFAULT 0,
    imagem_kit VARCHAR(45),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS KIT_item (
    id INT NOT NULL AUTO_INCREMENT,
    idKIT INT NOT NULL,
    idProdutos INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    CONSTRAINT fk_KITitem_KIT FOREIGN KEY (idKIT)
        REFERENCES KIT (id),
    CONSTRAINT fk_KITitem_Produtos FOREIGN KEY (idProdutos)
        REFERENCES Produtos (id)
);

CREATE TABLE IF NOT EXISTS Plano_Assinatura (
    id INT NOT NULL AUTO_INCREMENT,
    nome_plano VARCHAR(45) NOT NULL,
    descricao_plano TEXT,
    tempo_plano ENUM('semanal','quinzenal','mensal') NOT NULL,
    desconto_assinante DECIMAL(5,2) NOT NULL DEFAULT 0,
    preco_plano DECIMAL(10,2) NOT NULL,
    atividade TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Plano_Usuario (
    id INT NOT NULL AUTO_INCREMENT,
    idUsuarios INT NOT NULL,
    idPlano_Assinatura INT NOT NULL,
    idEndereco INT NOT NULL,
    status ENUM('ativo','pausado','cancelado') NOT NULL DEFAULT 'ativo',
    dia_entrega ENUM('segunda','terca','quarta','quinta','sexta','sabado') NOT NULL,
    dia_criacao_assinatura TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_PlanoUsuario_Usuarios FOREIGN KEY (idUsuarios)
        REFERENCES Usuarios (id),
    CONSTRAINT fk_PlanoUsuario_Plano FOREIGN KEY (idPlano_Assinatura)
        REFERENCES Plano_Assinatura (id),
    CONSTRAINT fk_PlanoUsuario_Endereco FOREIGN KEY (idEndereco)
        REFERENCES Endereco (id)
);

CREATE TABLE IF NOT EXISTS Item_Assinatura (
    id INT NOT NULL AUTO_INCREMENT,
    idPlano_Usuario INT NOT NULL,
    tipo_item ENUM('produto','kit') NOT NULL,
    idProdutos INT NULL,
    idKIT INT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    CONSTRAINT fk_ItemAss_PlanoUsuario FOREIGN KEY (idPlano_Usuario)
        REFERENCES Plano_Usuario (id),
    CONSTRAINT fk_ItemAss_Produtos FOREIGN KEY (idProdutos)
        REFERENCES Produtos (id),
    CONSTRAINT fk_ItemAss_KIT FOREIGN KEY (idKIT)
        REFERENCES KIT (id)
);

CREATE TABLE IF NOT EXISTS Pedidos (
    id INT NOT NULL AUTO_INCREMENT,
    idUsuarios INT NOT NULL,
    idEndereco INT NOT NULL,
    status_pedido ENUM('pendente','pago','enviado','entregue','cancelado') NOT NULL DEFAULT 'pendente',
    subtotal_pedido DECIMAL(10,2) NOT NULL,
    desconto_pedido DECIMAL(10,2) NOT NULL DEFAULT 0,
    frete DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_pedido DECIMAL(10,2) NOT NULL,
    data_pedido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_Pedidos_Usuarios FOREIGN KEY (idUsuarios)
        REFERENCES Usuarios (id),
    CONSTRAINT fk_Pedidos_Endereco FOREIGN KEY (idEndereco)
        REFERENCES Endereco (id)
);

CREATE TABLE IF NOT EXISTS Item_pedido (
    id INT NOT NULL AUTO_INCREMENT,
    idPedidos INT NOT NULL,
    tipo_item ENUM('produto','kit') NOT NULL,
    idKIT INT NULL,
    idProdutos INT NULL,
    preco_pedido DECIMAL(10,2) NOT NULL,
    quantidade_pedido INT NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    CONSTRAINT fk_ItemPedido_Pedidos FOREIGN KEY (idPedidos)
        REFERENCES Pedidos (id),
    CONSTRAINT fk_ItemPedido_KIT FOREIGN KEY (idKIT)
        REFERENCES KIT (id),
    CONSTRAINT fk_ItemPedido_Produtos FOREIGN KEY (idProdutos)
        REFERENCES Produtos (id)
);
