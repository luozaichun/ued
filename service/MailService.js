var nodemailer = require("nodemailer");
var mailConf = require('../config/mailConf');

/**
 * 发送邮件
 * @param to 收件列表 eg:"123@qq.com, abc@163.com"
 * @param subject 标题
 * @param html html 内容
 * @param success 成功回调函数
 * @param error 失败回调函数
 */
exports.sendMail = function (to, subject, html, success, error) {
    // 开启一个 SMTP 连接池
    var smtpTransport = nodemailer.createTransport("SMTP", {
        host: mailConf.host, // 主机
        secureConnection: true, // 使用 SSL
        port: 465, // SMTP 端口
        auth: {
            user: mailConf.user, // 账号
            pass: mailConf.pass // 密码
        }
    });
    smtpTransport.sendMail({
        from: mailConf.from,
        to: to,
        subject: subject,
        html: html
    }, function (err, response) {
        if (err) {
            console.log(err);
            error(err);
        } else {
            console.log(response);
            success(response);
        }
        smtpTransport.close(); // 关闭连接池
    });

};