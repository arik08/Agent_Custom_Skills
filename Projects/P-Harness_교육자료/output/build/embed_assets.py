"""Bundle deduplicated images at the end of a standalone HTML file."""
import base64
import io
import json
import re
from PIL import Image


def package_images(html):
    assets = {}
    references = {}

    def replace_image(match):
        mime, payload = match.group(1), match.group(2)
        source = (mime, payload)
        if source not in references:
            raw = base64.b64decode(payload)
            if mime != 'image/svg+xml':
                with Image.open(io.BytesIO(raw)) as image:
                    output = io.BytesIO()
                    image.save(output, format='WEBP', quality=85, method=6)
                    raw = output.getvalue()
                mime, extension = 'image/webp', 'webp'
            else:
                extension = 'svg'
            key = f'image-{len(assets) + 1:02}.{extension}'
            references[source] = key
            assets[key] = {'type': mime, 'base64': base64.b64encode(raw).decode('ascii')}
        return f'data-asset="{references[source]}"'

    html = re.sub(r'src="data:(image/[^;]+);base64,([A-Za-z0-9+/=]+)"', replace_image, html)
    manifest = json.dumps(assets, ensure_ascii=True, indent=2)
    loader = '''<script>
// Resolve local image references from this file only; no network is needed.
(()=>{const assets=JSON.parse(document.getElementById('embedded-images').textContent);
document.querySelectorAll('img[data-asset]').forEach(image=>{
  const asset=assets[image.dataset.asset];
  if(asset)image.src='data:'+asset.type+';base64,'+asset.base64;
});})();
</script>'''
    bundle = '\n<!-- Embedded image assets: shared once, including enlarged views. -->\n'
    bundle += '<script id="embedded-images" type="application/json">\n' + manifest + '\n</script>\n' + loader
    return html.replace('</body>', bundle + '\n</body>'), assets
