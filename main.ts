import config from "@/config";
import routes from "./routes";
import models from "./models";

// 启动服务
routes().listen(process.env.PORT || 3000, () => {
  console.log("🦊 http://localhost:" + process.env.PORT);
});
// console.log(models);

// new models.Users({
//   username: "34751@123.com",
//   password: "12344156"
// }).save();
