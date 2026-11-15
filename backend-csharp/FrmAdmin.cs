using System;
using System.Data;
using System.Windows.Forms;

namespace Admin_page
{
    public partial class FrmAdmin : Form
    {
        public FrmAdmin()
        {
            InitializeComponent();
        }

        Tabela objTabela = new Tabela();
        DataTable dados;
        BancoDeDados objBanco = new BancoDeDados();

        private void FrmAdmin_Load(object sender, EventArgs e)
        {
            MostrarDados("clientes");
        }

        private bool TemAlteracaoPendente()
        {
            if (dados == null)
            {
                return false;
            }

            dtgDados.EndEdit();
            BindingContext[dados].EndCurrentEdit();
            return dados.GetChanges(DataRowState.Modified) != null;
        }

        private void MostrarDados(string nomeTabela)
        {
            if (TemAlteracaoPendente())
            {
                DialogResult resposta = MessageBox.Show("Há alterações não salvas. Descartar e continuar?",
                                                        "Atenção", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
                if (resposta == DialogResult.No)
                {
                    return;
                }
            }

            try
            {
                objTabela.SetNome(nomeTabela);
                dados = objTabela.ListarRegistros();
                dtgDados.DataSource = dados;
                dtgDados.Columns["id"].ReadOnly = true;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Erro ao carregar");
            }
        }

        
        private void btnClientes_Click(object sender, EventArgs e)
        {
            MostrarDados("Usuarios");
        }

        
        private void btnPedidos_Click(object sender, EventArgs e)
        {
            MostrarDados("Pedidos");
        }

        
        private void btnEstoque_Click(object sender, EventArgs e)
        {
            MostrarDados("Produtos");
        }

        
        private void btnAssinaturas_Click(object sender, EventArgs e)
        {
            MostrarDados("Plano_Assinatura");
        }

        
        private void btnCategorias_Click(object sender, EventArgs e)
        {
            MostrarDados("Categorias");
        }

        private void btnKits_Click(object sender, EventArgs e)
        {
            MostrarDados("KIT");
        }

        private void btnAlterar_Click(object sender, EventArgs e)
        {
            if (!TemAlteracaoPendente())
            {
                MessageBox.Show("Nenhuma alteração para salvar. Edite uma célula e clique em ALTERAR.");
                return;
            }

            try
            {
                DataTable alteradas = dados.GetChanges(DataRowState.Modified);

                foreach (DataRow linha in alteradas.Rows)
                {
                    objTabela.AlterarRegistro(linha);
                }

                dados.AcceptChanges();
                MessageBox.Show("Os dados foram ALTERADOS na base de dados");
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Não foi possível salvar");
            }
        }

        private void btnDeletar_Click(object sender, EventArgs e)
        {
            if (dtgDados.CurrentRow == null)
            {
                MessageBox.Show("Selecione uma linha para deletar.");
                return;
            }

            DialogResult resposta = MessageBox.Show("Deseja realmente EXCLUIR o registro selecionado?",
                                                    "Confirmar exclusão", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);
            if (resposta == DialogResult.No)
            {
                return;
            }

            try
            {
                int idRegistro = Convert.ToInt32(dtgDados.CurrentRow.Cells["id"].Value);
                objTabela.SetId(idRegistro);
                objTabela.ExcluirRegistro();
                MessageBox.Show("Os dados foram EXCLUIDOS da base de dados");
                MostrarDados(objTabela.GetNome());
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Não foi possível excluir");
            }
        }

        private void btnSair_Click(object sender, EventArgs e)
        {
            this.Close();
        }
    }
}
