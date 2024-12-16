import { mysql, sqlite } from "@/config";

type Apptype = {
  name: string;
  description: string;
  app_key: string;
  is_status: boolean;
  config: any;
};
type Userstype = {
  username: string;
  password: string;
  email: string;
  status: number;
  reg_ip: any;
  reg_mac: any;
};
// 通用的 SQL 执行方法
async function executeQuery<T>(sql: string, params: any[] = []): Promise<T | null> {
  try {
    const [result] = await mysql.execute(sql, params);
    return result as T;
  } catch (error: any) {
    console.error(`SQL Error: ${error.message}`, { sql, params });
    throw error.message;
  }
}

export const mysqlModels = {
  Apps: {
    name: "apps", // 表名
    async add(app: Apptype): Promise<unknown | null> {
      const sql = `INSERT INTO ${this.name} (name, description, app_key, is_status, config) VALUES (?, ?, ?, ?, ?)`;
      const params = [app.name, app.description, app.app_key, app.is_status, app.config];
      const result = await executeQuery(sql, params);
      return result || null;
    },
    async delete(app_id: number): Promise<unknown | null> {
      const sql = `DELETE FROM ${this.name} WHERE id = ?`;
      const result = await executeQuery(sql, [app_id]);
      return result || null;
    },
    async update(app_id: number, app: Apptype): Promise<unknown | null> {
      const sql = `UPDATE ${this.name} SET name = ?, description = ?, app_key = ?, is_status = ?, config = ? WHERE id = ?`;
      const params = [app.name, app.description, app.app_key, app.is_status, app.config, app_id];
      const result = await executeQuery(sql, params);
      return result || null;
    },
    async getId(app_id: number): Promise<Apptype | null> {
      const sql = `SELECT * FROM ${this.name} WHERE id = ?`;
      const result = await executeQuery<Apptype[]>(sql, [app_id]);
      return result?.[0] || null;
    },
    async getKey(app_key: string): Promise<Apptype | null> {
      const sql = `SELECT * FROM ${this.name} WHERE app_key = ?`;
      const result = await executeQuery<Apptype[]>(sql, [app_key]);
      return result?.[0] || null;
    },
    async getAll(num: number = 10, page: number = 0): Promise<Apptype[] | null> {
      const sql = `SELECT * FROM ${this.name} LIMIT ? OFFSET ?`;
      const result = await executeQuery<Apptype[]>(sql, [num, page]);
      return result || null;
    }
  },
  Users: {
    name: "users", // 表名
    async add(user: Userstype): Promise<unknown | null> {
      const sql = `INSERT INTO ${this.name} (username, password, email, status, reg_ip, reg_mac) VALUES (?, ?, ?, ?, ?, ?)`;
      const params = [user.username, user.password, user.email, user.status, user.reg_ip, user.reg_mac];
      const result = await executeQuery<{ insertId: number }>(sql, params);
      return result?.insertId || null;
    }
  }
};
