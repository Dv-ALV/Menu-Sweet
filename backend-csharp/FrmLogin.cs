using System;
using System.Windows.Forms;

namespace Admin_page
{
    public partial class FrmLogin : Form
    {
        public FrmLogin()
        {
            InitializeComponent();
        }

        BancoDeDados objBanco = new BancoDeDados();

        private void FrmLogin_Load(object sender, EventArgs e)
        {
            try
            {
                int qtd = objBanco.ImportarJson(false);

                if (qtd > 0)
                {
                    MessageBox.Show($"{qtd} registro(s) importado(s) do JSON para o banco.");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Erro ao importar o JSON");
            }
        }

        private void btnEntrar_Click(object sender, EventArgs e)
        {
            if (txtUsuario.Text == "admin" && txtSenha.Text == "admin")
            {
                FrmAdmin telaAdmin = new FrmAdmin();
                Hide();
                telaAdmin.ShowDialog();
                Close();
            }
            else
            {
                MessageBox.Show("Usuário ou senha incorretos!", "Erro");
                txtSenha.Clear();
                txtSenha.Focus();
            }
        }
    }
}
