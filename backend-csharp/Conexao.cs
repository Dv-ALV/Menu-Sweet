using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text.RegularExpressions;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Admin_page
{
    internal class Conexao
    {
        public static string CaminhoJson = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "menusweet.json");

        public JObject LerJson()
        {
            if (!File.Exists(CaminhoJson))
            {
                throw new FileNotFoundException("Arquivo menusweet.json não encontrado em: " + CaminhoJson);
            }

            JsonSerializerSettings config = new JsonSerializerSettings
            {
                DateParseHandling = DateParseHandling.None,
                FloatParseHandling = FloatParseHandling.Decimal
            };
            return JsonConvert.DeserializeObject<JObject>(File.ReadAllText(CaminhoJson), config);
        }

        public void SalvarJson(JObject raiz)
        {
            File.WriteAllText(CaminhoJson, raiz.ToString());
        }

        private string NomeBanco(JToken c)
        {
            string banco = (string)c["banco"];
            if (banco == null || !Regex.IsMatch(banco, "^[A-Za-z0-9_]+$"))
            {
                throw new Exception("Nome de banco inválido no JSON.");
            }
            return banco;
        }

        private MySqlConnection Conectar()
        {
            JToken c = LerJson()["conexao"];
            if (c == null)
            {
                throw new Exception("O bloco \"conexao\" não existe no menusweet.json.");
            }

            MySqlConnectionStringBuilder sb = new MySqlConnectionStringBuilder
            {
                Server = (string)c["servidor"],
                Port = uint.Parse(c["porta"].ToString()),
                UserID = (string)c["usuario"],
                Password = (string)c["senha"] ?? "",
                Database = NomeBanco(c),
                CharacterSet = "utf8mb4",
                PersistSecurityInfo = false
            };

            MySqlConnection conn = new MySqlConnection(sb.ConnectionString);
            try
            {
                conn.Open();
                return conn;
            }
            catch (MySqlException ex)
            {
                conn.Dispose();
                throw new Exception($"Conexão NÃO estabelecida. Verifique se o MySQL está ligado e se o banco existe. \n\n{ex.Message}");
            }
        }

        public void ExecutarComando(string sql, params MySqlParameter[] parametros)
        {
            using (MySqlConnection conn = Conectar())
            using (MySqlCommand comando = new MySqlCommand(sql, conn))
            {
                comando.Parameters.AddRange(parametros);
                try
                {
                    comando.ExecuteNonQuery();
                }
                catch (MySqlException ex)
                {
                    throw new Exception($"Instrução SQL não executada. \n{sql}\n{ex.Message}");
                }
            }
        }

        // Executa vários comandos numa única transação: ou grava tudo, ou nada.
        public void ExecutarVarios(List<KeyValuePair<string, MySqlParameter[]>> comandos)
        {
            using (MySqlConnection conn = Conectar())
            using (MySqlTransaction transacao = conn.BeginTransaction())
            {
                string atual = "";
                try
                {
                    foreach (KeyValuePair<string, MySqlParameter[]> item in comandos)
                    {
                        atual = item.Key;
                        using (MySqlCommand comando = new MySqlCommand(item.Key, conn, transacao))
                        {
                            comando.Parameters.AddRange(item.Value);
                            comando.ExecuteNonQuery();
                        }
                    }
                    transacao.Commit();
                }
                catch (MySqlException ex)
                {
                    transacao.Rollback();
                    throw new Exception($"Nada foi gravado (rollback). \n{atual}\n{ex.Message}");
                }
            }
        }

        public DataTable ExecutarConsulta(string query, params MySqlParameter[] parametros)
        {
            using (MySqlConnection conn = Conectar())
            using (MySqlCommand comando = new MySqlCommand(query, conn))
            {
                comando.Parameters.AddRange(parametros);
                try
                {
                    DataTable dt = new DataTable();
                    using (MySqlDataAdapter dados = new MySqlDataAdapter(comando))
                    {
                        dados.Fill(dt);
                    }
                    return dt;
                }
                catch (MySqlException ex)
                {
                    throw new Exception($"Erro ao tentar executar instrução SELECT. \n{query} \n{ex.Message}");
                }
            }
        }
    }
}
