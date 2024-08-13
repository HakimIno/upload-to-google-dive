import { handleRequest } from "./routes/driveRoutes"
addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request, event))
})

// import { encode as base64Encode } from 'base64-arraybuffer'

// interface GoogleTokenResponse {
// 	access_token: string;
// 	token_type: string;
// 	expires_in: number;
// }

// addEventListener('fetch', event => {
// 	event.respondWith(handleRequest(event.request, event))
// })

// async function handleRequest(request: Request, env: any): Promise<Response> {
// 	const url = new URL(request.url);

// 	if (url.pathname === '/') {
// 		return new Response('Upload to Google Drive', {
// 			headers: { 'Content-Type': 'text/plain' },
// 		});
// 	} else if (url.pathname === '/upload') {
// 		if (request.method === 'POST') {
// 			const formData = await request.formData();
// 			const file = formData.get('file') as File | null;

// 			if (!file) {
// 				return new Response('File not found in form data', { status: 400 });
// 			}

// 			const fileName = file.name;
// 			const uploadResult = await uploadToGoogleDrive(file, fileName, env);

// 			return new Response(JSON.stringify(uploadResult), {
// 				headers: { 'Content-Type': 'application/json' },
// 			});
// 		} else {
// 			return new Response('Method Not Allowed', { status: 405 });
// 		}
// 	} else if (url.pathname === '/share') {
// 		if (request.method === 'POST') {
// 			const { fileId, userEmail } = (await request.json()) as { fileId: string; userEmail: string };

// 			if (!fileId || !userEmail) {
// 				return new Response('fileId and userEmail are required', { status: 400 });
// 			}

// 			try {
// 				await shareFileWithUser(fileId, userEmail, env);
// 				return new Response('File shared successfully', { status: 200 });
// 			} catch (error: any) {
// 				return new Response(`Failed to share file: ${error.message}`, { status: 500 });
// 			}
// 		} else {
// 			return new Response('Method Not Allowed', { status: 405 });
// 		}
// 	} else if (url.pathname === '/download') {
// 		if (request.method === 'GET') {
// 			const fileId = url.searchParams.get('fileId');

// 			if (!fileId) {
// 				return new Response('fileId is required', { status: 400 });
// 			}

// 			try {
// 				const fileResponse = await downloadFileFromGoogleDrive(fileId, env);
// 				return new Response(fileResponse.body, {
// 					headers: {
// 						'Content-Type': fileResponse.headers.get('Content-Type') || 'application/octet-stream',
// 						'Content-Disposition': fileResponse.headers.get('Content-Disposition') || 'attachment',
// 					},
// 				});
// 			} catch (error: any) {
// 				return new Response(`Failed to download file: ${error.message}`, { status: 500 });
// 			}
// 		} else {
// 			return new Response('Method Not Allowed', { status: 405 });
// 		}
// 	} else {
// 		return new Response('Not found', { status: 404 });
// 	}
// }

// async function uploadToGoogleDrive(file: File, fileName: string, env: any): Promise<any> {
// 	const accessToken = await getAccessToken(env);

// 	const metadata = {
// 		name: fileName,
// 		mimeType: file.type,
// 	};

// 	const boundary = 'foo_bar_baz';
// 	const delimiter = `\r\n--${boundary}\r\n`;
// 	const closeDelimiter = `\r\n--${boundary}--`;

// 	// ส่วนของ metadata
// 	const metadataPart =
// 		delimiter +
// 		'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
// 		JSON.stringify(metadata) +
// 		'\r\n';

// 	// ส่วนของไฟล์
// 	const filePart =
// 		delimiter +
// 		`Content-Type: ${file.type}\r\n\r\n`;

// 	// สร้าง body โดยรวม metadata และ filePart
// 	const body = new Blob([metadataPart, filePart, new Uint8Array(await file.arrayBuffer()), closeDelimiter], { type: 'multipart/related; boundary=' + boundary });

// 	const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
// 		method: 'POST',
// 		headers: {
// 			Authorization: `Bearer ${accessToken}`,
// 		},
// 		body,
// 	});

// 	return await response.json();
// }

// async function shareFileWithUser(fileId: string, userEmail: string, env: any) {
// 	const accessToken = await getAccessToken(env);

// 	const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
// 		method: 'POST',
// 		headers: {
// 			Authorization: `Bearer ${accessToken}`,
// 			'Content-Type': 'application/json',
// 		},
// 		body: JSON.stringify({
// 			role: 'reader',
// 			type: 'user',
// 			emailAddress: userEmail,
// 		}),
// 	});

// 	if (!response.ok) {
// 		throw new Error(`Failed to share file: ${response.statusText}`);
// 	}
// }

// async function downloadFileFromGoogleDrive(fileId: string, env: any): Promise<Response> {
// 	const accessToken = await getAccessToken(env);

// 	const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
// 		method: 'GET',
// 		headers: {
// 			Authorization: `Bearer ${accessToken}`,
// 		},
// 	});

// 	if (!response.ok) {
// 		throw new Error(`Failed to download file: ${response.statusText}`);
// 	}

// 	return response;
// }

// async function getAccessToken(env: any): Promise<string> {

// 	const privateKey = ""
// 	const clientEmail = ""
// 	if (!privateKey || !clientEmail) {
// 		throw new Error('Environment variables for Google Service Account are missing.');
// 	}

// 	const iat = Math.floor(Date.now() / 1000);
// 	const exp = iat + 3600; // Token valid for 1 hour

// 	const header = {
// 		alg: 'RS256',
// 		typ: 'JWT',
// 	};

// 	const payload = {
// 		iss: clientEmail,
// 		scope: 'https://www.googleapis.com/auth/drive.file',
// 		aud: 'https://oauth2.googleapis.com/token',
// 		exp: exp,
// 		iat: iat,
// 	};

// 	// Encode header and payload to base64
// 	const encodedHeader = base64Encode(new TextEncoder().encode(JSON.stringify(header)));
// 	const encodedPayload = base64Encode(new TextEncoder().encode(JSON.stringify(payload)));

// 	// Sign the JWT using the private key
// 	const unsignedToken = `${encodedHeader}.${encodedPayload}`;
// 	const signature = await crypto.subtle.sign(
// 		{
// 			name: 'RSASSA-PKCS1-v1_5',
// 			hash: 'SHA-256',
// 		},
// 		await importPrivateKey(privateKey),
// 		new TextEncoder().encode(unsignedToken)
// 	);
// 	const encodedSignature = base64Encode(signature);

// 	const jwt = `${unsignedToken}.${encodedSignature}`;

// 	// Exchange JWT for access token
// 	const response = await fetch('https://oauth2.googleapis.com/token', {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/x-www-form-urlencoded',
// 		},
// 		body: new URLSearchParams({
// 			grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
// 			assertion: jwt,
// 		}),
// 	});

// 	const data = await response.json() as GoogleTokenResponse;

// 	if (!data || !data.access_token) {
// 		throw new Error('Failed to obtain access token.');
// 	}

// 	return data.access_token;
// }

// function importPrivateKey(pem: string): Promise<CryptoKey> {
// 	const binaryDerString = pem.replace(/(-----(BEGIN|END) PRIVATE KEY-----|\n|\r)/g, '')
// 	const binaryDer = base64ToArrayBuffer(binaryDerString)

// 	return crypto.subtle.importKey(
// 		'pkcs8',
// 		binaryDer,
// 		{
// 			name: 'RSASSA-PKCS1-v1_5',
// 			hash: 'SHA-256',
// 		},
// 		true,
// 		['sign']
// 	)
// }

// function base64ToArrayBuffer(base64: string): ArrayBuffer {
// 	const binaryString = atob(base64)
// 	const len = binaryString.length
// 	const bytes = new Uint8Array(len)
// 	for (let i = 0; i < len; i++) {
// 		bytes[i] = binaryString.charCodeAt(i)
// 	}
// 	return bytes.buffer
// }
