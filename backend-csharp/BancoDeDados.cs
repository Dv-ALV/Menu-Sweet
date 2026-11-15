using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using MySql.Data.MySqlClient;
using Newtonsoft.Json.Linq;

namespace Admin_page
{
    internal class BancoDeDados
    {
        Conexao db = new Conexao();

        public int ImportarJson(bool forcar)
        {
            JObject raiz = db.LerJson();

            if (!forcar && (raiz["importar"] == null || !(bool)raiz["importar"]))
            {
                return 0;
            }

            JObject dados = raiz["dados"] as JObject;
            if (dados == null)
            {
                throw new Exception("O bloco \"dados\" não existe no menusweet.json.");
            }

            // Monta todos os comandos primeiro (valida o JSON inteiro antes de tocar no banco).
            List<KeyValuePair<string, MySqlParameter[]>> comandos = new List<KeyValuePair<string, MySqlParameter[]>>();

            foreach (JProperty tabela in dados.Properties())
            {
                if (!Tabela.NomeValido(tabela.Name))
                {
                    throw new Exception($"Tabela desconhecida no JSON: {tabela.Name}");
                }

                foreach (JObject registro in tabela.Value)
                {
                    comandos.Add(MontarInsercao(tabela.Name, registro));
                }
            }

            // Tudo numa transação: se um registro falhar, nada é gravado.
            db.ExecutarVarios(comandos);

            raiz["importar"] = false;
            db.SalvarJson(raiz);
            return comandos.Count;
        }

        private KeyValuePair<string, MySqlParameter[]> MontarInsercao(string tabela, JObject registro)
        {
            List<string> colunas = new List<string>();
            List<MySqlParameter> parametros = new List<MySqlParameter>();

            foreach (JProperty campo in registro.Properties())
            {
                // Aceita maiúsculas (ex.: idCategoria) e minúsculas.
                if (!Regex.IsMatch(campo.Name, "^[A-Za-z_][A-Za-z0-9_]*$"))
                {
                    throw new Exception($"Nome de coluna inválido no JSON: {campo.Name}");
                }

                JValue valor = campo.Value as JValue;
                if (valor == null)
                {
                    throw new Exception($"O campo \"{campo.Name}\" em {tabela} deve ser um valor simples (texto, número, true/false ou null).");
                }

                colunas.Add(campo.Name);
                parametros.Add(new MySqlParameter("@" + campo.Name, valor.Value ?? DBNull.Value));
            }

            string nomes = string.Join(", ", colunas.Select(c => $"`{c}`"));
            string valores = string.Join(", ", colunas.Select(c => "@" + c));
            string atualizar = string.Join(", ", colunas.Select(c => $"`{c}` = VALUES(`{c}`)"));

            string inserir = $"INSERT INTO `{tabela}` ({nomes}) VALUES ({valores}) ON DUPLICATE KEY UPDATE {atualizar};";
            return new KeyValuePair<string, MySqlParameter[]>(inserir, parametros.ToArray());
        }
    }
}
