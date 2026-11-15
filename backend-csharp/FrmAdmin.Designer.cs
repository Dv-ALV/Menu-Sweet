namespace Admin_page
{
    partial class FrmAdmin
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.picLogo = new System.Windows.Forms.PictureBox();
            this.lblTitulo = new System.Windows.Forms.Label();
            this.lblPagina = new System.Windows.Forms.Label();
            this.dtgDados = new System.Windows.Forms.DataGridView();
            this.btnAssinantes = new System.Windows.Forms.Button();
            this.btnEntregador = new System.Windows.Forms.Button();
            this.btnPedidos = new System.Windows.Forms.Button();
            this.btnClientes = new System.Windows.Forms.Button();
            this.btnEstoque = new System.Windows.Forms.Button();
            this.btnDeletar = new System.Windows.Forms.Button();
            this.btnAlterar = new System.Windows.Forms.Button();
            this.btnSair = new System.Windows.Forms.Button();
            this.btnImportar = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.picLogo)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.dtgDados)).BeginInit();
            this.SuspendLayout();
            // 
            // picLogo
            // 
            this.picLogo.Image = global::Admin_page.Properties.Resources.o__10__removebg_preview;
            this.picLogo.Location = new System.Drawing.Point(12, 12);
            this.picLogo.Name = "picLogo";
            this.picLogo.Size = new System.Drawing.Size(252, 141);
            this.picLogo.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.picLogo.TabIndex = 1;
            this.picLogo.TabStop = false;
            // 
            // lblTitulo
            // 
            this.lblTitulo.AutoSize = true;
            this.lblTitulo.Font = new System.Drawing.Font("Showcard Gothic", 36F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblTitulo.ForeColor = System.Drawing.Color.RoyalBlue;
            this.lblTitulo.Location = new System.Drawing.Point(384, 31);
            this.lblTitulo.Name = "lblTitulo";
            this.lblTitulo.Size = new System.Drawing.Size(416, 60);
            this.lblTitulo.TabIndex = 2;
            this.lblTitulo.Text = "ADMINISTRADOR";
            // 
            // lblPagina
            // 
            this.lblPagina.AutoSize = true;
            this.lblPagina.Font = new System.Drawing.Font("Showcard Gothic", 26.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblPagina.ForeColor = System.Drawing.Color.HotPink;
            this.lblPagina.Location = new System.Drawing.Point(519, 91);
            this.lblPagina.Name = "lblPagina";
            this.lblPagina.Size = new System.Drawing.Size(145, 44);
            this.lblPagina.TabIndex = 3;
            this.lblPagina.Text = "PAGINA";
            // 
            // dtgDados
            // 
            this.dtgDados.AllowUserToAddRows = false;
            this.dtgDados.AllowUserToDeleteRows = false;
            this.dtgDados.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.AllCells;
            this.dtgDados.BackgroundColor = System.Drawing.SystemColors.ButtonFace;
            this.dtgDados.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dtgDados.Location = new System.Drawing.Point(12, 175);
            this.dtgDados.Name = "dtgDados";
            this.dtgDados.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.dtgDados.Size = new System.Drawing.Size(788, 294);
            this.dtgDados.TabIndex = 4;
            // 
            // btnAssinantes
            // 
            this.btnAssinantes.BackColor = System.Drawing.SystemColors.Control;
            this.btnAssinantes.Font = new System.Drawing.Font("Showcard Gothic", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnAssinantes.Location = new System.Drawing.Point(809, 184);
            this.btnAssinantes.Name = "btnAssinantes";
            this.btnAssinantes.Size = new System.Drawing.Size(134, 33);
            this.btnAssinantes.TabIndex = 6;
            this.btnAssinantes.Text = "ASSINANTES";
            this.btnAssinantes.UseVisualStyleBackColor = false;
            this.btnAssinantes.Click += new System.EventHandler(this.btnAssinantes_Click);
            // 
            // btnEntregador
            // 
            this.btnEntregador.BackColor = System.Drawing.SystemColors.Control;
            this.btnEntregador.Font = new System.Drawing.Font("Showcard Gothic", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnEntregador.Location = new System.Drawing.Point(809, 305);
            this.btnEntregador.Name = "btnEntregador";
            this.btnEntregador.Size = new System.Drawing.Size(134, 33);
            this.btnEntregador.TabIndex = 10;
            this.btnEntregador.Text = "ENTREGADOR";
            this.btnEntregador.UseVisualStyleBackColor = false;
            this.btnEntregador.Click += new System.EventHandler(this.btnEntregador_Click);
            // 
            // btnPedidos
            // 
            this.btnPedidos.BackColor = System.Drawing.SystemColors.Control;
            this.btnPedidos.Font = new System.Drawing.Font("Showcard Gothic", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnPedidos.Location = new System.Drawing.Point(809, 246);
            this.btnPedidos.Name = "btnPedidos";
            this.btnPedidos.Size = new System.Drawing.Size(134, 33);
            this.btnPedidos.TabIndex = 9;
            this.btnPedidos.Text = "PEDIDOS";
            this.btnPedidos.UseVisualStyleBackColor = false;
            this.btnPedidos.Click += new System.EventHandler(this.btnPedidos_Click);
            // 
            // btnClientes
            // 
            this.btnClientes.BackColor = System.Drawing.SystemColors.Control;
            this.btnClientes.Font = new System.Drawing.Font("Showcard Gothic", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnClientes.Location = new System.Drawing.Point(809, 424);
            this.btnClientes.Name = "btnClientes";
            this.btnClientes.Size = new System.Drawing.Size(134, 33);
            this.btnClientes.TabIndex = 12;
            this.btnClientes.Text = "CLIENTES";
            this.btnClientes.UseVisualStyleBackColor = false;
            this.btnClientes.Click += new System.EventHandler(this.btnClientes_Click);
            // 
            // btnEstoque
            // 
            this.btnEstoque.BackColor = System.Drawing.SystemColors.Control;
            this.btnEstoque.Font = new System.Drawing.Font("Showcard Gothic", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnEstoque.Location = new System.Drawing.Point(809, 365);
            this.btnEstoque.Name = "btnEstoque";
            this.btnEstoque.Size = new System.Drawing.Size(134, 33);
            this.btnEstoque.TabIndex = 11;
            this.btnEstoque.Text = "ESTOQUE";
            this.btnEstoque.UseVisualStyleBackColor = false;
            this.btnEstoque.Click += new System.EventHandler(this.btnEstoque_Click);
            // 
            // btnDeletar
            // 
            this.btnDeletar.BackColor = System.Drawing.SystemColors.Control;
            this.btnDeletar.Font = new System.Drawing.Font("Showcard Gothic", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnDeletar.Location = new System.Drawing.Point(12, 501);
            this.btnDeletar.Name = "btnDeletar";
            this.btnDeletar.Size = new System.Drawing.Size(134, 33);
            this.btnDeletar.TabIndex = 13;
            this.btnDeletar.Text = "DELETAR";
            this.btnDeletar.UseVisualStyleBackColor = false;
            this.btnDeletar.Click += new System.EventHandler(this.btnDeletar_Click);
            // 
            // btnAlterar
            // 
            this.btnAlterar.BackColor = System.Drawing.SystemColors.Control;
            this.btnAlterar.Font = new System.Drawing.Font("Showcard Gothic", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnAlterar.Location = new System.Drawing.Point(194, 501);
            this.btnAlterar.Name = "btnAlterar";
            this.btnAlterar.Size = new System.Drawing.Size(134, 33);
            this.btnAlterar.TabIndex = 14;
            this.btnAlterar.Text = "ALTERAR";
            this.btnAlterar.UseVisualStyleBackColor = false;
            this.btnAlterar.Click += new System.EventHandler(this.btnAlterar_Click);
            // 
            // btnSair
            // 
            this.btnSair.BackColor = System.Drawing.SystemColors.Control;
            this.btnSair.Font = new System.Drawing.Font("Showcard Gothic", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnSair.Location = new System.Drawing.Point(666, 501);
            this.btnSair.Name = "btnSair";
            this.btnSair.Size = new System.Drawing.Size(134, 33);
            this.btnSair.TabIndex = 15;
            this.btnSair.Text = "SAIR";
            this.btnSair.UseVisualStyleBackColor = false;
            this.btnSair.Click += new System.EventHandler(this.btnSair_Click);
            // 
            // btnImportar
            // 
            this.btnImportar.BackColor = System.Drawing.SystemColors.Control;
            this.btnImportar.Font = new System.Drawing.Font("Showcard Gothic", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnImportar.Location = new System.Drawing.Point(397, 501);
            this.btnImportar.Name = "btnImportar";
            this.btnImportar.Size = new System.Drawing.Size(200, 33);
            this.btnImportar.TabIndex = 17;
            this.btnImportar.Text = "IMPORTAR JSON";
            this.btnImportar.UseVisualStyleBackColor = false;
            this.btnImportar.Click += new System.EventHandler(this.btnImportar_Click);
            // 
            // FrmAdmin
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(955, 562);
            this.Controls.Add(this.btnImportar);
            this.Controls.Add(this.btnSair);
            this.Controls.Add(this.btnAlterar);
            this.Controls.Add(this.btnDeletar);
            this.Controls.Add(this.btnClientes);
            this.Controls.Add(this.btnEstoque);
            this.Controls.Add(this.btnEntregador);
            this.Controls.Add(this.btnPedidos);
            this.Controls.Add(this.btnAssinantes);
            this.Controls.Add(this.dtgDados);
            this.Controls.Add(this.lblPagina);
            this.Controls.Add(this.lblTitulo);
            this.Controls.Add(this.picLogo);
            this.Name = "FrmAdmin";
            this.Text = "Administrador - Menu Sweet";
            this.Load += new System.EventHandler(this.FrmAdmin_Load);
            ((System.ComponentModel.ISupportInitialize)(this.picLogo)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.dtgDados)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.PictureBox picLogo;
        private System.Windows.Forms.Label lblTitulo;
        private System.Windows.Forms.Label lblPagina;
        private System.Windows.Forms.DataGridView dtgDados;
        private System.Windows.Forms.Button btnAssinantes;
        private System.Windows.Forms.Button btnEntregador;
        private System.Windows.Forms.Button btnPedidos;
        private System.Windows.Forms.Button btnClientes;
        private System.Windows.Forms.Button btnEstoque;
        private System.Windows.Forms.Button btnDeletar;
        private System.Windows.Forms.Button btnAlterar;
        private System.Windows.Forms.Button btnSair;
        private System.Windows.Forms.Button btnImportar;
    }
}