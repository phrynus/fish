import { mysql, sqlite } from "@/config";

type Apptype = {
  name?: string;
  description?: string;
  app_key?: string;
  is_status?: number;
  config?: any;
};
type Userstype = {
  username?: string;
  password?: string;
  email?: string;
  status?: number;
  reg_ip?: any;
  reg_mac?: any;
};

// 不合规SQL的正则表达式
const sqlPatterns: { pattern: RegExp; message: string }[] = [
  { pattern: /\bDROP\s+TABLE\b/i, message: "禁止使用 DROP TABLE" },
  { pattern: /\bDELETE\s+FROM\b\s+\w+\s*(?!WHERE)/i, message: "DELETE 语句缺少 WHERE 子句" },
  { pattern: /\bTRUNCATE\s+TABLE\b/i, message: "禁止使用 TRUNCATE TABLE" },
  { pattern: /(--|\bOR\b|\bAND\b)\s+.+\s*=\s*.+/i, message: "可能存在简单 SQL 注入" },
  { pattern: /\bINFORMATION_SCHEMA\b/i, message: "禁止访问系统表 INFORMATION_SCHEMA" },
  { pattern: /;\s*--/, message: "检测到分号后包含注释，可能存在 SQL 注入" },
  { pattern: /(UNION\s+SELECT|INSERT\s+INTO\s+\w+\s+VALUES\s*\(.*\)\s*;)/i, message: "可能存在复杂 SQL 注入" }
];

// 通用的 SQL 执行方法
async function executeQuery<T>(sql: string, params: any[] = []): Promise<T | null> {
  try {
    // 检查 SQL 语句是否合规
    sqlPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(sql)) throw new Error(message);
    });
    const [result] = await mysql.execute(sql, params);
    return result as T;
  } catch (error: any) {
    console.error(`SQL Error: ${error.message}`, { sql, params });
    throw new Error(`SQL Execution Failed: ${error.message}`);
  }
}
// 通用的更新方法
async function dynamicUpdate<T>(
  tableName: string,
  id: string,
  data: Partial<T>,
  allowedFields: string[]
): Promise<unknown | null> {
  const fields: string[] = [];
  const params: any[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (allowedFields.includes(key) && value !== undefined) {
      fields.push(`${key} = ?`);
      params.push(value);
    }
  }

  if (fields.length === 0) return null;

  const sql = `UPDATE ${tableName} SET ${fields.join(", ")} WHERE id = ?`;
  params.push(id);
  return await executeQuery(sql, params);
}

export const mysqlModels = {
  Apps: {
    name: "apps", // 表名

    /**
     * 向 `apps` 表中添加一条新记录。
     * @param app - 包含新应用属性的对象。
     * @returns 插入操作的结果或 null。
     */
    async add(app: Apptype): Promise<unknown | null> {
      const sql = `INSERT INTO ${this.name} (name, description, app_key, is_status, config) VALUES (?, ?, ?, ?, ?)`;
      const params = [app.name, app.description, app.app_key, app.is_status, app.config];
      const result = await executeQuery(sql, params);
      return result || null;
    },

    /**
     * 根据 ID 删除 `apps` 表中的一条记录。
     * @param app_id - 要删除的应用 ID。
     * @returns 删除操作的结果或 null。
     */
    async delete(app_id: string): Promise<unknown | null> {
      const sql = `DELETE FROM ${this.name} WHERE id = ?`;
      const result = await executeQuery(sql, [app_id]);
      return result || null;
    },

    /**
     * 更新 `apps` 表中的记录。
     * @param app_id - 要更新的应用 ID。
     * @param app - 包含要更新的字段及其值的对象。
     * @returns 更新操作的结果或 null。
     */
    async update(app_id: string, app: Apptype): Promise<unknown | null> {
      const allowedFields = ["name", "description", "app_key", "is_status", "config"];
      return await dynamicUpdate(this.name, app_id, app, allowedFields);
    },

    /**
     * 根据 ID 获取 `apps` 表中的一条记录。
     * @param app_id - 要查询的应用 ID。
     * @returns 查询到的应用对象或 null。
     */
    async getId(app_id: string): Promise<Apptype | null> {
      const sql = `SELECT * FROM ${this.name} WHERE id = ?`;
      const result = await executeQuery<Apptype[]>(sql, [app_id]);
      return result?.[0] || null;
    },

    /**
     * 根据应用密钥获取 `apps` 表中的一条记录。
     * @param app_key - 应用密钥。
     * @returns 查询到的应用对象或 null。
     */
    async getKey(app_key: string): Promise<Apptype | null> {
      const sql = `SELECT * FROM ${this.name} WHERE app_key = ?`;
      const result = await executeQuery<Apptype[]>(sql, [app_key]);
      return result?.[0] || null;
    },

    /**
     * 分页获取 `apps` 表中的记录。
     * @param num - 每页的记录数量，默认值为 10。
     * @param page - 页码，默认值为 1。
     * @returns 查询到的应用对象数组或 null。
     */
    async getAll(num: number = 10, page: number = 1): Promise<Apptype[] | null> {
      const offset = (page - 1) * num;
      const sql = `SELECT * FROM ${this.name} LIMIT ? OFFSET ?`;
      const result = await executeQuery<Apptype[]>(sql, [String(num), String(offset)]);
      return result || null;
    },

    /**
     * 执行自定义 SQL 查询。
     * @param select - 要查询的字段数组。
     * @param query - 查询条件字符串。
     * @returns 查询结果数组或 null。
     */
    async sql(select: string[], query: string): Promise<Userstype[] | null> {
      const sql = `SELECT ${select.join(", ")} FROM ${this.name} ${query}`;
      const result = await executeQuery<Userstype[]>(sql);
      return result || null;
    }
  },
  Users: {
    name: "users", // 表名

    /**
     * 向 `users` 表中添加一条新记录。
     * @param user - 包含新用户属性的对象。
     * @returns 插入操作的结果或 null。
     */
    async add(user: Userstype): Promise<unknown | null> {
      const sql = `INSERT INTO ${this.name} (username, password, email, status, reg_ip, reg_mac) VALUES (?, ?, ?, ?, ?, ?)`;
      const params = [user.username, user.password, user.email, user.status, user.reg_ip, user.reg_mac];
      const result = await executeQuery<{ insertId: number }>(sql, params);
      return result?.insertId || null;
    },

    /**
     * 根据 ID 删除 `users` 表中的一条记录。
     * @param user_id - 要删除的用户 ID。
     * @returns 删除操作的结果或 null。
     */
    async delete(user_id: string): Promise<unknown | null> {
      const sql = `DELETE FROM ${this.name} WHERE id = ?`;
      const result = await executeQuery(sql, [user_id]);
      return result || null;
    },

    /**
     * 更新 `users` 表中的记录。
     * @param user_id - 要更新的用户 ID。
     * @param user - 包含要更新的字段及其值的对象。
     * @returns 更新操作的结果或 null。
     */
    async update(user_id: string, user: Userstype): Promise<unknown | null> {
      const allowedFields = ["username", "password", "email", "status", "reg_ip", "reg_mac"];
      return await dynamicUpdate(this.name, user_id, user, allowedFields);
    },

    /**
     * 根据 ID 获取 `users` 表中的一条记录。
     * @param user_id - 要查询的用户 ID。
     * @returns 查询到的用户对象或 null。
     */
    async getId(user_id: string): Promise<Userstype | null> {
      const sql = `SELECT * FROM ${this.name} WHERE id = ?`;
      const result = await executeQuery<Userstype[]>(sql, [user_id]);
      return result?.[0] || null;
    },

    /**
     * 分页获取 `users` 表中的记录。
     * @param num - 每页的记录数量，默认值为 10。
     * @param page - 页码，默认值为 1。
     * @returns 查询到的用户对象数组或 null。
     */
    async getAll(num: number = 10, page: number = 1): Promise<Userstype[] | null> {
      const offset = (page - 1) * num;
      const sql = `SELECT * FROM ${this.name} LIMIT ? OFFSET ?`;
      const result = await executeQuery<Userstype[]>(sql, [String(num), String(offset)]);
      return result || null;
    },

    /**
     * 根据邮箱获取 `users` 表中的一条记录。
     * @param email - 用户邮箱。
     * @returns 查询到的用户对象或 null。
     */
    async getEmail(email: string): Promise<Userstype | null> {
      const sql = `SELECT * FROM ${this.name} WHERE email = ?`;
      const result = await executeQuery<Userstype[]>(sql, [email]);
      return result?.[0] || null;
    },

    /**
     * 根据用户名获取 `users` 表中的一条记录。
     * @param username - 用户名。
     * @returns 查询到的用户对象或 null。
     */
    async getUsername(username: string): Promise<Userstype | null> {
      const sql = `SELECT * FROM ${this.name} WHERE username = ?`;
      const result = await executeQuery<Userstype[]>(sql, [username]);
      return result?.[0] || null;
    },

    /**
     * 执行自定义 SQL 查询。
     * @param select - 要查询的字段数组。
     * @param query - 查询条件字符串。
     * @returns 查询结果数组或 null。
     */
    async sql(select: string[], query: string): Promise<Userstype[] | null> {
      const sql = `SELECT ${select.join(", ")} FROM ${this.name} ${query}`;
      const result = await executeQuery<Userstype[]>(sql);
      return result || null;
    }
  }
};
