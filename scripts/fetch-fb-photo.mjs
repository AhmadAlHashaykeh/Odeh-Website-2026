const res = await fetch('https://www.facebook.com/photo/?fbid=902035545907896', {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
  },
  redirect: 'follow',
});
const html = await res.text();
const re = /https:\/\/scontent[^"'\\]+\.(?:jpg|webp)[^"'\\]*/g;
const matches = [...html.matchAll(re)].map((m) => m[0]);
console.log('status', res.status, 'html length', html.length);
console.log('matches', matches.length);
for (const [i, url] of matches.slice(0, 8).entries()) {
  console.log(i, url.slice(0, 150));
}
