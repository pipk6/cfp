// functions/get-collect.js
export async function onRequestGet(context) {
  // 直接返回固定的测试 JSON
  return new Response(JSON.stringify({
    success: true,
    test: "接口正常工作",
    collect: "test_collect_123456" // 模拟 collect 返回
  }), {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*" // 允许跨域
    }
  });
}
