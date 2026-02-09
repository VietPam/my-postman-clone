// app/api/proxy/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Nhận thông tin từ phía Client gửi lên (URL đích, method, headers...)
    const body = await request.json();
    const { targetUrl, method = 'GET', headers = {}, data = null } = body;

    if (!targetUrl) {
      return NextResponse.json({ error: 'Missing targetUrl' }, { status: 400 });
    }

    // 2. Server Vercel thực hiện gọi request thật đến Mi Hồng (hoặc bất kỳ đâu)
    const response = await fetch(targetUrl, {
      method,
      headers: {
        ...headers,
        // Mẹo: Luôn giả lập User-Agent để tránh bị chặn
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: method !== 'GET' ? JSON.stringify(data) : undefined,
    });

    // 3. Đọc dữ liệu trả về
    const result = await response.json(); // Hoặc .text() nếu API không trả JSON

    // 4. Trả kết quả về cho giao diện của bạn
    return NextResponse.json({
      status: response.status,
      data: result,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}