// functions/get-collect.js
const { JSDOM } = require("jsdom");

// 导出 Pages Server 函数
export async function onRequestGet(context) {
  try {
    // 1. 模拟完整浏览器环境
    const dom = new JSDOM(`<!DOCTYPE html>`, {
      url: "https://ui.ptlogin2.qq.com/",
      referrer: "https://ui.ptlogin2.qq.com/"
    });
    const window = dom.window;
    global.window = window;
    global.document = window.document;
    global.navigator = window.navigator;

    // 补全 tdc.js 需要的环境属性
    window.screen = { width: 1920, height: 1080, colorDepth: 24 };
    window.setTimeout = (fn) => fn(); // 同步执行，避免异步问题
    window.clearTimeout = () => {};
    window.Date = Date;

    // 2. 下载最新 tdc.js
    const tdcUrl = `https://ca.turing.captcha.qcloud.com/tdc.js?app_data=7411631854836305920&t=${Date.now()}`;
    const tdcRes = await fetch(tdcUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://ui.ptlogin2.qq.com/"
      }
    });
    const tdcJsCode = await tdcRes.text();

    // 3. 执行 tdc.js
    eval(tdcJsCode);

    // 4. 自动探测 collect 生成函数
    let collect = "生成失败";
    const keywords = ["getData", "getCollect", "collect"];
    for (const key of Object.keys(window)) {
      const obj = window[key];
      if (typeof obj !== "object") continue;
      for (const k of keywords) {
        if (typeof obj[k] === "function") {
          try {
            const res = obj[k](!0);
            // 验证是否为 Base64 格式（collect 的特征）
            if (typeof res === "string" && /^[A-Za-z0-9+/=]+$/.test(res)) {
              collect = res;
              break;
            }
          } catch (e) {}
        }
      }
      if (collect !== "生成失败") break;
    }

    // 5. 返回结果
    return new Response(JSON.stringify({
      success: collect !== "生成失败",
      collect: collect
    }), {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*" // 允许手机端跨域调用
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({
      success: false,
      error: e.message,
      stack: e.stack
    }), {
      status: 500,
      headers: { "Content-Type": "application/json;charset=utf-8" }
    });
  }
}
