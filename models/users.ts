import db from "@/config/db";
import { nanoid } from "nanoid";
import { Schema } from "mongoose";
import cryptoJs from "crypto-js";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true, // 必填
      unique: true // 唯一性
    }, // 邮箱
    password: {
      type: String,
      required: true, // 必填
      set: (password: string) => {
        if (password.length != 64) {
          return cryptoJs.SHA256(password).toString(cryptoJs.enc.Hex);
        }
      }
    }, // 密码
    vip_time: {
      type: Date,
      default: () => new Date()
    }, // vip到期时间
    sets: {
      type: Object,
      default: () => ({
        theme: "flare",
        language: "zh-CN",
        avatar: `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${nanoid()}&backgroundColor=ffdfbf`
      })
    }, // 设置
    status: {
      type: Number,
      default: 1 // 用户状态：-1-删除，1-正常，0-禁用
    } // 用户状态
  },
  {
    timestamps: {
      createdAt: "created_at", // 使用'created_at'存储创建的日期
      updatedAt: "updated_at" // 使用'updated_at'存储上次更新的日期
    }
  }
);

export default db.model("users", userSchema);
