export default {
  async fetch(request) {
    const { searchParams } = new URL(request.url);
    const appData = searchParams.get('app_data') || '7411631854836305920';
    const t = searchParams.get('t') || Date.now().toString();
    const tdcUrl = `https://ca.turing.captcha.qcloud.com/tdc.js?app_data=${appData}&t=${t}`;

    try {
      // 1. 下载 tdc.js
      const tdcRes = await fetch(tdcUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' }
      });
      const tdcJs = await tdcRes.text();

      // 2. 模拟浏览器环境执行 JS
      const window = {
        navigator: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' },
        screen: { width: 1920, height: 1080 },
        document: { referrer: 'https://ui.ptlogin2.qq.com/' },
        Date: Date,
        setTimeout: (fn) => fn(),
        clearTimeout: () => {}
      };
      const document = window.document;
      // 注入并执行 tdc.js
      eval(tdcJs);
      const collect = window.TDC.getData(true);

      // 3. 返回结果
      return new Response(JSON.stringify({ success: true, collect }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
