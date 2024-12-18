-- 管理员表
-- CREATE TABLE admins (
--     id INT AUTO_INCREMENT PRIMARY KEY COMMENT '管理员唯一标识',
--     username VARCHAR(150) NOT NULL UNIQUE COMMENT '管理员用户名',
--     password CHAR(60) NOT NULL COMMENT '加密后的密码',
--     email VARCHAR(255) NOT NULL UNIQUE COMMENT '邮箱地址',
--     status TINYINT NOT NULL DEFAULT 1 COMMENT '管理员状态: 1(激活), 0(禁用)',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
--     deleted_at TIMESTAMP DEFAULT NULL COMMENT '删除时间，NULL表示未删除',
--     INDEX idx_email (email)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

-- 用户表
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户唯一标识',
    uuid CHAR(36) NOT NULL UNIQUE COMMENT '用户UUID',
    username VARCHAR(150) NOT NULL UNIQUE COMMENT '用户名',
    password CHAR(64) NOT NULL COMMENT '加密后的密码 SHA256',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT '邮箱地址',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '用户状态: 1(激活), 0(禁用)',
    reg_ip VARCHAR(45) DEFAULT NULL COMMENT '注册IP',
    reg_mac VARCHAR(255) DEFAULT NULL COMMENT '注册设备',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP DEFAULT NULL COMMENT '删除时间，NULL表示未删除',
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户表';


-- 应用表
CREATE TABLE apps (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '应用唯一标识',
    uuid CHAR(36) NOT NULL UNIQUE COMMENT '用户UUID',
    name VARCHAR(150) NOT NULL UNIQUE COMMENT '应用名称',
    description VARCHAR(500) DEFAULT NULL COMMENT '应用描述',
    app_key CHAR(64) NOT NULL UNIQUE COMMENT '应用密钥 SHA256',
    is_status TINYINT NOT NULL DEFAULT 1 COMMENT '是否启用应用', 
    config JSON DEFAULT NULL COMMENT '应用全局配置（如注册开关、登录开关等）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP DEFAULT NULL COMMENT '删除时间，NULL表示未删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='应用表';

-- 应用_角色表
CREATE TABLE apps_role (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '记录唯一标识',
    app_id INT NOT NULL COMMENT '关联的应用ID',
    role_id INT NOT NULL COMMENT '角色ID',
    permissions TEXT DEFAULT NULL COMMENT '角色特权配置',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    INDEX idx_app_role (app_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='应用角色表';

-- 应用_版本表
CREATE TABLE apps_version (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '记录唯一标识',
    app_id INT NOT NULL COMMENT '关联的应用ID',
    version VARCHAR(50) NOT NULL COMMENT '版本号',
    description VARCHAR(255) DEFAULT NULL COMMENT '版本描述',
    encryption JSON DEFAULT NULL COMMENT '加密配置',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '版本状态: 1(启用), 0(禁用)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    INDEX idx_app_version (app_id, version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='应用版本表';

-- 应用_商品表
CREATE TABLE apps_products (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '商品唯一标识',
    app_id INT NOT NULL COMMENT '关联的应用ID',
    name VARCHAR(150) NOT NULL COMMENT '商品名称',
    description TEXT DEFAULT NULL COMMENT '商品描述',
    price DECIMAL(15, 2) NOT NULL COMMENT '商品价格',
    stock INT DEFAULT 0 COMMENT '库存数量',
    type TINYINT NOT NULL DEFAULT 1 COMMENT '商品类型: 1(角色), 2(积分), 3(机器码), 4(卡密)',
    config JSON DEFAULT NULL COMMENT '商品配置',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    INDEX idx_app_product (app_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='应用商品表';

-- 应用_支付方式表
CREATE TABLE apps_payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '支付方式唯一标识',
    app_id INT NOT NULL COMMENT '关联的应用ID',
    name VARCHAR(150) NOT NULL COMMENT '支付方式名称',
    config JSON DEFAULT NULL COMMENT '支付方式配置（如：API密钥、回调地址等）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP DEFAULT NULL COMMENT '删除时间，NULL表示未删除',
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    UNIQUE KEY idx_app_name (app_id, name) COMMENT '应用ID与支付方式名称的联合唯一约束'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='支付方式表';


-- 应用_订单表
CREATE TABLE apps_orders (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '订单唯一标识',
    order_no VARCHAR(100) NOT NULL UNIQUE COMMENT '订单号',
    app_id INT NOT NULL COMMENT '关联的应用ID',
    user_id INT NOT NULL COMMENT '关联的用户ID',
    product_id INT NOT NULL COMMENT '关联的商品ID',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '订单状态: 1(待支付), 2(已支付), 3(已取消)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES apps_products(id) ON DELETE CASCADE,
    INDEX idx_order_user (app_id, user_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='应用订单表';

-- 应用_卡密模版表
CREATE TABLE apps_card_type (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '卡密模版唯一标识',
    app_id INT NOT NULL COMMENT '应用ID',
    name VARCHAR(150) NOT NULL COMMENT '卡密模版名称',
    description TEXT DEFAULT NULL COMMENT '卡密模版描述',
    type TINYINT NOT NULL DEFAULT 1 COMMENT '卡密模版类型: 1(角色), 2(积分), 3(机器码)',
    config JSON DEFAULT NULL COMMENT '卡密模版配置（JSON格式）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP DEFAULT NULL COMMENT '删除时间，NULL表示未删除',
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    INDEX idx_app_type (app_id, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='卡密模版表';

-- 应用_卡密表
CREATE TABLE apps_cards (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '卡密唯一标识',
    app_id INT NOT NULL COMMENT '关联的应用ID',
    card_type_id INT NOT NULL COMMENT '卡密模版ID',
    card_no CHAR(64) NOT NULL UNIQUE COMMENT '卡密号',
    remark TEXT DEFAULT NULL COMMENT '备注信息',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '卡密状态: 1(未使用), 2(已使用), 3(已过期)',
    expire_at TIMESTAMP DEFAULT NULL COMMENT '到期时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP DEFAULT NULL COMMENT '删除时间，NULL表示未删除',
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (card_type_id) REFERENCES apps_card_type(id) ON DELETE CASCADE,
    INDEX idx_card_app_type (app_id, card_type_id),
    INDEX idx_card_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='卡密表';


-- 用户_应用内容表
CREATE TABLE users_apps_config (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '记录唯一标识',
    app_id INT NOT NULL COMMENT '关联的应用ID',
    user_id INT NOT NULL COMMENT '关联的用户ID',
    user_role_id INT NOT NULL COMMENT '关联的角色ID',
    points INT DEFAULT 0 COMMENT '用户积分余额',
    inviter_id INT DEFAULT NULL COMMENT '邀请人用户ID',
    role_expire TIMESTAMP DEFAULT NULL COMMENT '角色到期时间',
    app_status TINYINT NOT NULL DEFAULT 1 COMMENT '当前APP用户状态: 1(激活), 0(禁用)',
    mac_bind JSON DEFAULT NULL COMMENT '绑定的设备信息（JSON格式：设备ID数组,最大绑定数量）',
    custom JSON DEFAULT NULL COMMENT '用户自定义字段',
    login_at TIMESTAMP DEFAULT NULL COMMENT '最近登录时间',
    login_ip CHAR(45) DEFAULT NULL COMMENT '登录IP',
    login_mac VARCHAR(255) DEFAULT NULL COMMENT '登录设备',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP DEFAULT NULL COMMENT '删除时间，NULL表示未删除',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    INDEX idx_user_app (user_id, app_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户应用内容表';
